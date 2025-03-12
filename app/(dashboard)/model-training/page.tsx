import ModelTrainingForm from '@/components/ModelTrainingForm'
import React from 'react'

const page = () => {
  return (
    <section className='container mx-auto'>
      <h1 className='text-3xl font-semibold mb-2'>Model Training</h1>
      <p className='text-muted-foreground text-sm mb-6'> Train your own model by inputing set of your own images as a zip folder. </p>
      <ModelTrainingForm/>
    </section>
  )
}

export default page
