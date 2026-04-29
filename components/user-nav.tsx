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
import { LogOut, User, Settings, CreditCard, Sparkles } from "lucide-react"

export function UserNav() {
  const { user, logout, login, isLoading } = useAuth()

  // Always show the login button unless we have a confirmed user
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20 p-0 overflow-hidden hover:border-primary/50 transition-all">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.[0] || user?.email?.[0] || "?"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 rounded-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer py-2.5">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer py-2.5">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>My Applications</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer py-2.5 text-primary font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer py-2.5">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
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
