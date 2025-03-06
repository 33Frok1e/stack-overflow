/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { KeyboardEvent, useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validations";
import dynamic from "next/dynamic";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  type?: "Edit";
  mongoUserId: string;
  questionDetails?: string;
}

const QuestionForm = ({ type, mongoUserId, questionDetails }: Props) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails = questionDetails
    ? JSON.parse(questionDetails ?? "{}")
    : {};

  const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title ?? "",
      explanation: parsedQuestionDetails?.content ?? "",
      tags: groupedTags ?? [],
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof QuestionSchema>) => {
      setIsSubmitting(true);
      try {
        if (type === "Edit") {
          await editQuestion({
            questionId: parsedQuestionDetails._id,
            title: values.title,
            content: values.explanation,
            path: pathname,
          });
          router.push(`/question/${parsedQuestionDetails._id}`);
        } else {
          await createQuestion({
            title: values.title,
            content: values.explanation,
            tags: values.tags,
            author: JSON.parse(mongoUserId),
            path: pathname,
          });
          router.push("/");
        }
        // Show success toast
        toast.success(
          type === "Edit"
            ? "Question updated successfully!"
            : "Question posted successfully!"
        );
      } catch (error) {
        console.error(
          `${
            type === "Edit"
              ? "Updating question failed. "
              : "Posting question failed. "
          } Details: `,
          error
        );
        // Show error toast
        toast.error(
          type === "Edit"
            ? "Updating question failed. Please try again."
            : "Posting question failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [mongoUserId, parsedQuestionDetails._id, pathname, router, type]
  );

  const handleInputKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      field: ControllerRenderProps<
        {
          title: string;
          explanation: string;
          tags: string[];
        },
        "tags"
      >
    ) => {
      if (e.key === "Enter" && field.name === "tags") {
        e.preventDefault();
        const tagInput = e.target as HTMLInputElement;
        const tagValue = tagInput.value
          .trim()
          .replace(/\s+/g, "")
          .toUpperCase();
        if (tagValue !== "") {
          if (tagValue.length > 15) {
            return form.setError("tags", {
              type: "required",
              message: "Tag must be less than 15 characters.",
            });
          }

          if (!field.value.includes(tagValue as never)) {
            form.setValue("tags", [...field.value, tagValue]);
            tagInput.value = "";
            form.clearErrors("tags");
          }
        } else {
          form.trigger();
        }
      }
    },
    [form]
  );

  const handleTagRemove = useCallback(
    (
      tag: string,
      field: ControllerRenderProps<
        {
          title: string;
          explanation: string;
          tags: string[];
        },
        "tags"
      >
    ) => {
      if (type === "Edit") {
        return;
      }
      const newTags = field.value.filter((t: string) => t !== tag);
      form.setValue("tags", newTags);
    },
    [form, type]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  placeholder="Enter your question...!"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  value={field.value}
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add Tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    disabled={type === "Edit"}
                  />

                  {field.value.length > 0 ? (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: string) => (
                        <Badge
                          key={tag}
                          className={`subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize ${
                            type === "Edit"
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() => handleTagRemove(tag, field)}
                        >
                          {tag}
                          {type !== "Edit" ? (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close icon"
                              width={12}
                              height={12}
                              className={`${
                                type === "Edit"
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              } object-contain invert-0 dark:invert`}
                            />
                          ) : null}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Updating..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Update Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
