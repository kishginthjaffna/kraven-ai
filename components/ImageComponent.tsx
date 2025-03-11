'use client';

import { Tables } from '@/database.types'
import Image from 'next/image';
import React, { useState } from 'react'
import ImageDialog from './ImageDialog';

type ImageProps = {
    url: string | undefined,
} & Tables<'generated_images'>

interface ImageComponentProps {
    images: ImageProps[];
}

const ImageComponent = ({ images }: ImageComponentProps) => {
    const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);

    console.log(images);

    if (images.length === 0) {
        return (
          <div className='flex items-center justify-center text-muted-foreground h-[50vh]'>
            No Generated Images.
          </div>
        );
    }

    return (
      <div className='container mx-auto py-8'>
        <div className='columns-4 gap-4 space-y-4'>
          {images.map((image) => (
            <div key={image.id ?? image.url} className='group'>
              <div className='relative overflow-hidden cursor-pointer transition-transform group'
                onClick={() => setSelectedImage(image)}>
                {/* Overlay effect */}
                <div className='absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-70 rounded flex items-center justify-center'>
                  <p className='text-primary-foreground text-lg font-semibold'>View Details</p>
                </div>
                
                {/* Image component */}
                {image.url ? (
                  <Image 
                    src={image.url} 
                    alt={image.prompt || 'Generated Image'} 
                    width={image.width || 500} // Default width
                    height={image.height || 500} // Default height
                    className='object-cover rounded' 
                  />
                ) : (
                  <div className="bg-gray-300 w-full h-64 flex items-center justify-center rounded">
                    <p className="text-gray-600">Image Not Available</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div> 
        {selectedImage && <ImageDialog image={selectedImage} onClose={() => setSelectedImage(null)}/>}
      </div>
    );
}

export default ImageComponent;
