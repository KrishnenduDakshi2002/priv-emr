
import { Home, FileText, Shield, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BottomNavigationProps {
  currentPage: "dashboard" | "my-emrs" | "proofs" | "settings" | "notifications"
  unreadNotifications?: number
}

export default function BottomNavigation({ currentPage, unreadNotifications = 0 }: BottomNavigationProps) {
  const handleNavigation = (page: string) => {
    console.log(`Navigating to: ${page}`)
    // Navigation logic here - would use Next.js router or your preferred routing solution
  }

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      route: "/dashboard",
    },
    {
      id: "my-emrs",
      label: "My EMRs",
      icon: FileText,
      route: "/my-emrs",
    },
    {
      id: "proofs",
      label: "Proofs",
      icon: Shield,
      route: "/my-proofs",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      route: "/notifications",
      badge: unreadNotifications,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      route: "/settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleNavigation(item.route)}
              className={`flex-col h-14 w-16 p-1 relative ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Button>
          )
        })}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}
