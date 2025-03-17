'use client'
import { User } from '@supabase/supabase-js'
import React, { useId } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { resetPassword } from '@/app/actions/auth';

interface SecuritySettingsProps {
  user: User
}

const SecuritySettings = ({user}: SecuritySettingsProps) => {
  const toastId = useId();
  async function handleChangePassword() {
    toast.loading('Sending password reset mail to your email...', {id: toastId, duration: 5000 });
    try {
      const { success, error } = await resetPassword({email: user.email || ''});
  
      if (success) {
        toast.success('Password reset mail sent successfully!', { id: toastId, duration: 5000 });
      } else {
        toast.error(error || 'Error in sending mail', { id: toastId, duration: 5000 });
      }
    } catch (error: any) {
      console.error('Error in resetting password:', error);
      toast.error('Something went wrong. Please try again.', { id: toastId, duration: 5000 });
    }
  };

  return (
    <div>
      <Card className="">
      <CardHeader>
        <CardTitle className='text-2xl'>Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className='space-y-2'>
          <h3 className='font-medium'>Password</h3>
          <p className='text-sm text-muted-foreground'>Change your password to keep your account secure</p>
          <Button variant={"outline"} onClick={handleChangePassword}>Change Password</Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default SecuritySettings
