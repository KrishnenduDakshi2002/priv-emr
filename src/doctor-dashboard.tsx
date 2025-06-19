
import { useState } from "react"
import { Bell, User, FileText, ChevronRight, Activity, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import BellNotification from "./bell-notification-component"
import { useNavigate } from "raviger"
import DoctorDashboardNavigation from "./doctor-dashboard.navigate"

interface DashboardStats {
  pendingRequests: number
  sharedEMRs: number
  recentActivity: number
}

interface RecentEMR {
  id: string
  title: string
  patientName: string
  sharedDate: string
  expiresIn: string
}

interface RecentActivity {
  id: string
  action: string
  timestamp: string
  emrTitle?: string
}

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [stats] = useState<DashboardStats>({
    pendingRequests: 2,
    sharedEMRs: 8,
    recentActivity: 5,
  })

  const [recentEMRs] = useState<RecentEMR[]>([
    {
      id: "1",
      title: "Blood Test Report",
      patientName: "Priya Sharma",
      sharedDate: "2025-06-18",
      expiresIn: "5 days",
    },
    {
      id: "2",
      title: "X-Ray Chest",
      patientName: "Rajesh Kumar",
      sharedDate: "2025-06-17",
      expiresIn: "2 days",
    },
    {
      id: "3",
      title: "ECG Report",
      patientName: "Sunita Roy",
      sharedDate: "2025-06-16",
      expiresIn: "Permanent",
    },
  ])

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      action: "Accessed Blood Report",
      timestamp: "2 hours ago",
      emrTitle: "Blood Test - Priya S.",
    },
    {
      id: "2",
      action: "Approved access request",
      timestamp: "5 hours ago",
      emrTitle: "X-Ray - Rajesh K.",
    },
    {
      id: "3",
      action: "Requested EMR access",
      timestamp: "1 day ago",
      emrTitle: "MRI Scan - Amit P.",
    },
  ])

  const handleNavigate = (page: string) => {
    navigate(page)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">DR</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dr. Arvind Kumar</h1>
              <p className="text-sm text-gray-500">Cardiologist • Apollo Hospital</p>
            </div>
          </div>
          <BellNotification unreadCount={3} onClick={() => handleNavigate("notifications")} />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pendingRequests}</div>
              <div className="text-xs text-blue-700 font-medium">Pending Requests</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.sharedEMRs}</div>
              <div className="text-xs text-green-700 font-medium">Shared EMRs</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-purple-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.recentActivity}</div>
              <div className="text-xs text-purple-700 font-medium">Recent Actions</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                📨 Pending Requests
                {stats.pendingRequests > 0 && (
                  <Badge variant="destructive" className="bg-red-100 text-red-700">
                    {stats.pendingRequests}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate("requests")}
                className="text-blue-600 p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.pendingRequests > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Priya Sharma</p>
                    <p className="text-xs text-gray-600">Blood Test Report • 7 days access</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 px-3 text-xs bg-green-500 hover:bg-green-600">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-gray-300">
                      Decline
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleNavigate("requests")}
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  View All Requests
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No pending requests</p>
            )}
          </CardContent>
        </Card>

        {/* Recent EMRs */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900">📁 Recent EMRs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate("emrs")} className="text-blue-600 p-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {recentEMRs.map((emr) => (
              <div key={emr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{emr.title}</p>
                    <p className="text-xs text-gray-600">{emr.patientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Expires in</p>
                  <p className="text-xs font-medium text-gray-900">{emr.expiresIn}</p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleNavigate("emrs")}
              className="w-full border-gray-300 text-gray-600"
            >
              View All EMRs ({stats.sharedEMRs})
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900">⏱️ Recent Activity</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate("activity")}
                className="text-blue-600 p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.emrTitle}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleNavigate("request-access")}
            className="h-12 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Request Access
          </Button>
          <Button
            onClick={() => handleNavigate("create-emr")}
            variant="outline"
            className="h-12 border-green-300 text-green-600 hover:bg-green-50"
          >
            <FileText className="mr-2 h-4 w-4" />
            Create EMR
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* <DoctorDashboardNavigation currentPage="dashboard" />  */}

      {/* Mobile Safe Area */}
      <div className="h-16" />
    </div>
  )
}
