'use client';
import React, { useId, useState } from 'react'
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updatePassword } from '../../../../actions/auth';
import { redirect, useRouter } from 'next/navigation';

const passwordValidation = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

const formSchema = z.object({
  password: z
    .string({ required_error: '*Password is required' })
    .min(8, { message: '*Password must be at least 8 characters' })
    .regex(passwordValidation, {
      message:
        '*Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }),
  confirmPassword: z.string({ required_error: '*Confirm Password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "*Passwords don't match",
  path: ['confirmPassword'],
});



const Page = () => {
    const toastId = useId();
    const [loading, setLoading] = useState(false);
    const router= useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Updating password...", {id: toastId, duration: 5000});
        setLoading(true);
        const { success, error } = await updatePassword(values.password);

        if(success) {
            toast.success("Password updated successfully!", {id: toastId, duration: 5000});
            router.push('/sign-in');
        } else {
            toast.error(error || 'Error in updating password', {id: toastId, duration: 5000});
        }
        setLoading(false);
        
    }
    
    return (
        <div className='w-full max-w-md p-6 sm:p-8 space-y-6 rounded-lg border-black border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.8)] mx-auto'>
            <div className='flex flex-col space-y-1 text-center items-center p-5'>
                <Image src="/images/logo3.png" alt="logo" width={60} height={60} className='w-16 h-16 sm:w-20 sm:h-20' />
                <h1 className='text-xl sm:text-2xl font-semibold tracking-tight'>Change your password</h1>
                <p className='text-xs sm:text-sm text-muted-foreground'>Choose a strong password with the combination of capital & small letters, numbers and special characters.</p>
            </div>
            <div className={cn("grid gap-4 sm:gap-6")}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>New Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="Enter your new password" {...field} className="w-full"/>
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        />

                        <Button type="submit" className='bg-orange-700 border-1 w-full mb-5 mt-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-800 cursor-pointer'>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </form>
            </Form>
            </div>
        </div>
    )
}

export default Page
