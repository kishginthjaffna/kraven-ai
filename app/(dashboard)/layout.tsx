import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='h-full relative'>

            <div className='hidden h-full md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 text-white'>
                <SideBar/>
            </div>

            <main className='md:pl-80'>
                <NavBar/>
                {children}
            </main>

        </div>
    )
}

export default layout
