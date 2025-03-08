import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import * as z from 'zod'

export const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        label: 'Conversation',
        icon: MessageSquare,
        href: '/conversation',
    },
    {
        label: 'Image Generator',
        icon: ImageIcon,
        href: '/image',
    },
    {
        label: 'Video Generator',
        icon: VideoIcon,
        href: '/video',
    },
    {
        label: 'Music Generator',
        icon: Music,
        href: '/music',
    },
    {
        label: 'Code Generator',
        icon: Code,
        href: '/code',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
    }
]

export const tools = [
    {
        label: 'Conversation',
        icon: MessageSquare,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10',
        href: '/conversation',
    },
    {
        label: 'Music Generation',
        icon: Music,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        href: '/music'
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        color: 'text-pink-700',
        bgColor: 'bg-pink-700/10',
        href: '/image'
    },
    {
        label: 'Video Generation',
        icon: VideoIcon,
        color: 'text-orange-700',
        bgColor: 'bg-orange-700/10',
        href: '/video'
    },
    {
        label: 'Code Generation',
        icon: Code,
        color: 'text-green-700',
        bgColor: 'bg-green-700/10',
        href: '/code'
    }
    
]      


export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: 'Prompt is required'
    })
})