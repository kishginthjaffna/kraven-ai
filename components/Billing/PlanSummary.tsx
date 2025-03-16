import { Tables } from '@/database.types';
import { User } from '@supabase/supabase-js';
import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import PricingSheet from './PricingSheet';
import { getProducts } from '@/lib/supabase/queries';
import { format } from 'date-fns';

type ProductType = Tables<"products">;
type PriceType = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

interface ProductWithPrices extends ProductType{
    prices: PriceType[];
}

interface PriceWithProduct extends PriceType{
    products: ProductType | null
}

interface SubscriptionWithProduct extends Subscription{
    prices: PriceWithProduct | null
}

interface PlanSummaryProps {
    subscription: SubscriptionWithProduct | null;
    products: ProductWithPrices[] | null;
    user: User | null,
    credits: Tables<'credits'> | null
}

const PlanSummary = ({credits, subscription, products, user}: PlanSummaryProps ) => {
    if(!credits || !subscription || subscription.status !== 'active'){
        return <Card className='max-w-5xl p-2'>
            <CardContent className='px-5 py-4'>
                <h3 className='pb-4 text-base font-semibold flex flex-wrap items-center gap-x-8'>
                    <span className='font-bold text-xl'>Plan Summary</span>
                    <Badge className='bg-orange-700 px-4'>No Plan</Badge>
                </h3>
                <div className='grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4'>
                    <div className='col-span-5 flex flex-col pr-12'>
                        <div className='flex-1 text-sm font-normal flex w-full justify-between pb-1' >
                            <span className='font-normal text-muted-foreground ml-1 lowercase'>
                                Image generation credits left
                            </span>
                            <span className='font-medium'>
                                0 / 0 remaining
                            </span>
                        </div>
                        <div className='mb-1 flex items-end'>
                            <Progress value={5} max={5} className='w-full h-2'/>
                        </div>
                    </div>
                    <div className='col-span-5 flex flex-col pr-12'>
                        <div className='flex-1 text-sm font-normal flex w-full justify-between pb-1' >
                            <span className='font-normal text-muted-foreground ml-1 lowercase'>
                                model training credit left
                            </span>
                            <span className='font-medium'>
                                0 / 0 remaining
                            </span>
                        </div>
                        <div className='mb-1 flex items-end'>
                            <Progress value={5} max={5} className='w-full h-2'/>
                        </div>
                    </div>
                    <div className='col-span-full flex flex-col'>
                        Please upgrade to a plan to continue using the app.
                    </div>
                </div>
            </CardContent>
            <CardFooter className='border-t border-orange-700/40 px-4 py-3'>
                <span className='flex ml-auto flex-row'>
                    <PricingSheet user={user} products={products} subscription={subscription}/>
                </span>
            </CardFooter>      
        </Card>
      }
    const {products: subscriptionProduct, unit_amount, currency} = subscription?.prices ?? {};
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency!,
        minimumFractionDigits: 0,
    }).format((unit_amount || 0) / 100);

    const imageGenCount = credits.image_generation_count ?? 0;
    const modelTrainingCount = credits.model_training_count ?? 0;
    const maxImageGenCount = credits.max_image_generation_count ?? 0;
    const maxModelTrainingCount = credits.max_model_training_count ?? 0;

    return (
        <div>
            <Card className='max-w-full p-2'>
            <CardContent className='px-5 py-4'>
                <h3 className='pb-4 text-base font-semibold flex flex-wrap items-center gap-x-8'>
                    <span className='font-bold text-xl'>Plan Summary</span>
                    <Badge className='bg-orange-700 px-4'>{subscriptionProduct?.name}</Badge>
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4'>
                    <div className='col-span-5 flex flex-col pr-12'>
                        <div className='flex-1 text-sm font-normal flex w-full justify-between' >
                            <span className='font-medium'>
                                {imageGenCount} / {maxImageGenCount} remaining
                            </span>

                            <span className='font-normal text-muted-foreground ml-1 lowercase'>
                                Image generation credits left
                            </span>
                        </div>
                        <div className='mb-1 flex items-end'>
                            <Progress value={imageGenCount/maxImageGenCount * 100} className='w-full h-2'/>
                        </div>
                    </div>
                    <div className='col-span-5 flex flex-col pr-12'>
                        <div className='flex-1 text-sm font-normal flex w-full justify-between' >
                            <span className='font-medium'>
                                {modelTrainingCount} / {maxModelTrainingCount} remaining
                            </span>
                            <span className='font-normal text-muted-foreground ml-1 lowercase'>
                                model training credit left
                            </span>
                        </div>
                        <div className='mb-1 flex items-end'>
                            <Progress value={modelTrainingCount/maxModelTrainingCount * 100} className='w-full h-2'/>
                        </div>
                    </div>
                    <div className='col-span-3 flex flex-row justify-between flex-wrap'>
                        <div className='flex flex-col pb-0'> 
                            <div className='text-sm font-normal'>
                                Price/Month
                            </div>
                            <div className='flex-1 pt-1 text-sm font-medium'>
                                {priceString}
                            </div>
                        </div>
                        <div className='flex flex-col pb-0'>
                            <div className='text-sm font-normal'>
                                Included Credits
                            </div>
                            <div className='flex-1 pt-1 text-sm font-medium'>
                                {maxImageGenCount} imgs / {maxModelTrainingCount} models
                            </div>
                        </div>
                        <div className='flex flex-col pb-0'>
                            <div className='text-sm font-normal'>
                                Renewal Date
                            </div>
                            <div className='flex-1 pt-1 text-sm font-medium'>
                                {format(new Date(subscription.current_period_end), 'MMMM do, yyyy' )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>    
        </Card>
        </div>
    )
}

export default PlanSummary
