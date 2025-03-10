import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>

        <AppSidebar/>

        <SidebarInset>
            <div className='w-fit flex items-center gap-2 px-4 my-4 lg:flex'>
                <SidebarTrigger/>
            </div>
            
            <main className='flex flex-col gap-4 flex-1 p-4'>
                {children}
            </main>
        </SidebarInset>

    </SidebarProvider>
  )
}

export default layout
