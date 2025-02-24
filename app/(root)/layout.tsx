import LeftSidebar from '@/components/navigation/LeftSidebar'
import Navbar from '@/components/navigation/navbar/Navbar'
import React from 'react'

const Layout = ({ children }: { children:React.ReactNode }) => {
  return (
    <main className='relative background-light850_dark100'>
        <Navbar />
        <div className='flex'>
            <LeftSidebar />
            <section className='min-h-screen flex flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14'>
                <div className='mx-auto w-full max-w-5xl'>
                    {children}
                </div>
            </section>
            {/* RightSidebar */}
        </div>
    </main>
  )
}

export default Layout