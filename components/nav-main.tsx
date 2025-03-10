"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Settings2,
  ImageIcon,
  SquareTerminal,
  Frame,
  ComputerIcon,
  Images,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Sample navigation data
const data = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal,
  },
  {
    title: "Image Generator",
    url: "/image-generator",
    icon: ImageIcon,
  },
  {
    title: "My Models",
    url: "/my-models",
    icon: Frame,
  },
  {
    title: "Train your Model",
    url: "/model-training",
    icon: ComputerIcon,
  },
  {
    title: "My Images",
    url: "/my-images",
    icon: Images,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                  pathname === item.url
                    ? "text-orange-700 bg-primary/5"
                    : "text-muted-foreground"
                )}
              >
                {item.icon && <item.icon className="size-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
