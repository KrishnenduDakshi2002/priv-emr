
import { useState } from "react"
import { ArrowLeft, Clock, User, CheckCircle, XCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DoctorDashboardNavigation from "./doctor-dashboard.navigate"

interface AccessRequest {
  id: string
  patientName: string
  patientEmail: string
  emrTitle: string
  emrType: string
  purpose: string
  accessDuration: string
  requestDate: string
  status: "pending" | "approved" | "declined"
}

export default function DoctorAccessRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: "1",
      patientName: "Priya Sharma",
      patientEmail: "priya.sharma@email.com",
      emrTitle: "Blood Test Report - Apr 2025",
      emrType: "lab",
      purpose: "Follow-up consultation for diabetes management",
      accessDuration: "7 days",
      requestDate: "2025-06-18T10:30:00Z",
      status: "pending",
    },
    {
      id: "2",
      patientName: "Rajesh Kumar",
      patientEmail: "rajesh.k@email.com",
      emrTitle: "X-Ray Chest - Mar 2025",
      emrType: "imaging",
      purpose: "Second opinion for respiratory symptoms",
      accessDuration: "1-time",
      requestDate: "2025-06-17T15:45:00Z",
      status: "pending",
    },
    {
      id: "3",
      patientName: "Sunita Roy",
      patientEmail: "sunita.roy@email.com",
      emrTitle: "ECG Report - Feb 2025",
      emrType: "diagnostic",
      purpose: "Cardiac evaluation",
      accessDuration: "30 days",
      requestDate: "2025-06-16T09:20:00Z",
      status: "approved",
    },
  ])

  const [isLoading, setIsLoading] = useState<string | null>(null)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return "🧪"
      case "imaging":
        return "📸"
      case "diagnostic":
        return "📊"
      case "prescription":
        return "💊"
      default:
        return "📄"
    }
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const handleApprove = async (requestId: string) => {
    setIsLoading(requestId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" as const } : req)))
    setIsLoading(null)
  }

  const handleDecline = async (requestId: string) => {
    setIsLoading(requestId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "declined" as const } : req)))
    setIsLoading(null)
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const processedRequests = requests.filter((req) => req.status !== "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">📥 Access Requests</h1>
            <p className="text-xs text-gray-500">{pendingRequests.length} pending</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-3 py-4 space-y-4">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ⏳ Pending Approval
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                {pendingRequests.length}
              </Badge>
            </h2>

            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-0 shadow-sm border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Patient Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                        <p className="text-sm text-gray-600">{request.patientEmail}</p>
                      </div>
                    </div>

                    {/* EMR Info */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getTypeIcon(request.emrType)}</span>
                        <h4 className="font-medium text-gray-900 text-sm">{request.emrTitle}</h4>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Access Duration: {request.accessDuration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>Requested: {getRelativeTime(request.requestDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Purpose */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Purpose:</p>
                      <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{request.purpose}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        disabled={isLoading === request.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isLoading === request.id ? (
                          "Approving..."
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDecline(request.id)}
                        disabled={isLoading === request.id}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {isLoading === request.id ? (
                          "Declining..."
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Decline
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">📋 Recent Decisions</h2>

            {processedRequests.map((request) => (
              <Card key={request.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{getTypeIcon(request.emrType)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{request.patientName}</h4>
                        <p className="text-xs text-gray-600">{request.emrTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={request.status === "approved" ? "default" : "destructive"}
                        className={
                          request.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }
                      >
                        {request.status === "approved" ? "Approved" : "Declined"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{getRelativeTime(request.requestDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Requests</h3>
            <p className="text-gray-500 text-sm">Patient access requests will appear here</p>
          </div>
        )}
      </div>

      {/* <DoctorDashboardNavigation currentPage="requests" /> */}

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
