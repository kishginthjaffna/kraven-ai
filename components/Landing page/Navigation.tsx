import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Menu } from 'lucide-react'



const NavItems = () => {
  return <>
    <Link href='#features' className='text-sm font-medium hover:underline hover:text-orange-700 transition underline-offset-4'>
      Features
    </Link>
    <Link href='#pricing' className='text-sm font-medium hover:underline hover:text-orange-700 transition underline-offset-4'>
      Pricing
    </Link>
    <Link href='#faqs' className='text-sm font-medium hover:underline hover:text-orange-700 transition underline-offset-4'>
      FAQs
    </Link>
    <Link href='/sign-up' className='text-sm font-medium hover:underline transition underline-offset-4'>
      <Button variant={'outline'} className=''>
        Sign-up
      </Button>
    </Link>
  </>
}

const Navigation = () => {
  return (
    <div className='bg-background/60 w-full backdrop-blur-md fixed top-0 px-8 py-4 z-50 shadow-md overflow-hidden'>
        <header className='container mx-auto flex items-center'>
          {/* Logo */}
          <Link href="/" className='flex items-center'>
              <Image src="/images/logo3.png" alt="logo" width={50} height={50} className='w-10 h-10 mr-3'/>
              <h1 className='text-3xl font-bold text-orange-700'>Kraven AI</h1>
          </Link>

          {/* Navigation elements */}
          <nav className='ml-auto hidden md:flex items-center justify-center gap-6'>
              <NavItems/>
          </nav>

          {/* Mobile Navigation */}
          <div className='ml-auto md:hidden overflow-hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Menu className='w-6 h-6' strokeWidth={1.5}/>
              </SheetTrigger>
              <SheetContent className='w-2/3'>
                <SheetHeader className='flex items-center mb-0'>
                    <Link href="/" className='flex items-center'>
                        <Image src="/images/logo.png" alt="logo" width={20} height={20} className='w-7 h-7 mr-3'/>
                        <h1 className='text-xl font-bold text-primary'>Kraven AI</h1>
                    </Link>
                </SheetHeader>
                <SheetTitle className='sr-only'>
                  Navigation
                </SheetTitle>
                <nav className='flex flex-col items-start gap-8 mt-4 p-6'>
                  <NavItems/>
                </nav>
                <SheetFooter className='flex items-center'>
                  <div className='text-xs text-muted-foreground'>
                    Copyright © 2025 Kraven AI
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </header>
    </div>
  )
}

export default Navigation
