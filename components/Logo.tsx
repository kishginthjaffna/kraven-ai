import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href="/" className='flex items-center'>
            <Image src="/images/logo2.png" alt="logo" width={100} height={100} className='w-16 h-16 mr-4'/>
            <h1 className='text-5xl font-bold text-white'>Kraven AI</h1>
        </Link>
    )
}

export default Logo
