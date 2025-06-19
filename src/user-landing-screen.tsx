

import { useState } from "react"
import { Settings, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import BellNotification from "./bell-notification-component"

interface NavigationItem {
  id: string
  title: string
  description: string
  icon: string
  route: string
  category: "primary" | "secondary" | "advanced"
  badge?: string
  isNew?: boolean
}

interface UserStats {
  totalEMRs: number
  activeProofs: number
  sharedAccess: number
  unreadNotifications: number
}

export default function UserLandingScreen() {
  const [userStats] = useState<UserStats>({
    totalEMRs: 8,
    activeProofs: 3,
    sharedAccess: 5,
    unreadNotifications: 4,
  })

  const [navigationItems] = useState<NavigationItem[]>([
    // Primary Features
    {
      id: "my-emrs",
      title: "My EMRs",
      description: "View and manage your medical records",
      icon: "📄",
      route: "/my-emrs",
      category: "primary",
      badge: `${userStats.totalEMRs}`,
    },
    {
      id: "share-emr",
      title: "Share EMR Access",
      description: "Grant doctors access to your records",
      icon: "📤",
      route: "/share-emr",
      category: "primary",
    },
    {
      id: "my-proofs",
      title: "My ZK Proofs",
      description: "Privacy-preserving medical proofs",
      icon: "🧾",
      route: "/my-proofs",
      category: "primary",
      badge: `${userStats.activeProofs}`,
      isNew: true,
    },
    {
      id: "activity-log",
      title: "Activity Log",
      description: "Track all EMR activities and access",
      icon: "🔄",
      route: "/activity-log",
      category: "primary",
      badge: userStats.unreadNotifications > 0 ? "New" : undefined,
    },

    // Secondary Features
    {
      id: "generate-proof",
      title: "Generate Proof",
      description: "Create zero-knowledge proofs from EMRs",
      icon: "⚙️",
      route: "/generate-proof",
      category: "secondary",
    },
    {
      id: "share-proof",
      title: "Share Proof",
      description: "Share proofs with third parties",
      icon: "🔗",
      route: "/share-proof",
      category: "secondary",
    },
    {
      id: "verify-proof",
      title: "Verify Proof",
      description: "Verify received zero-knowledge proofs",
      icon: "✅",
      route: "/verify-proof",
      category: "secondary",
    },

    // Advanced Features
    {
      id: "wallet-settings",
      title: "Wallet Settings",
      description: "Manage your secure medical wallet",
      icon: "🔐",
      route: "/wallet-settings",
      category: "advanced",
    },
    {
      id: "privacy-controls",
      title: "Privacy Controls",
      description: "Configure data sharing preferences",
      icon: "🛡️",
      route: "/privacy-controls",
      category: "advanced",
    },
    {
      id: "backup-recovery",
      title: "Backup & Recovery",
      description: "Secure your medical data access",
      icon: "💾",
      route: "/backup-recovery",
      category: "advanced",
    },
  ])

  const handleNavigation = (route: string) => {
    console.log(`Navigating to: ${route}`)
    // Navigation logic here
  }

  const handleNotificationClick = () => {
    handleNavigation("/activity-log")
  }

  const primaryItems = navigationItems.filter((item) => item.category === "primary")
  const secondaryItems = navigationItems.filter((item) => item.category === "secondary")
  const advancedItems = navigationItems.filter((item) => item.category === "advanced")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">PS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome back!</h1>
              <p className="text-sm text-gray-500">Priya Sharma</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BellNotification unreadCount={userStats.unreadNotifications} onClick={handleNotificationClick} />
            <Button variant="ghost" size="sm" className="text-gray-600 p-2">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalEMRs}</div>
              <div className="text-xs text-blue-700 font-medium">EMRs</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.activeProofs}</div>
              <div className="text-xs text-green-700 font-medium">Active Proofs</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.sharedAccess}</div>
              <div className="text-xs text-purple-700 font-medium">Shared Access</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Welcome Message */}
        <Alert className="border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <AlertDescription className="text-blue-800 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Your Medical Data, Your Control</p>
                <p>Securely manage, share, and prove facts about your health records with zero-knowledge technology.</p>
              </div>
            </AlertDescription>
          </div>
        </Alert>

        {/* Primary Features */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">🎯 Main Features</h2>
          <div className="grid grid-cols-1 gap-3">
            {primaryItems.map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleNavigation(item.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.isNew && (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Zero-Knowledge Features */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">🔒 Privacy Features</h2>
          <div className="grid grid-cols-1 gap-3">
            {secondaryItems.map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500"
                onClick={() => handleNavigation(item.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">⚙️ Advanced Settings</h2>
          <div className="grid grid-cols-1 gap-3">
            {advancedItems.map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleNavigation(item.route)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleNavigation("/upload-emr")}
              className="h-16 bg-green-500 hover:bg-green-600 text-white flex-col gap-1"
            >
              <span className="text-xl">📤</span>
              <span className="text-xs">Upload EMR</span>
            </Button>
            <Button
              onClick={() => handleNavigation("/emergency-access")}
              variant="outline"
              className="h-16 border-red-300 text-red-600 hover:bg-red-50 flex-col gap-1"
            >
              <span className="text-xl">🚨</span>
              <span className="text-xs">Emergency</span>
            </Button>
          </div>
        </div>

        {/* Security Status */}
        <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🛡️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Security Status</h3>
                <p className="text-xs text-gray-600">All systems secure • Wallet encrypted • Proofs valid</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                ✅ Secure
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">PS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">Priya Sharma</p>
                <p className="text-xs text-gray-500">priya.sharma@email.com</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Safe Area */}
      <div className="h-6" />
    </div>
  )
}
