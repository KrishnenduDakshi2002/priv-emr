
import { useState } from "react"
import { ArrowLeft, Search, Eye, Lock, Unlock, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SharedEMR {
  id: string
  title: string
  patientName: string
  patientEmail: string
  type: string
  sharedDate: string
  accessExpiry: string | null
  isExpired: boolean
  purpose: string
  isDecrypted: boolean
}

export default function DoctorSharedEMRs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [decryptingId, setDecryptingId] = useState<string | null>(null)

  const [emrs, setEmrs] = useState<SharedEMR[]>([
    {
      id: "1",
      title: "Blood Test Report - Apr 2025",
      patientName: "Priya Sharma",
      patientEmail: "priya.sharma@email.com",
      type: "lab",
      sharedDate: "2025-06-18T10:30:00Z",
      accessExpiry: "2025-06-25T10:30:00Z",
      isExpired: false,
      purpose: "Follow-up consultation",
      isDecrypted: false,
    },
    {
      id: "2",
      title: "X-Ray Chest - Mar 2025",
      patientName: "Rajesh Kumar",
      patientEmail: "rajesh.k@email.com",
      type: "imaging",
      sharedDate: "2025-06-17T15:45:00Z",
      accessExpiry: null,
      isExpired: false,
      purpose: "Second opinion",
      isDecrypted: true,
    },
    {
      id: "3",
      title: "ECG Report - Feb 2025",
      patientName: "Sunita Roy",
      patientEmail: "sunita.roy@email.com",
      type: "diagnostic",
      sharedDate: "2025-06-16T09:20:00Z",
      accessExpiry: "2025-06-18T09:20:00Z",
      isExpired: true,
      purpose: "Cardiac evaluation",
      isDecrypted: false,
    },
  ])

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

  const getExpiryText = (expiry: string | null, isExpired: boolean) => {
    if (!expiry) return "Permanent"
    if (isExpired) return "Expired"

    const now = new Date()
    const expiryDate = new Date(expiry)
    const diffInDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays <= 0) return "Expires today"
    if (diffInDays === 1) return "Expires tomorrow"
    return `${diffInDays} days left`
  }

  const handleDecrypt = async (emrId: string) => {
    setDecryptingId(emrId)
    // Simulate decryption process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setEmrs((prev) => prev.map((emr) => (emr.id === emrId ? { ...emr, isDecrypted: true } : emr)))
    setDecryptingId(null)
  }

  const handleViewEMR = (emrId: string) => {
    console.log("Viewing EMR:", emrId)
    // Navigate to EMR detail view
  }

  const filteredEMRs = emrs.filter((emr) => {
    const matchesSearch =
      emr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emr.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || emr.type === filterType
    return matchesSearch && matchesFilter
  })

  const activeEMRs = filteredEMRs.filter((emr) => !emr.isExpired)
  const expiredEMRs = filteredEMRs.filter((emr) => emr.isExpired)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">📁 Shared EMRs</h1>
            <p className="text-xs text-gray-500">{activeEMRs.length} active</p>
          </div>
          <div className="w-9" />
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search EMRs or patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="px-3 py-4 space-y-4">
        {/* Security Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            All EMRs are encrypted. Click decrypt to view patient data securely.
          </AlertDescription>
        </Alert>

        {/* Active EMRs */}
        {activeEMRs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              🔓 Active Access
              <Badge variant="default" className="bg-green-100 text-green-700">
                {activeEMRs.length}
              </Badge>
            </h2>

            {activeEMRs.map((emr) => (
              <Card key={emr.id} className="border-0 shadow-sm border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* EMR Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getTypeIcon(emr.type)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{emr.title}</h3>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {emr.patientName}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={emr.accessExpiry ? "outline" : "default"}
                        className={
                          emr.accessExpiry ? "border-yellow-300 text-yellow-700" : "bg-green-100 text-green-700"
                        }
                      >
                        {getExpiryText(emr.accessExpiry, emr.isExpired)}
                      </Badge>
                    </div>

                    {/* Access Info */}
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Shared:</span>
                        <span className="text-gray-900">{new Date(emr.sharedDate).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Purpose:</span>
                        <span className="text-gray-900">{emr.purpose}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`flex items-center gap-1 ${emr.isDecrypted ? "text-green-600" : "text-gray-600"}`}
                        >
                          {emr.isDecrypted ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {emr.isDecrypted ? "Decrypted" : "Encrypted"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {!emr.isDecrypted ? (
                        <Button
                          onClick={() => handleDecrypt(emr.id)}
                          disabled={decryptingId === emr.id}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {decryptingId === emr.id ? (
                            "Decrypting..."
                          ) : (
                            <>
                              <Unlock className="mr-2 h-4 w-4" />
                              Decrypt & View
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleViewEMR(emr.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View EMR
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Expired EMRs */}
        {expiredEMRs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ⏰ Expired Access
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                {expiredEMRs.length}
              </Badge>
            </h2>

            {expiredEMRs.map((emr) => (
              <Card key={emr.id} className="border-0 shadow-sm border-l-4 border-l-red-500 opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{getTypeIcon(emr.type)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{emr.title}</h4>
                        <p className="text-xs text-gray-600">{emr.patientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="bg-red-100 text-red-700">
                        Expired
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(emr.sharedDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredEMRs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No EMRs Found</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? "Try adjusting your search" : "Shared EMRs will appear here"}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
