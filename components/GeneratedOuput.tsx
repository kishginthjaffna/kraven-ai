'use client'

import React from 'react'
import { Card, CardContent } from './ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
  

const images= [
    {
        src: '/images/bg-1.jpeg',
        alt: 'Image 1'
    },
    {
        src: '/images/bg-2.jpg',
        alt: 'Image 2'
    },
    {
        src: '/images/logo.png',
        alt: 'Image 3'
    },
    {
        src: '/images/bg-1.jpeg',
        alt: 'Image 4'
    },
];

const GeneratedOuput = () => {
    if (images.length === 0) {
        return <Card className='w-full max-w-2xl bg-red-500/5 border-2 border-red-500'>
            <CardContent className='flex items-center justify-center aspect-square p-6'>
                <span className='text-2xl text-red-500'>Error in generating images!!</span>
            </CardContent>
        </Card>
    }
    
    const plugin = React.useMemo(() => Autoplay({ delay: 2000, stopOnInteraction: true }), []);

    
    return (
        <div >
            <Carousel
                plugins={[plugin]}
                className="w-full max-w-2xl min-h-[400px] "
                onMouseEnter={plugin.stop}
                onMouseLeave={plugin.reset}
                >
                <CarouselContent>
                    {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1 flex items-center justify-center overflow-hidden aspect-square">
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                            <Image src={image.src} alt={image.alt} width={500} height={500} className="object-cover" />
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default GeneratedOuput
