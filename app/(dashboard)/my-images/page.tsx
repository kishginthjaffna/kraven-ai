import { getImages } from '@/app/actions/image';
import ImageComponent from '@/components/ImageComponent'
import React from 'react'

const page = async () => {
  const {data: images} = await getImages();

  return (
    <section className='container mx-auto'>
      <h1 className='text-3xl font-bold tracking-tight'>My Images</h1>
      <p className='text-muted-foreground text-sm mb-6'> Here you can see all your generated images and their details</p>
      <ImageComponent images={images || []}/>
    </section>
  )
}

export default page
