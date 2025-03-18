import Pricing from '@/components/Landing page/Pricing'
import Navigation from '@/components/Landing page/Navigation'
import { getProducts, getUser } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'
import HeroSection from '@/components/Landing page/HeroSection'
import Features from '@/components/Landing page/Features'

const page = async () => {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase), //get currently auhtenticated user
    getProducts(supabase), //get all products with prices
  ]);

  if(user){
    return redirect('/');
  }

  return (
    <main className='flex flex-col min-h-screen items-center justify-center'>
      <Navigation/>
      <HeroSection/>
      <Features/>
      <Pricing products={products ?? []}/>
    </main>
  )
}

export default page
