"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, User, Settings, CreditCard, Sparkles, LayoutDashboard, ShieldCheck } from "lucide-react"

export function UserNav() {
  const { user, logout, login, isLoading } = useAuth()

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full border-2 border-primary/10 flex items-center justify-center animate-pulse">
        <div className="h-4 w-4 rounded-full bg-primary/20" />
      </div>
    )
  }

  // Only show login if we are definitely not authenticated
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="default" size="sm" className="rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          Login
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full border-2 border-primary/20 p-0 overflow-hidden hover:border-primary/50 transition-all">
          <Avatar className="h-8 w-8 md:h-9 md:w-9">
            <AvatarImage src={user?.image} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">{user?.name?.[0] || user?.email?.[0] || "?"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2 rounded-2xl p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-black leading-none">{user.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user && (user.email === "apnacounsellor@gmail.com" || user.email === "sonishriyash@gmail.com") && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center cursor-pointer py-2.5 text-purple-600 font-bold">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Portal</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center cursor-pointer py-2.5">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/onboarding" className="flex items-center cursor-pointer py-2.5">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center cursor-pointer py-2.5">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>My Applications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/chat" className="flex items-center cursor-pointer py-2.5 text-purple-600 font-bold">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center cursor-pointer py-2.5">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2.5 text-red-500 focus:text-red-500" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
