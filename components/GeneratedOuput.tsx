'use client';

import React from 'react';
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
import { useGeneratedStore } from '@/hooks/useGeneratedStore';
import { Loader } from 'lucide-react';

const GeneratedOutput = () => {
    const images = useGeneratedStore((state) => state.images);
    const loading = useGeneratedStore((state) => state.loading);
    const error = useGeneratedStore((state) => state.error);
    const plugin = React.useMemo(() => Autoplay({ delay: 2000, stopOnInteraction: true }), []);

    if (error) {
        return (
            <Card className="w-full max-w-2xl shadow-none border-none ">
                <CardContent className="flex items-center justify-center aspect-square p-6">
                    <span className="text-2xl text-red-500">Error in generating images!!</span>
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="w-full max-w-2xl min-h-[400px] flex items-center justify-center shadow-none border-none">
                <CardContent className="flex flex-col gap-5 items-center justify-center aspect-square p-6">
                    <Loader className="h-12 w-12 animate-spin text-orange-700" />
                    <span className="text-xl text-orange-700">Kraven is cooking your recipe...</span>
                </CardContent>
            </Card>
        );
    }

    if (images.length === 0) {
        return (
            <Card className="w-full max-w-2xl min-h-[400px] flex items-center justify-center shadow-none border-none">
                <CardContent className="flex items-center justify-center aspect-square p-6">
                    <span className="text-2xl text-muted-foreground">Input a prompt and start generating images fast and easy.</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <div>
            <Carousel
                plugins={[plugin]}
                className="w-full max-w-2xl min-h-[400px]"
                onMouseEnter={plugin.stop}
                onMouseLeave={plugin.reset}
            >
                <CarouselContent>
                    {images
                        .filter((image) => image.url) // Ensure only valid images are rendered
                        .map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 flex items-center justify-center overflow-hidden aspect-square">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <Image 
                                                src={image.url} 
                                                alt="Generated Output" 
                                                width={500} 
                                                height={500} 
                                                className="object-cover" 
                                            />
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
    );
};

export default GeneratedOutput;
