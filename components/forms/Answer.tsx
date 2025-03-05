/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
// import { useTheme } from "@/context/Theme";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
// import { toast } from "../ui/use-toast";
import React from 'react'
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { toast } from "sonner";
// import toast from 'react-hot-toast';

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setSetIsSubmittingAI] = useState(false);
  // const { mode } = useTheme();
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
      toast("Answer submitted successfully"); // Updated toast syntax
    } catch (error) {
      console.error(error);
      toast("Failed to submit answer"); // Updated toast syntax
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIAnswer = async () => {
    if (!authorId) return;
    setSetIsSubmittingAI(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );
      const aiAnswer = await response.json();
      // Convert plain text to HTML format
      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }
      toast("Generated AI answer"); // Updated toast syntax
    } catch (error) {
      console.error(error);
      toast("Failed to generate AI answer"); // Updated toast syntax
    } finally {
      setSetIsSubmittingAI(false);
    }
  };

  // const isDarkMode = useMemo(() => mode === "dark", [mode]);

  if (!authorId) {
    return (
      <h4 className="paragraph-semibold text-dark400_light800">
        Please login to answer this question.
      </h4>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
