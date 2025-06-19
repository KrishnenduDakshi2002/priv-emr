
import { useState, useEffect } from "react"
import { Search, Plus, Eye, Share2, MoreVertical, Calendar, User, CheckCircle, XCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNavigate } from "raviger"
import { EMRSummary } from "@/types/emr"
import { EMRStorage } from "@/lib/emr-utils"
import BottomNavigation from "./bottom-navigation"
import BellNotification from "./bell-notification-component"

export default function MyEMRsMainScreen() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [emrs, setEmrs] = useState<EMRSummary[]>([])
  const [showDummyData, setShowDummyData] = useState(true)

  // Dummy EMR data for demonstration
  const dummyEMRs: EMRSummary[] = [
    {
      id: "EMR-DEMO001",
      title: "Blood Test Report - Complete Blood Count",
      description: "Complete Blood Count (CBC) and Lipid Profile analysis showing normal ranges for all parameters",
      type: "lab",
      subType: "Blood Work",
      dateCreated: "2024-01-15T10:30:00Z",
      provider: "Dr. Arvind Kumar",
      hospital: "Apollo Hospital",
      verified: true,
      priority: "medium",
      fileSize: "2.4 MB",
      lastAccessed: "2024-01-20T14:20:00Z",
      tags: ["blood-test", "routine", "cbc"]
    },
    {
      id: "EMR-DEMO002",
      title: "X-Ray Chest PA View",
      description: "Chest X-ray showing clear lung fields with no signs of infection or abnormalities",
      type: "imaging",
      subType: "X-Ray",
      dateCreated: "2024-01-12T15:45:00Z",
      provider: "Dr. Priya Sharma",
      hospital: "Max Healthcare",
      verified: true,
      priority: "high",
      fileSize: "8.1 MB",
      lastAccessed: "2024-01-18T09:15:00Z",
      tags: ["x-ray", "chest", "imaging"]
    },
    {
      id: "EMR-DEMO003",
      title: "Prescription - Diabetes Management",
      description: "Medication prescription for Type 2 diabetes including Metformin and dietary recommendations",
      type: "prescription",
      subType: "Medication",
      dateCreated: "2024-01-10T11:20:00Z",
      provider: "Dr. Rajesh Patel",
      hospital: "Fortis Hospital",
      verified: false,
      priority: "critical",
      fileSize: "1.2 MB",
      tags: ["diabetes", "prescription", "medication"]
    },
    {
      id: "EMR-DEMO004",
      title: "ECG Report - Routine Checkup",
      description: "12-lead electrocardiogram showing normal sinus rhythm with no arrhythmias detected",
      type: "diagnostic",
      subType: "ECG",
      dateCreated: "2024-01-08T09:30:00Z",
      provider: "Dr. Sunita Roy",
      hospital: "AIIMS Delhi",
      verified: true,
      priority: "medium",
      fileSize: "3.7 MB",
      lastAccessed: "2024-01-16T16:45:00Z",
      tags: ["ecg", "heart", "routine"]
    },
    {
      id: "EMR-DEMO005",
      title: "COVID-19 Vaccination Certificate",
      description: "COVID-19 vaccination certificate - 2nd dose of Covishield administered",
      type: "vaccination",
      subType: "COVID-19",
      dateCreated: "2024-01-05T14:00:00Z",
      provider: "Dr. Amit Singh",
      hospital: "Government Hospital",
      verified: true,
      priority: "low",
      fileSize: "0.8 MB",
      tags: ["covid-19", "vaccination", "certificate"]
    },
    {
      id: "EMR-DEMO006",
      title: "MRI Brain Scan",
      description: "Brain MRI scan showing normal brain structure with no abnormalities detected",
      type: "imaging",
      subType: "MRI",
      dateCreated: "2024-01-03T16:15:00Z",
      provider: "Dr. Neha Gupta",
      hospital: "Medanta Hospital",
      verified: true,
      priority: "high",
      fileSize: "15.3 MB",
      lastAccessed: "2024-01-14T11:30:00Z",
      tags: ["mri", "brain", "neurology"]
    },
    {
      id: "EMR-DEMO007",
      title: "Consultation Notes - Cardiology",
      description: "Cardiology consultation for chest pain evaluation, including stress test recommendations",
      type: "consultation",
      subType: "Cardiology",
      dateCreated: "2024-01-01T13:45:00Z",
      provider: "Dr. Vikram Singh",
      hospital: "Escorts Heart Institute",
      verified: true,
      priority: "medium",
      fileSize: "2.1 MB",
      tags: ["cardiology", "consultation", "chest-pain"]
    }
  ]

  // Load EMRs from localStorage
  const loadEMRs = () => {
    try {
      const storedEMRs = EMRStorage.getEMRSummaries()
      console.log('Loaded EMRs from localStorage:', storedEMRs)
      
      // Combine stored EMRs with dummy data based on toggle
      const combinedEMRs = showDummyData ? [...dummyEMRs, ...storedEMRs] : storedEMRs
      setEmrs(combinedEMRs)
    } catch (error) {
      console.error('Failed to load EMRs:', error)
      // Fallback to dummy data if localStorage fails and dummy data is enabled
      setEmrs(showDummyData ? dummyEMRs : [])
    }
  }

  // Load EMRs on component mount and when dummy data toggle changes
  useEffect(() => {
    loadEMRs()
  }, [showDummyData])

  // Also reload EMRs when the component becomes visible (when navigating back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadEMRs()
      }
    }

    const handleFocus = () => {
      loadEMRs()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // If no EMRs in localStorage, show empty state
  const displayEmrs = emrs.length > 0 ? emrs : []

  const filteredEMRs = emrs.filter((emr) => {
    const matchesSearch =
      emr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emr.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emr.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || emr.type === filterType
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return "🧪"
      case "imaging":
        return "📸"
      case "prescription":
        return "💊"
      case "diagnostic":
        return "📊"
      case "vaccination":
        return "💉"
      default:
        return "📄"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lab":
        return "bg-blue-100 text-blue-700"
      case "imaging":
        return "bg-purple-100 text-purple-700"
      case "prescription":
        return "bg-green-100 text-green-700"
      case "diagnostic":
        return "bg-orange-100 text-orange-700"
      case "vaccination":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleViewEMR = (emrId: string) => {
    console.log("Viewing EMR:", emrId)
    // Navigate to EMR detail view
  }

  const handleShareEMR = (emrId: string) => {
    console.log("Sharing EMR:", emrId)
    // Navigate to share EMR screen
  }

  const handleUploadEMR = () => {
    navigate("/create-emr")
  }

  const handleNotificationClick = () => {
    console.log("Opening notifications")
    // Navigate to notifications/activity log
  }

  const handleRefresh = () => {
    console.log("Refreshing EMR list...")
    loadEMRs()
  }

  const toggleDummyData = () => {
    setShowDummyData(!showDummyData)
    // Reload EMRs after toggle
    setTimeout(() => loadEMRs(), 100)
  }

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    const stored = localStorage.getItem('privemr_records')
    console.log('Raw localStorage data:', stored)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        console.log('Parsed localStorage data:', parsed)
      } catch (error) {
        console.error('Error parsing localStorage data:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">My EMRs</h1>
              <p className="text-sm text-gray-500">{filteredEMRs.length} medical records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BellNotification unreadCount={3} onClick={handleNotificationClick} />
            <Button onClick={handleRefresh} size="sm" variant="outline" className="text-gray-600">
              <FileText className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button 
              onClick={toggleDummyData} 
              size="sm" 
              variant={showDummyData ? "default" : "outline"} 
              className={showDummyData ? "bg-green-500 text-white" : "text-gray-600"}
            >
              {showDummyData ? "Hide" : "Show"} Demo
            </Button>
            <Button onClick={debugLocalStorage} size="sm" variant="outline" className="text-gray-600">
              Debug
            </Button>
            <Button onClick={handleUploadEMR} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search EMRs, doctors, or hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: "all", label: "All", count: emrs.length },
              { key: "lab", label: "Lab Tests", count: emrs.filter((e) => e.type === "lab").length },
              { key: "imaging", label: "Imaging", count: emrs.filter((e) => e.type === "imaging").length },
              {
                key: "prescription",
                label: "Prescriptions",
                count: emrs.filter((e) => e.type === "prescription").length,
              },
              { key: "diagnostic", label: "Diagnostics", count: emrs.filter((e) => e.type === "diagnostic").length },
              { key: "vaccination", label: "Vaccines", count: emrs.filter((e) => e.type === "vaccination").length },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={filterType === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(filter.key)}
                className={`whitespace-nowrap text-xs ${
                  filterType === filter.key ? "bg-blue-500 text-white" : "border-gray-300 text-gray-600"
                }`}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {emrs.length > 0 && (
        <div className="px-4 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <div className="space-y-1">
                <p className="font-medium">🎉 Welcome to your secure EMR vault!</p>
                <p>
                  Your medical records are encrypted and only accessible by you. Tap any record to view details or share
                  with doctors.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* EMR Cards List */}
      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEMRs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? "No EMRs Found" : "No Medical Records Yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "Your medical records will appear here once you create them or doctors share them with you"}
            </p>
            {!searchQuery && (
              <Button onClick={handleUploadEMR} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First EMR
              </Button>
            )}
          </div>
        ) : (
          filteredEMRs.map((emr) => (
            <Card key={emr.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* EMR Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{getTypeIcon(emr.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-base leading-tight">{emr.title}</h3>
                          {emr.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{emr.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewEMR(emr.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareEMR(emr.id)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* EMR Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                                                  <span className="font-medium">{emr.provider}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(emr.dateCreated)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{emr.hospital}</span>
                      <span>•</span>
                      <span>{emr.fileSize}</span>
                      {emr.lastAccessed && (
                        <>
                          <span>•</span>
                          <span>Last viewed {formatDate(emr.lastAccessed)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* EMR Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getTypeColor(emr.type)}`}>
                        {emr.type.charAt(0).toUpperCase() + emr.type.slice(1)}
                      </Badge>
                      <Badge
                        variant={emr.verified ? "default" : "destructive"}
                        className={`text-xs ${
                          emr.verified
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {emr.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewEMR(emr.id)}
                        className="h-8 px-3 text-xs border-gray-300"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleShareEMR(emr.id)}
                        className="h-8 px-3 text-xs bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="my-emrs" />
    </div>
  )
}
