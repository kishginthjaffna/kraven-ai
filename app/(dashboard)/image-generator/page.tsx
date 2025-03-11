import GeneratedOuput from '@/components/GeneratedOuput'
import ImageConfig from '@/components/ImageConfig'
import React from 'react'

const page = () => {
  return (
    <section className='container mx-auto grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 md:p-4'>
      <ImageConfig/>
      <div className='col-span-1 md:col-span-2 lg:col-span-2 p-4 rounded-xl flex flex-col md:flex-row items-center justify-center h-fit'>
        <GeneratedOuput/>
      </div>
    </section>
  )
}

export default page
