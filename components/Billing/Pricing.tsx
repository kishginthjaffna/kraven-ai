'use client';
import { Tables } from '@/database.types';
import { User } from '@supabase/supabase-js';
import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge';
import { usePathname, useRouter } from 'next/navigation';
import { checkoutWithStripe, createStripePortal } from '@/lib/stripe/server';
import { getErrorRedirect } from '@/lib/helpers';
import { getStripe } from '@/lib/stripe/client';
import { toast } from 'sonner';

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

interface PricingProps {
    subscription: SubscriptionWithProduct | null;
    products: ProductWithPrices[];
    user: User | null,
    mostPopularProduct?: string;
    showInterval?: boolean,
    className?: string,
    activeProduct?: string
}

const renderPricingButton = ({
    subscription, user, product, price, mostPopularProduct, handleStripeCheckout, handleStripePortalRequest}: {
        subscription: SubscriptionWithProduct | null;
        user: User | null;
        product: ProductWithPrices;
        price: PriceType;
        mostPopularProduct?: string;
        handleStripeCheckout: (price: PriceType) => Promise<void>;
        handleStripePortalRequest: () => Promise<void>;
    }) => {
        //Case 1: User has active sub
        if (user && subscription && subscription.prices?.products?.name?.toLowerCase() === product.name?.toLowerCase()) {
            return (
                <Button className='mt-8 w-full font-light cursor-pointer' 
                        onClick={() => handleStripePortalRequest()}>
                    Manage Subscription
                </Button>
            )
        }

        //Case 2: User has active sub for different product
        if(user && subscription){
            return (
                <Button className='mt-8 w-full font-light cursor-pointer' 
                            onClick={() => handleStripePortalRequest()}
                            variant={'outline'}>
                        Switch Plan
                    </Button>
        )
        }

        //Case 3: User has no active sub or different sub
        if (user && !subscription) {
            return (
                <Button className='mt-8 w-full font-light cursor-pointer' 
                        onClick={() => handleStripeCheckout(price)}
                        variant={product.name?.toLowerCase() === mostPopularProduct?.toLowerCase() ? 'default' : 'outline'}>
                    Subscribe
                </Button>
            )
        }

        return (
            <Button className='mt-8 w-full font-light cursor-pointer' 
                    onClick={() => handleStripeCheckout(price)}
                    variant={product.name?.toLowerCase() === mostPopularProduct?.toLowerCase() ? 'default' : 'outline'}>
                Subscribe
            </Button>
        )
}

const Pricing = ({user, products, className, subscription, mostPopularProduct = 'pro', activeProduct, showInterval = true}: PricingProps) => {
    const router = useRouter();
    const [billingInterval, setBillingInterval] = React.useState<'month' | 'year'>('month')
    const currentPath = usePathname();

    const handleStripeCheckout = async (price: PriceType) => {
        // console.log('Handle Stripe checkout: ',price)
        if(!user) {
            return router.push('/sign-in')
        }

        const { errorRedirect, sessionId}= await checkoutWithStripe(price, currentPath);

        if(errorRedirect) {
            return router.push(errorRedirect)
        }

        if(!sessionId){
            return router.push(getErrorRedirect(
                currentPath, 'Unable to retrieve checkout session.', 'Please try again later or contact customer support.'
            ))
        }

        const stripe = await getStripe();
        stripe?.redirectToCheckout({sessionId});
    }

    const handleStripePortalRequest = async () => {
        toast.info('Redirecting to stripe portal...');
        const redirectUrl = await createStripePortal(currentPath);
        return router.push(redirectUrl)
    }

    return (
        <section className={cn('w-full flex flex-col items-center justify-center p-10', className)}>
            {showInterval && (
                <div className='flex items-center justify-center space-x-4'>
                    <Label htmlFor='pricing-switch' className='font-semibold text-base'>
                        Monthly
                    </Label>
                    <Switch
                        id="pricing-switch"
                        checked={billingInterval === 'year'} 
                        onCheckedChange={() =>
                            setBillingInterval((prev) => (prev === 'month' ? 'year' : 'month'))
                        }
                    />
                    <Label htmlFor='pricing-switch' className='font-semibold text-base'>
                        Yearly
                    </Label>
                </div>
            )}
            <div className='grid grid-cols-1 md:grid-cols-3 place-items-center mx-auto gap-8 space-y-4'>
                {products.map(product => {
                    const price = product?.prices?.find(price => price.interval === billingInterval)
                    if (!price) return null;

                    const priceString = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: price.currency!,
                        minimumFractionDigits: 0,
                    }).format((price?.unit_amount || 0) / 100);

                    return (
                        <div key={product.id} className={cn(
                            'border-orange-700/40 mt-10 border bg-background rounded-xl shadow-sm h-fit divide-y divide-orange-700/40',
                            product.name?.toLowerCase() === activeProduct ? 'border-orange-700 scale-105 drop-shadow-md' : ''
                        )}>
                            <div className='p-6'>
                                <h2 className='text-2xl leading-6 font-semibold text-foreground flex items-center justify-between'>
                                    {product.name}
                                    {product.name?.toLowerCase() === activeProduct && (
                                        <Badge className='bg-orange-700 lg:px-5'>Currently Active</Badge>
                                    )}
                                </h2>
                                <p className='text-muted-foreground mt-4 text-sm'>{product.description}</p>
                                <p className='mt-8'>
                                    <span className='text-4xl font-bold text-foreground'>{priceString}</span>
                                    <span className='text-base font-medium text-muted-foreground'>/{billingInterval}</span>
                                </p>
                                {renderPricingButton({
                                    subscription, 
                                    user, 
                                    product, 
                                    price, 
                                    mostPopularProduct, 
                                    handleStripeCheckout, 
                                    handleStripePortalRequest
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Pricing
