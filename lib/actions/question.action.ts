'use server'

import Question from '@/database/question.model';
import {connectToDatabase} from '../mongoose'
import Tag from '@/database/tag.model';
import { CreateQuestionParams, GetQuestionsParams } from '@/types/action';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { FilterQuery } from 'mongoose';
import Interaction from '@/database/interaction.model';

export async function getQuestions(params: GetQuestionsParams) {
    try {
      connectToDatabase();
      const { searchQuery, filter, page = 1, pageSize = 10 } = params;
      // Calculcate the number of posts to skip based on the page number and page size
      const skipAmount = (page - 1) * pageSize;
      const query: FilterQuery<typeof Question> = {};
      if (searchQuery) {
        query.$or = [
          { title: { $regex: new RegExp(searchQuery, "i") } },
          { content: { $regex: new RegExp(searchQuery, "i") } },
        ];
      }
      let sortOptions = {};
      switch (filter) {
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "frequent":
          sortOptions = { views: -1 };
          break;
        case "unanswered":
          query.answers = { $size: 0 };
          break;
        default:
          break;
      }
      const questions = await Question.find(query)
        .populate({ path: "tags", model: Tag })
        .populate({ path: "author", model: User })
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOptions);
      const totalQuestions = await Question.countDocuments(query);
      const isNext = totalQuestions > skipAmount + questions.length;
      return { questions, isNext };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function createQuestion(params: CreateQuestionParams) {
    try {
      connectToDatabase();
      const { title, content, tags, author, path } = params;
      // Create the question
      const question = await Question.create({
        title,
        content,
        author,
      });
      const tagDocuments = [];
      // Create the tags or get them if they already exist
      for (const tag of tags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $push: { questions: question._id } },
          { upsert: true, new: true }
        );
        tagDocuments.push(existingTag._id);
      }
      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } },
      });
      // Create an interaction record for the user's ask_question action
      await Interaction.create({
        user: author,
        action: "ask_question",
        question: question._id,
        tags: tagDocuments,
      });
      // Increment author's reputation by +5 for creating a question
      await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
      revalidatePath(path);
    } catch (error) {
      console.error(error);
    }
  }