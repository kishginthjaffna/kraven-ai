'use client';

import React, { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { toast} from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    email: z.string().email({
      message: "*Please Enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "*Password must be at least 8 characters",
    })
})



const Page = async () => {
    
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('password', values.password);

        const { success, error } = await signIn(formData);

        if (!success) {
            toast.error(error);
            setLoading(false);
        } else {
            toast.success('Signed in successfully!');
            setLoading(false);
            redirect('/dashboard');
        }
    }
    
    return (
        <div className='w-full max-w-md p-6 sm:p-8 space-y-6 rounded-lg border-black border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.8)] mx-auto'>
            <div className='flex flex-col space-y-1 text-center items-center p-5'>
                <Image src="/images/logo3.png" alt="logo" width={60} height={60} className='w-16 h-16 sm:w-20 sm:h-20' />
                <h1 className='text-xl sm:text-2xl font-semibold tracking-tight'>Sign in to Kraven AI</h1>
                <p className='text-xs sm:text-sm text-muted-foreground'> Easy, Fast, Accurate and Perfect</p>
            </div>
            <div className={cn("grid gap-4 sm:gap-6")}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} className="w-full" />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        />

                        <Button type="submit" className='bg-orange-700 border-1 w-full mb-5 mt-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-800 cursor-pointer'>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign in
                        </Button>
                    </form>
                    <div className="flex flex-col sm:flex-row justify-between text-center gap-3 sm:gap-0">
                        <div className='flex flex-col sm:flex-row gap-1 sm:gap-2'>
                            <p className='text-xs sm:text-sm text-muted-foreground'> Don&apos;t have an account? </p>
                            <Link href="/sign-up" className='text-xs sm:text-sm underline text-orange-700 hover:text-orange-800'>Sign-up</Link>
                        </div>

                        <Link href="/reset-password" className='text-xs sm:text-sm underline text-orange-700 hover:text-orange-800'>Forgot Password?</Link>
                    </div>
            </Form>
            </div>
        </div>
    )
}

export default Page
