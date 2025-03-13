/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/navigation/search/LocalSearch";
import NoResults from "@/components/NoResults";
import Pagination from "@/components/Pagination";
import {
  PAGE_NUMBER_SEARCH_PARAMS_KEY,
  QUERY_SEARCH_PARAMS_KEY,
} from "@/constants";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: URLProps): Promise<Metadata> {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    pageSize: 1,
  });
  return {
    title: `Questions with Tag '${result.tagTitle}' | Dev Overflow`,
    description: `View questions with tag '${result.tagTitle}' on Dev Overflow - A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers from around the world. Explore topics in web developments, mobile app development, algorithms, data structures and more...`,
  };
}

const Page = async ({ params, searchParams }: URLProps) => {
    const searchQuery =
      Array.isArray(searchParams[QUERY_SEARCH_PARAMS_KEY])
        ? searchParams[QUERY_SEARCH_PARAMS_KEY][0]
        : searchParams[QUERY_SEARCH_PARAMS_KEY];
  
    const page =
      searchParams[PAGE_NUMBER_SEARCH_PARAMS_KEY] &&
      !Array.isArray(searchParams[PAGE_NUMBER_SEARCH_PARAMS_KEY])
        ? +searchParams[PAGE_NUMBER_SEARCH_PARAMS_KEY]
        : 1;
  
    const result = await getQuestionsByTagId({
      tagId: params.id,
      page,
      searchQuery,
    });
  
    return (
      <>
        <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
        <div className="mt-11 w-full">
          <LocalSearch
            route={`/tags/${params.id}`}
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search tag questions"
            otherClasses="flex-1"
          />
        </div>
        <div className="mt-10 flex w-full flex-col gap-6">
          {result.questions.length > 0 ? (
            result.questions.map((question: any) => (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            ))
          ) : (
            <NoResults
              title="There's no tag question saved to show"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
              link="/ask-question"
              linkTitle="Ask a Question"
            />
          )}
        </div>
        <div className="mt-10">
          <Pagination pageNumber={page} isNext={result.isNext} />
        </div>
      </>
    );
};
  
export default Page;
  