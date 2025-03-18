
import AccountForm from '@/components/Settings/AccountForm'
import SecuritySettings from '@/components/Settings/SecuritySettings'
import { getUser } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/sign-in');
  }

  

  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Account Settings</h1>
        <p className='text-muted-foreground'>Manage your settings and preferences</p>
      </div>
      <div className='grid gap-8'>
        <AccountForm user={user} />
        <SecuritySettings user={user}/>
      </div>
    </section>
  );
}

export default page;

