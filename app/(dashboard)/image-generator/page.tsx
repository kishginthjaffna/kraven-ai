import { fetchModels } from '@/app/actions/model'
import GeneratedOuput from '@/components/GeneratedOuput'
import ImageConfig from '@/components/ImageConfig'
import React from 'react'

interface searchParams{
  model_id?: string
}

const page = async ( {searchParams}: {searchParams: Promise<searchParams>}) => {

  const model_id = (await searchParams).model_id;
  const { data: userModels} = await fetchModels();


  return (
    <section className='container mx-auto grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 md:p-4'>
      <ImageConfig userModels={userModels || []} model_id={model_id}/>
      <div className='col-span-1 md:col-span-2 lg:col-span-2 p-4 rounded-xl flex flex-col md:flex-row items-center justify-center h-fit'>
        <GeneratedOuput/>
      </div>
    </section>
  )
}

export default page
