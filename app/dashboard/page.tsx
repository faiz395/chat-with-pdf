import PlaceholderDocument from '@/components/PlaceholderDocument'
import React from 'react'

function page() {
  return (
    <div className='bg-indigo-50 flex justify-center items-center h-full max-w-7xl mx-auto my-5 py-6'>
      <div className=" max-w-4xl text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
          My Documents
        </h3>
        <div className='my-10 flex justify-center items-center'>
          <PlaceholderDocument/>
        </div>
      </div>
    </div>
  )
}

export default page