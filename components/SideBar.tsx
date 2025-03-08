'use client';

import { cn } from '@/lib/utils'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { routes } from '@/constants/constants'
import { usePathname } from 'next/navigation';

const montserrat = Montserrat({ weight: '600', subsets: ['latin'] })

const SideBar = () => {
  const pathname = usePathname();

  return (
    <div className='space-y-4 py-4 flex flex-col h-full text-white bg-[#111827]'>
      <div className='px-3 py-2 flex-1'>
        <Link href='/dashboard' className='flex items-center pl-3 mb-4  transition-all hover:rotate-2 hover:scale-108'>
          <div className='relative w-16 h-16 mr-4'>
              <Image alt='logo' src='/images/logo3.png' fill/>
          </div>
          <h1 className={cn('text-4xl font-bold text-orange-700', montserrat.className)}>Kraven AI</h1>
        </Link>
        <hr className='mb-12'/>
        <div className='space-y-4'>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-md group flex p-3 w-full justify-start font-light cursor-pointer hover:text-orange-700 hover:bg-white/10 rounded-lg transition', 
                pathname === route.href && 'bg-white/10 text-orange-700'
              )}
            >
              <div className='flex items-center flex-1'>
                <route.icon className={cn('mr-3 h-5 w-5')} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    
  )
}

export default SideBar
