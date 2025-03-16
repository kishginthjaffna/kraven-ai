import { getCredits } from '@/app/actions/credits';
import PlanSummary from '@/components/Billing/PlanSummary';
import Pricing from '@/components/Billing/Pricing';
import { getProducts, getSubscription, getUser } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const supabase = await createClient();
    const [user, products, subscription] = await Promise.all([
      getUser(supabase), //get currently auhtenticated user
      getProducts(supabase), //get all products with prices
      getSubscription(supabase), //get subscription of currently auhtenticated user
    ]);

    if(!user) {
      return redirect('/sign-in');
    }

    const { data: credits} = await getCredits();

  return (
    <section className='container mx-auto space-y-8 '>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Plans & Billing</h1>
        <p className='text-muted-foreground'>Manage your Kraven AI subscription and billing details</p>
      </div>
      <div className='grid gap-10'>
        <PlanSummary credits={credits} subscription={subscription } products={products ?? []} user={user}/>
        {
          subscription?.status === 'active' && <Pricing user={user} subscription={subscription} products={products ?? []} showInterval={false} className='p-0 max-w-full' activeProduct={subscription?.prices?.products.name.toLowerCase()}/>
        }
      </div>

    </section>
  )
}

export default page
