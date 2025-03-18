import React from 'react';
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from '../magicui/animated-shiny-text';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Marquee } from '../magicui/marquee';
import Image from 'next/image';

const avatars = [
    { src: "/avatars/AutumnTechFocus.jpeg", fallback: "CN" },
    { src: "/avatars/Casual Creative Professional.jpeg", fallback: "AB" },
    { src: "/avatars/Golden Hour Contemplation.jpeg", fallback: "FG" },
    { src: "/avatars/Portrait of a Woman in Rust-Colored Top.jpeg", fallback: "PW" },
    { src: "/avatars/Radiant Comfort.jpeg", fallback: "RC" },
    { src: "/avatars/Relaxed Bearded Man with Tattoo at Cozy Cafe.jpeg", fallback: "RB" },
];

const images = [
    { src: "/hero-images/01.jpg", alt: 'image' },
    { src: "/hero-images/02.avif", alt: 'image' },
    { src: "/hero-images/03.jpg", alt: 'image' },
    { src: "/hero-images/04.jpg", alt: 'image' },
    { src: "/hero-images/05.jpg", alt: 'image' },
    { src: "/hero-images/07.jpg", alt: 'image' },
    { src: "/hero-images/08.avif", alt: 'image' },
    { src: "/hero-images/09.avif", alt: 'image' },
    { src: "/hero-images/10.avif", alt: 'image' },
    { src: "/hero-images/11.jpg", alt: 'image' },
    { src: "/hero-images/12.jpg", alt: 'image' },
    { src: "/hero-images/13.jpg", alt: 'image' },
    { src: "/hero-images/14.jpg", alt: 'image' },
    { src: "/hero-images/06.avif", alt: 'image' },
];

const MarqueeColumn = ({ reverse, duration, className }: {
    reverse: boolean,
    duration: string,
    className: string
}) => {
    return (
        <Marquee reverse={reverse} pauseOnHover vertical className={cn("w-full relative h-full flex flex-col justify-center items-center", className)}
            style={{ "--duration": duration } as React.CSSProperties}
        >
            {images.sort(() => Math.random() - 0.5).map((image, i) => (
                <Image
                    key={i}
                    width={500}
                    height={500}
                    src={image.src}
                    alt={image.alt}
                    priority
                    className='w-full h-full object-cover rounded opacity-[.25] hover:opacity-100 transition-opacity duration-300 ease-in-out'
                />
            ))}
        </Marquee>
    );
};

const HeroSection = () => {
    return (
        <section className='w-full relative overflow-hidden min-h-screen flex flex-col items-center justify-center p-4'>
            <div className='relative w-fit mx-auto flex flex-col items-center justify-center space-y-4 text-center z-40 backdrop-blur-[2px]'>
                <div className="z-10 flex items-center justify-center">
                    <div className={cn("group rounded-full border border-orange-700/40 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800")}>
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                            <span>✨ Introducing Kraven AI</span>
                            <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </AnimatedShinyText>
                    </div>
                </div>
                <h1 className='text-6xl max-w-6xl font-extrabold tracking-tight'>
                    Generate Pictures Based On Your Needs
                </h1>
                <p className='mx-auto max-w-3xl text-sm sm:text-base lg:text-xl font-semibold text-gray-600 mb-10'>
                    Kraven AI is a powerful tool that allows you to generate images based on your own prompts. With Kraven AI, you can create unique and visually stunning images that reflect your unique style and personality for your needs. Also with Kraven AI you can train your own models with your own images.
                </p>
                <div className='flex items-center space-x-2 mb-4'>
                    <div className='flex items-center -space-x-4 overflow-hidden'>
                        {avatars.map((avatar, index) => (
                            <Avatar key={index} className='inline-block border-2 border-background'>
                                <AvatarImage src={avatar.src} className='h-full object-cover' />
                                <AvatarFallback>{avatar.fallback}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <span className='text-md font-medium'>Loved by more than 1k+ users</span>
                </div>
                <div className='flex gap-4'>
                    <Link href={'/sign-up'}>
                        <Button className='font-light text-base h-12 rounded-full'>
                            Create your first AI model with us <Sparkles />
                        </Button>
                    </Link>
                    <Link href={'/sign-in'}>
                        <Button className='font-semibold text-base bg-primary h-12 rounded-full'>
                            Sign in
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='absolute w-full top-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 z-10'>
                <MarqueeColumn reverse={false} duration='120s' className='' />
                <MarqueeColumn reverse={true} duration='120s' className='' />
                <MarqueeColumn reverse={false} duration='120s' className='' />
                <MarqueeColumn reverse={true} duration='120s' className='hidden md:grid' />
                <MarqueeColumn reverse={false} duration='120s' className='hidden lg:grid' />
                <MarqueeColumn reverse={true} duration='120s' className='hidden lg:grid' />
            </div>
        </section>
    );
};

export default HeroSection;