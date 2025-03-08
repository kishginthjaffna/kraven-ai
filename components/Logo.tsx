import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href="/" className='flex items-center'>
            <Image src="/images/logo2.png" alt="logo" width={50} height={50} className='w-10 h-10 mr-3'/>
            <h1 className='text-3xl font-bold text-white'>Kraven AI</h1>
        </Link>
    )
}

export default Logo
