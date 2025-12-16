'use client'

import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Crown, Shield, GraduationCap } from 'lucide-react'
import { UserRole } from '@/lib/supabase/types'

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
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: `w-10 h-10 ring-2 ring-offset-2 ring-offset-slate-950 ring-${role === 'super_admin' ? 'red' : role === 'admin' ? 'amber' : 'violet'}-500/50`
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
