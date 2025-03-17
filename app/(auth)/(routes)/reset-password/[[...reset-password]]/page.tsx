'use client';

import React, { useId } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { resetPassword } from '@/app/actions/auth';
import { toast } from 'sonner';

const passwordValidation = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

const formSchema = z.object({
  email: z.string().email({
    message: '*Please Enter a valid email address',
  })
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const toastId = useId();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading('Sending password reset mail to your email...', {id: toastId, duration: 5000 });
    try {
      const { success, error } = await resetPassword({email: values.email || ''});
  
      if (success) {
        toast.success('Password reset mail sent successfully!', { id: toastId, duration: 5000 });
      } else {
        toast.error(error || 'Error in sending mail', { id: toastId, duration: 5000 });
      }
    } catch (error: any) {
      console.error('Error in resetting password:', error);
      toast.error('Something went wrong. Please try again.', { id: toastId, duration: 5000 });
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.8)]">
      {/* Logo and Header */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <Image src="/images/logo3.png" alt="logo" width={60} height={60} className="w-20 h-20" />
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter your email to reset your password</p>
      </div>

      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">          
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

          
          <Button
            type="submit"
            className="w-full bg-orange-700 border border-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-800 cursor-pointer"
          >
            Reset Password
          </Button>
        </form>
      </Form>

      
      <div className="flex justify-center items-center text-center text-sm">
        <div className="flex gap-2">
          <Link href="/sign-in" className="underline text-orange-700 hover:text-orange-800">
            Back to Sign in
          </Link>
        </div>
      </div>

    
    </div>
  );
};

export default Page;
