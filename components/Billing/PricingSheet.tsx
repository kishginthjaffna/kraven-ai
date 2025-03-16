import { Tables } from '@/database.types';
import { User } from '@supabase/supabase-js';
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '../ui/button';
import Pricing from './Pricing';

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
    user: User | null
}

const PricingSheet = ({user, products, subscription}: PlanSummaryProps) => {
  return (
    <Sheet>
    <SheetTrigger asChild>
        <Button variant={'outline'} className='cursor-pointer'>Upgrade</Button>
    </SheetTrigger>
    <SheetContent className='bg-muted sm:max-w-[90vw] lg:max-w-[70vw] w-full'>
        <SheetHeader>
        <SheetTitle> Change Subscription </SheetTitle>
        <SheetDescription>
            Choose a plan that is right for your needs
        </SheetDescription>
        </SheetHeader>
        <Pricing user={user} products={products ?? []} subscription={subscription}/>
    </SheetContent>
    </Sheet>
  )
}

export default PricingSheet
