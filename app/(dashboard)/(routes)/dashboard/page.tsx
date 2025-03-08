'use client';

import React, { useEffect } from 'react'
import { tools } from '@/constants/constants';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();

    return (
        <div className='mx-10'>
            <div className='mb-8 space-y-4'>
                <h2 className='text-6xl md:text-4xl font-bold text-center text-orange-700'>
                    Tired of searching perfect resources for your projects?
                </h2>
                <p className='text-muted-foreground text-xl md:text-lg text-center w-3/5 mx-auto'> Then generate resources and download it using Kraven AI. Fast, Easy and Accurate. </p>
            </div>
            <div className='px-4 md:px-20 lg:px-32 space-y-4 bg-orange-700 p-10 rounded-xl md:bg-white'>
                {tools.map((tool) => (
                    <Card key={tool.href} 
                          onClick={() => router.push(tool.href)}
                          className='p-4 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.8)] flex items-center justify-between hover:shadow-md transition cursor-pointer'
                    >
                        <div className='flex items-center gap-x-4'>
                            <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                                <tool.icon className={cn('w-8 h-8', tool.color)}/> 
                            </div>
                            <div className='font-semibold'>{tool.label}</div>
                        </div>

                        <ArrowRight className='w-5 h-5' />
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default page
