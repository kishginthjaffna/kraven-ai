import { fetchModels } from '@/app/actions/model'
import ModelsList from '@/components/ModelsList';
import React from 'react'

const page = async () => {
  const data = await fetchModels();

  return (
    <section className='container mx-auto'>
      <div className='mb-8'>
      <h1 className='text-3xl font-semibold mb-2'>My Models</h1>
      <p className='text-muted-foreground text-sm mb-6'> View and Manage your trained models. </p>
      </div>
      <ModelsList models={data}/>
    </section>
  )
}

export default page
