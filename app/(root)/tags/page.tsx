import Filter from "@/components/filters/Filter";
import LocalSearch from "@/components/navigation/search/LocalSearch";
import NoResults from "@/components/NoResults";
import Pagination from "@/components/Pagination";
import {
  FILTER_SEARCH_PARAMS_KEY,
  PAGE_NUMBER_SEARCH_PARAMS_KEY,
  QUERY_SEARCH_PARAMS_KEY,
} from "@/constants";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Tags | Dev Overflow",
  description:
    "View the tags used on Dev Overflow - A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers from around the world. Explore topics in web developments, mobile app development, algorithms, data structures and more...",
};

interface Tag {
  _id: string;
  name: string;
  questions: string[];
}

const Page = async ({ searchParams }: SearchParamsProps) => {
  const resolvedSearchParams = await searchParams;

  const searchQuery =
    typeof resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY] === "string"
      ? resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]
      : Array.isArray(resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY])
        ? resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY][0]
        : undefined;

  const filter =
    typeof resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY] === "string"
      ? resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]
      : Array.isArray(resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY])
        ? resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY][0]
        : undefined;

  const page =
    resolvedSearchParams[PAGE_NUMBER_SEARCH_PARAMS_KEY] &&
    !Array.isArray(resolvedSearchParams[PAGE_NUMBER_SEARCH_PARAMS_KEY])
      ? +resolvedSearchParams[PAGE_NUMBER_SEARCH_PARAMS_KEY]
      : 1;

  const result = await getAllTags({
    searchQuery,
    filter,
    page,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag: Tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>{" "}
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResults
            title="No Tags Found"
            description="It looks like no tags are found."
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </>
  );
};

export default Page;