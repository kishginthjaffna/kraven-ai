'use client';

import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import SideBar from './SideBar'

const NavBar = () => {
    // Code segment to fix hydration error
    const [isMounted, setIsMounted] = React.useState(false);

    useEffect(() => {
      setIsMounted(true);  
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className='flex items-center p-4'>

            {/* Mobile Sidebar section */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant='ghost' size='icon' className='md:hidden'>
                        <Menu/>
                    </Button>
                </SheetTrigger>
                <SheetContent side='left' className='p-0'>
                    <SideBar/>
                </SheetContent>
            </Sheet>
            
            <div className='flex w-full justify-end'>
                <UserButton afterSignOutUrl="/" />
            </div>

        </div>
    )
}

export default NavBar
