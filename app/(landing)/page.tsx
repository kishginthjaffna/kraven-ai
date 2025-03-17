import Pricing from '@/components/Landing page/Pricing'
import { getProducts, getUser } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase), //get currently auhtenticated user
    getProducts(supabase), //get all products with prices
  ]);

  if(user){
    return redirect('/dashboard');
  }

  return (
    <main className='flex flex-col min-h-screen items-center justify-center'>

      <Pricing products={products ?? []}/>
    </main>
  )
}

export default page
