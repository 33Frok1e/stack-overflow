'use server'

import Question from '@/database/question.model';
import dbConnect from '../mongoose'
import Tag from '@/database/tag.model';
import { CreateQuestionParams, GetQuestionsParams } from '@/types/action';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';


export async function getQuestions(params: GetQuestionsParams) {
    try {
        dbConnect();

        const questions = await Question.find({})
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User})
            .sort({ createdAt: -1 })
            
        return { questions }
    } catch (e) {
        console.log(params);
        console.log(e);
        throw e;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        dbConnect();

        const { title, content, tags, author, path } = params;
        
        // Create the question
        const question = await Question.create({
            title,
            content,
            author
        });

        const tagDocuments = [];

        // create the tags or get them if they already exist
        for(const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                { upsert: true, new: true }
            )

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(
            question._id,
            { $push: { tags: { $each: tagDocuments }}},
        );

        // Create an interaction record for the user's ask-question action

        // Increament author's reputation by +5 for creating a question

        revalidatePath(path);

    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
}