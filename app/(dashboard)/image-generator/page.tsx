import GeneratedOuput from '@/components/GeneratedOuput'
import ImageConfig from '@/components/ImageConfig'
import React from 'react'

const page = () => {
  return (
    <section className='container mx-auto grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
      <ImageConfig/>
      <div className='col-span-2 p-4 rounded-xl flex items-center justify-center h-full'>
        <GeneratedOuput/>
      </div>
    </section>
  )
}

export default page
