'use client';

import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signUp } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

const passwordValidation = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

const formSchema = z.object({
  fullname: z.string().min(3, {
    message: '*Enter a valid name',
  }),
  email: z.string().email({
    message: '*Please Enter a valid email address',
  }),
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

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullname: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('fullname', values.fullname);

    const { success, error } = await signUp(formData);

    if (!success) {
      toast.error(error);
      setLoading(false);
    } else {
      toast.success('Signed up successfully! Please Confirm your email.');
      setLoading(false);
      redirect('/sign-in');
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.8)]">
      {/* Logo and Header */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <Image src="/images/logo3.png" alt="logo" width={60} height={60} className="w-20 h-20" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign up to Kraven AI today!</h1>
        <p className="text-sm text-muted-foreground">Easy, Fast, Accurate and Perfect</p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm Password" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-700 border border-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-800 cursor-pointer"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>
        </form>
      </Form>

      {/* Links */}
      <div className="flex justify-center items-center text-center text-sm">
        <div className="flex gap-2">
          <p className="text-muted-foreground">Already have an account?</p>
          <Link href="/sign-in" className="underline text-orange-700 hover:text-orange-800">
            Sign-in
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center items-center text-center text-sm">
        <p className="text-muted-foreground">
          By signing up, you agree to our{' '} <br/>
          <Link href="/terms" className="underline text-orange-700 hover:text-orange-800">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline text-orange-700 hover:text-orange-800">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Page;
