"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import React from 'react';
import { viewQuestion } from "@/lib/actions/interaction.action";
import toast from 'react-hot-toast'; // Updated import

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasAlreadyUpvoted: boolean;
  downvotes: number;
  hasAlreadyDownvoted: boolean;
  hasSaved?: boolean;
  disableVoting: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasAlreadyUpvoted,
  downvotes,
  hasAlreadyDownvoted,
  hasSaved,
  disableVoting,
}: Props) => {
  const pathname = usePathname();

  const handleSave = useCallback(async () => {
    if (!userId) {
      return toast.error("Please log in"); // Updated to react-hot-toast
    }
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
    return toast.success(`Question ${!hasSaved ? "saved in" : "removed from"} your collection`); // Updated to react-hot-toast
  }, [hasSaved, itemId, pathname, userId]);

  const handleVote = useCallback(
    async (action: string) => {
      if (disableVoting) {
        return;
      }
      if (!userId) {
        return toast.error("Please log in"); // Updated to react-hot-toast
      }
      if (action === "upvote") {
        if (type === "Question") {
          await upvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted,
            hasAlreadyDownvoted,
            path: pathname,
          });
        } else if (type === "Answer") {
          await upvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted,
            hasAlreadyDownvoted,
            path: pathname,
          });
        }
        return toast.success(`Upvote ${!hasAlreadyUpvoted ? "successful" : "removed"}`); // Updated to react-hot-toast
      }

      if (action === "downvote") {
        if (type === "Question") {
          await downvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted,
            hasAlreadyDownvoted,
            path: pathname,
          });
        } else if (type === "Answer") {
          await downvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted,
            hasAlreadyDownvoted,
            path: pathname,
          });
        }
        return toast.success(`Downvote ${!hasAlreadyDownvoted ? "successful" : "removed"}`); // Updated to react-hot-toast
      }
    },
    [
      disableVoting,
      hasAlreadyDownvoted,
      hasAlreadyUpvoted,
      itemId,
      pathname,
      type,
      userId,
    ]
  );

  useEffect(() => {
    if (type === "Question") {
      viewQuestion({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      });
    }
  }, [itemId, type, userId]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasAlreadyUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className={`${
              disableVoting ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasAlreadyDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className={`${
              disableVoting ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;