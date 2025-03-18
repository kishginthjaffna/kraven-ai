import { cn } from '@/lib/utils'
import { ImageIcon, Package2, Palette } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import dashboardImg from '@/public/images/FeatureImg.jpg'

const features = [
    {
        title: 'AI-Powered Photos',
        description: 'Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.',
        icon: <ImageIcon className='w-6 h-6' strokeWidth={1.5}/>,
    },{
        title: 'Diverse Photo Packs at Your Fingertip',
        description: 'Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.',
        icon: <Package2 className='w-6 h-6' strokeWidth={1.5}/>,
    },{
        title: 'Customizable Photo Generation',
        description: 'Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.',
        icon: <Palette className='w-6 h-6' strokeWidth={1.5}/>,
    }
]

const Features = () => {
    return (
        <section id='features' className='w-full bg-muted py-32 flex flex-col items-center px-4'>
            <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative bg-muted'>
                <div className='col-span-full space-y-4'>
                    <span className='text-sm text-orange-700'> Features </span>
                    <h2 className='text-4xl font-bold'>
                        Unlock Unlimited Possibilities with Kraven AI
                    </h2>
                    <p className='text-base text-muted-foreground lg:max-w-[75%]'>
                        As AI is advancing day by day, Our platform provides a wide range of features designed to enhance your image creation experience. From creating unique and visually stunning images by training your own models with your own images or else you can also use available models.
                    </p>
                </div>

                <div className='flex flex-col justify-start items-start'>
                    {
                        features.map((feature, index) => (
                            <div key={index} className='flex items-start gap-4 rounded-lg p-12'>
                                <span className='p-2 rounded-full text-background bg-orange-700'>
                                    {feature.icon}
                                </span>
                                <div className='flex-1'>
                                    <h3 className='text-lg font-semibold'>{feature.title}</h3>
                                    <p className='text-base text-muted-foreground pt-2'>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className={cn('h-fit sticky top-32 pl-16 pt-16 rounded-lg border border-r-gray-300 border-b-gray-300 bg-gradient-to-r from-orange-700 via-indigo-500 to-blue-600')}>
                    <Image
                        src={dashboardImg}
                        alt='img'
                        width={800}
                        height={500}
                        className='w-full h-auto'
                    />
                    {/* <Link href="/" className='flex items-center'>
                        <Image src="/images/logo.png" alt="logo" width={50} height={50} className='w-10 h-10 mr-3'/>
                        <h1 className='text-3xl font-bold text-primary'>Kraven AI</h1>
                    </Link> */}
                </div>
                
            </div>
        </section>
    )
}

export default Features
