import { getCredits } from '@/app/actions/credits';
import { getImages } from '@/app/actions/image';
import { fetchModels } from '@/app/actions/model';
import OuickActions from '@/components/Dashboard/OuickActions';
import RecentImages from '@/components/Dashboard/RecentImages';
import RecentModels from '@/components/Dashboard/RecentModels';
import StatesCards from '@/components/Dashboard/StatesCards';
import { createClient } from '@/lib/supabase/server';
import React from 'react'

export default async function Page() {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  const {data: models, count: modelCount} = await fetchModels();
  const {data: credits} = await getCredits();
  const {data: images} = await getImages();
  const imageCount = images?.length || 0;

  return (
      <section className='container mx-auto flex-1 space-y-6 px-4 sm:px-6 md:px-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
            Welcome back, {user?.user_metadata.fullname}!
          </h2>
        </div>

        <StatesCards
          modelCount={modelCount}
          imageCount={imageCount}
          credits={credits}
        />

        <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
          <RecentImages images={images?.slice(0, 6) || []} />
          <div className='h-full flex flex-col space-y-6'>
            <OuickActions />
            <RecentModels models={models || []} />
          </div>
        </div>
      </section>
  )
}
