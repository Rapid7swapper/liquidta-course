'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Crown, Shield, GraduationCap, LogOut, User } from 'lucide-react'
import { UserRole } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface DashboardHeaderProps {
  firstName: string
  lastName: string
  role: UserRole
}

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    icon: Crown,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    gradient: 'from-red-500 to-pink-500',
  },
  admin: {
    label: 'Administrator',
    icon: Shield,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    gradient: 'from-amber-500 to-orange-500',
  },
  student: {
    label: 'Student',
    icon: GraduationCap,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    gradient: 'from-violet-500 to-cyan-500',
  },
}

export default function DashboardHeader({ firstName, lastName, role }: DashboardHeaderProps) {
  const config = roleConfig[role]
  const Icon = config.icon
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'

  return (
    <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Liquida Capital
            </h1>
          </Link>
          <span className={`px-2 py-1 rounded-full ${config.bgColor} ${config.color} text-xs font-medium flex items-center gap-1`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white">{firstName} {lastName}</p>
            <p className={`text-xs ${config.color}`}>{config.label}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className={`h-10 w-10 ring-2 ring-offset-2 ring-offset-slate-950 ${role === 'super_admin' ? 'ring-red-500/50' : role === 'admin' ? 'ring-amber-500/50' : 'ring-violet-500/50'}`}>
                  <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white font-medium`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800" align="end">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white text-sm`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">{firstName} {lastName}</p>
                  <p className={`text-xs ${config.color}`}>{config.label}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                className="text-red-400 focus:bg-red-500/20 focus:text-red-400 cursor-pointer"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {loading ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
