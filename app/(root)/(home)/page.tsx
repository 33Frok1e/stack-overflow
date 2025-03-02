import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/filters/Filter";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/navigation/search/LocalSearch";
import NoResults from "@/components/NoResults";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";


// const questions = [
//   {
//     _id: "1",
//     title: "Cascading deletes in SQLAlchemy",
//     tags: [
//       { _id: "1", name: "python" },
//       { _id: "2", name: "sql" },
//     ],
//     author: {
//       _id: "101",
//       name: "Krishna Rati",
//       picture: "https://example.com/avatar1.jpg",
//     },
//     upvotes: 10000,
//     views: 15000000,
//     answers: [
//       // { _id: "201", text: "You can use cascade='all, delete-orphan' in SQLAlchemy." },
//     ],
//     createdAt: new Date("2025-01-01T12:00:00.000Z"),
//   },
//   {
//     _id: "2",
//     title: "How to center a div?",
//     tags: [
//       { _id: "3", name: "css" },
//       { _id: "4", name: "html" },
//     ],
//     author: {
//       _id: "102",
//       name: "Krishna Rati",
//       picture: "https://example.com/avatar2.jpg",
//     },
//     upvotes: 10,
//     views: 100,
//     answers: [
//       // { _id: "202", text: "Use flexbox: display: flex; justify-content: center; align-items: center;" },
//     ],
//     createdAt: new Date("2025-01-01T12:00:00.000Z"),
//   },
// ];


const Home = async () => {

  const result = await getQuestions({});
  
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0
          ? result.questions.map((question) => (
            <QuestionCard 
              key={question._id} 
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
          : <NoResults
              title='There&apos;s no question to show'
              description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
              link='/ask-question'
              linkTitle='Ask a Question'
          />}
      </div>
    </>
  );
};

export default Home;
