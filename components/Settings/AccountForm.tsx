'use client'
import React, { useId } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { updateProfile } from '@/app/actions/auth';
import { User } from '@supabase/supabase-js';

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email()
});

interface AccountFormProps {
  user: User
}

const AccountForm = ({ user }: AccountFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.user_metadata.fullname || '',  // Make sure you use 'fullname' here
      email: user?.email || '',
    },
  });

  const toastId = useId();

  async function onSubmit (values: z.infer<typeof formSchema>) {
    toast.loading('Updating the profile...', { id: toastId, duration: 5000 });
    try {
      const { success, error } = await updateProfile(values);

      if (success) {
        toast.success('Profile updated successfully!', { id: toastId, duration: 5000 });
      } else {
        toast.error(error || 'Error in updating profile', { id: toastId, duration: 5000 });
      }
    } catch (error: any) {
      console.error('Error in updating profile:', error);
      toast.error('Something went wrong. Please try again.', { id: toastId, duration: 5000 });
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Used for authentication and you can't change it
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Update Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountForm;
