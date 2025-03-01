import QuestionForm from '@/components/forms/QuestionForm'
import { getUserById } from '@/lib/actions/user.action';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {

  const { userId } = useAuth();
  if (!userId) redirect('/sign-in');
  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
      <div className='mt-9'>
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  )
}

export default Page