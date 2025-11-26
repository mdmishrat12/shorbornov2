"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Award,
  User,
  Menu,
  Bell,
  Settings,
  LogOut
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/student/dashboard",
  },
  {
    title: "Practice",
    icon: BookOpen,
    href: "/student/practice"
  },
  {
    title: "Exams",
    icon: FileText,
    href: "/student/exams"
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    href: "/student/analytics"
  },
  {
    title: "Leaderboard",
    icon: Award,
    href: "/student/leaderboard"
  }
]

export function ResponsiveSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r bg-white/80 backdrop-blur-md z-30">
        {/* Desktop Logo */}
        <div className="flex h-20 items-center border-b px-6">
          <Link href="/student/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Shorborno
              </h1>
              <p className="text-xs text-gray-500">BCS Preparation</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg" 
                    : "text-gray-600"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Desktop User Section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">BCS Aspirant</p>
              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                Premium
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700" size="sm">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header - Hidden on desktop */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Shorborno
              </h1>
              <p className="text-xs text-gray-500">BCS Preparation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <MobileMenuContent pathname={pathname} onItemClick={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200/60">
        <div className="flex justify-around items-center p-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 min-w-[60px]",
                  isActive 
                    ? "text-blue-600 bg-blue-50 shadow-sm" 
                    : "text-gray-500 hover:text-blue-600"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

function MobileMenuContent({ pathname, onItemClick }: { pathname: string; onItemClick: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-600">BCS Aspirant</p>
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              Premium Member
            </Badge>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}