'use client';

import React from 'react'
import { AnimatedGradientText } from '../magicui/animated-gradient-text'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Tables } from '@/database.types';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

type ProductType = Tables<"products">;
type PriceType = Tables<"prices">;

interface ProductWithPrices extends ProductType {
    prices: PriceType[];
}
interface PricingProps {
    products: ProductWithPrices[];
    mostPopularProduct?: string;
}

const Pricing = ({ products, mostPopularProduct = 'pro' }: PricingProps) => {
    const [billingInterval, setBillingInterval] = React.useState<'month' | 'year'>('month')

    return (
        <section className='w-full bg-muted flex flex-col items-center justify-center'>
            <div className='w-full container mx-auto pt-5 pb-32 flex flex-col items-center justify-center space-y-8 px-4 sm:px-6 lg:px-8'>
                <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
                    <span
                        className={cn(
                            "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#FDEE00]/50 via-[#FD5E53]/50 to-[#F94D00]/50 bg-[length:300%_100%] p-[1px]",
                        )}
                        style={{
                            WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "destination-out",
                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "subtract",
                            WebkitClipPath: "padding-box",
                        }}
                    />
                    <AnimatedGradientText className="text-sm font-medium px-8 sm:px-32">
                        Pricing 💸
                    </AnimatedGradientText>
                </div>

                <div className='flex flex-col items-center text-center'>
                    <h1 className='mt-4 text-2xl md:text-4xl font-bold'> Choose the best plan that fits your needs </h1>
                    <p className='text-base text-muted-foreground max-w-3xl mt-2 px-4 sm:px-0'>
                        We only hit you with the best deals for your budget than other companies. So start your journey with us!
                    </p>
                </div>

                {/* Billing switch */}
                <div className='flex items-center justify-center space-x-4 py-2 md:py-8'>
                    <Label htmlFor='pricing-switch' className='font-semibold text-base'>
                        Monthly
                    </Label>
                    <Switch
                        id="pricing-switch"
                        checked={billingInterval === 'year'} 
                        onCheckedChange={() => setBillingInterval((prev) => (prev === 'month' ? 'year' : 'month'))}
                    />
                    <Label htmlFor='pricing-switch' className='font-semibold text-base'>
                        Yearly
                    </Label>
                </div>

                {/* Pricing Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full px-4 sm:px-0'>
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
                                'border-orange-700/40 mt-10 border bg-background rounded-xl shadow-sm h-fit divide-y divide-orange-700/40 p-6 w-full max-w-md',
                                product.name?.toLowerCase() === mostPopularProduct.toLowerCase() ? 'border-orange-700 scale-105 drop-shadow-md' : ''
                            )}>
                                <div className=''>
                                    <h2 className='text-2xl leading-6 font-semibold text-foreground flex items-center justify-between'>
                                        {product.name}
                                        {product.name?.toLowerCase() === mostPopularProduct.toLowerCase() && (
                                            <Badge className='bg-orange-700 px-5'>Most Popular</Badge>
                                        )}
                                    </h2>
                                    <p className='text-muted-foreground mt-4 text-sm'>{product.description}</p>
                                    <p className='mt-8'>
                                        <span className='text-4xl font-bold text-foreground'>{priceString}</span>
                                        <span className='text-base font-medium text-muted-foreground'>/{billingInterval}</span>
                                    </p>
                                    <Link href='/sign-up'>
                                        <Button 
                                            className='cursor-pointer mt-8 w-full font-light'
                                            variant={product.name?.toLowerCase() === mostPopularProduct.toLowerCase() ? 'default' : 'outline'}
                                        >
                                            Subscribe
                                        </Button>
                                    </Link>
                                </div>
                                <div className='pt-6 pb-8'>
                                    <h3 className='uppercase tracking-wide text-foreground font-bold text-sm'>What&apos;s included?</h3>
                                    <ul className='mt-6 space-y-4'>
                                        {Object.values(product.metadata || {}).map((feature, index) => feature && (
                                            <li key={index} className='flex space-x-3 items-center gap-2'>
                                                <Check className='w-4 h-4 text-foreground' />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Pricing;
