'use client';

import React from 'react'
import { z } from 'zod';

const formSchema = z.object({
    email: z.string().email({
      message: "Please Enter a valid email address",
    }),
    
})

const Page = () => {
    return (
        <div className='space-y-6 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.8)]'>
            <div className='flex flex-col spac-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
                <p className='text-sm text-muted-foreground'> Create your free account now </p>
            </div>
            <div>

            </div>
        </div>
    )
}

export default Page
