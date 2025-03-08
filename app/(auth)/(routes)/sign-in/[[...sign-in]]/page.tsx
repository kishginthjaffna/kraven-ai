'use client';

import React from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';



const formSchema = z.object({
    email: z.string().email({
      message: "*Please Enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "*Password must be at least 8 characters",
    })
    
})

const Page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    
    return (
        <div className='w-1/2 h-[70%] space-y-6 p-6 rounded-lg border-black border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.8)]'>
            <div className='flex flex-col spac-y-2 text-center items-center p-5'>
                <Image src="/images/logo3.png" alt="logo" width={60} height={60} className='w-20 h-20 mr-4'/>
                <h1 className='text-2xl font-semibold tracking-tight'>Sign in to Kraven AI</h1>
                <p className='text-sm text-muted-foreground'> Easy, Fast, Accurate and Perfect</p>
            </div>
            <div className={cn("grid gap-6")}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Enter your email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Enter your password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" {...field} />
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className='bg-orange-700 border-1 w-[400px] mb-5 mt-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-800 cursor-pointer'>Sign in</Button>
                    </form>
                    <div className="flex justify-between text-center">
                        
                        <div className='flex gap-2'>
                            <p className='text-sm text-muted-foreground'> Don&apos;t have an account? </p>
                            <Link href="/sign-up" className='text-sm underline text-orange-700 hover:text-orange-800'>Sign-up</Link>
                        </div>

                        <Link href="/reset-password" className='text-sm underline text-orange-700 hover:text-orange-800 ml-auto'>Forgot Password?</Link>
                    </div>
            </Form>
            </div>
        </div>
    )
}

export default Page
