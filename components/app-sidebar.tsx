"use client"

import * as React from "react"
import {
  Settings2,
  ImageIcon,
  SquareTerminal,
  FrameIcon,
  Images,
  CreditCard,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { redirect } from "next/dist/server/api-utils"

// This is sample data.
const data =[
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: SquareTerminal,
  },
  {
    title: 'Image Generator',
    url: '/image-generator',
    icon: ImageIcon,
    
  },
  {
    title: 'My Models',
    url: '/my-models',
    icon: FrameIcon,
    
  },
  {
    title: 'Train your Model',
    url: '/model-training',
    icon: ImageIcon,
    
  },
  {
    title: 'My Images',
    url: '/my-images',
    icon: Images,
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
  },
  
  
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar  collapsible="icon" {...props} >

      <SidebarHeader >
        <SidebarMenuButton
              onClick={() => {}}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image src="/images/logo2.png" alt="logo" className="size-6" height={100} width={100} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Kraven AI</span>
                <span className="truncate text-xs">Pro</span>
              </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
