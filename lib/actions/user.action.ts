'use server'

import User from '@/database/user.model';
import dbConnect from '../mongoose';
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from '@/types/action';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

interface Params {
    userId: string;
}

export async function getUserById(params: Params) {
    try {
        dbConnect();

        const { userId } = params;
        const user = await User.findOne({ clerkId: userId });
        return user;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        dbConnect();

        const newUser = await User.create(userData)
        return newUser;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        dbConnect();

        const { clerkId, updateData, path } = params;
        await User.findOneAndUpdate({ clerkId }, updateData, {
            new: true,
        });

        revalidatePath(path);
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        dbConnect();

        const { clerkId } = params;
        const user = await User.findOneAndDelete({ clerkId });

        if(!user) {
            throw new Error('User not found');
        }
        // Delete user from database 
        // and questions, answers, comments etc.

        // get user question ids
        const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');

        // delete user questions
        await Question.deleteMany({ author: user._id })
        return deleteUser;
    } catch (e) {
        console.log(e)
        throw e;
    }
}