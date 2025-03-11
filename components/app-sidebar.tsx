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
import { createClient } from "@/lib/supabase/server"


export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getSession();

  const user = {
    name: userData?.session?.user.user_metadata?.fullname,
    email: userData?.session?.user.user_metadata?.email,
    avatar: userData?.session?.user.user_metadata?.avatar_url
  }

  return (
    <Sidebar  collapsible="icon" {...props} >

      <SidebarHeader >
        <SidebarMenuButton
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
        <NavMain/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
