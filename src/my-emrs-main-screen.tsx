
import { useState, useEffect } from "react"
import { Search, Plus, Eye, Share2, MoreVertical, Calendar, User, CheckCircle, XCircle, FileText, Download, Copy, Mail, Clock, Shield, Hash, Key, Lock, Users, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "raviger"
import { EMRSummary, EMRRecord } from "@/types/emr"
import { EMRStorage, EMRCrypto } from "@/lib/emr-utils"
import BottomNavigation from "./bottom-navigation"
import BellNotification from "./bell-notification-component"

export default function MyEMRsMainScreen() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [emrs, setEmrs] = useState<EMRSummary[]>([])
  const [showDummyData, setShowDummyData] = useState(true)
  const [selectedEMR, setSelectedEMR] = useState<EMRSummary | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareFormData, setShareFormData] = useState({
    doctorEmail: "",
    accessDuration: "7-days",
    purpose: "",
    allowDownload: false,
    allowPrint: false,
    notifyPatient: true
  })

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFullEMRData = (emrId: string): EMRRecord | null => {
    // For dummy data, create a mock full EMR record
    const emr = emrs.find(e => e.id === emrId)
    if (!emr) return null

    if (emrId.startsWith('EMR-DEMO')) {
      // Mock full EMR data for demo records
      return {
        id: emr.id,
        version: '1.0',
        patient: {
          email: 'patient@example.com',
          aadhaarNumber: '1234-5678-9012',
          abhaId: '12-3456-7890-1234',
          name: 'John Doe'
        },
        provider: {
          name: emr.provider,
          hospitalName: emr.hospital,
          specialization: 'General Medicine'
        },
        metadata: {
          id: emr.id,
          title: emr.title,
          description: emr.description,
          type: emr.type,
          subType: emr.subType,
          priority: emr.priority,
          status: 'active',
          tags: emr.tags
        },
        content: {
          textData: `Encrypted medical data for ${emr.title}. This is a demo record showing how the EMR content would be displayed.`,
          structuredData: emr.type === 'lab' ? {
            labResults: [
              { testName: 'Hemoglobin', value: 14.2, unit: 'g/dL', referenceRange: '12-16', status: 'normal' },
              { testName: 'WBC Count', value: 7500, unit: '/μL', referenceRange: '4000-11000', status: 'normal' }
            ]
          } : undefined
        },
        security: {
          hash: '0xa1b2c3d4e5f6...789abc',
          signature: '0x9876543210ab...cdef12',
          encryptionMethod: 'AES-256-GCM',
          keyId: `key-${emr.id}`,
          isEncrypted: true,
          isSigned: true,
          verificationStatus: emr.verified ? 'verified' : 'pending'
        },
        timestamps: {
          createdAt: emr.dateCreated,
          updatedAt: emr.dateCreated,
          lastAccessedAt: emr.lastAccessed
        },
        access: {
          createdBy: {
            name: emr.provider,
            hospitalName: emr.hospital
          },
          accessLog: [],
          sharedWith: []
        },
        compliance: {
          hipaaCompliant: true,
          gdprCompliant: true,
          localRegulationsCompliant: true,
          retentionPeriod: 7,
          consentGiven: true,
          consentDate: emr.dateCreated,
          auditTrail: []
        }
      } as EMRRecord
    }

    // For real EMRs, get from localStorage
    return EMRStorage.getEMRById(emrId)
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
    const emr = emrs.find(e => e.id === emrId)
    if (emr) {
      setSelectedEMR(emr)
      setViewDialogOpen(true)
    }
  }

  const handleShareEMR = (emrId: string) => {
    const emr = emrs.find(e => e.id === emrId)
    if (emr) {
      setSelectedEMR(emr)
      setShareDialogOpen(true)
    }
  }

  const handleDownloadEMR = async (emrId: string) => {
    try {
      const fullEMR = EMRStorage.getEMRById(emrId)
      if (fullEMR) {
        const exportData = {
          id: fullEMR.id,
          title: fullEMR.metadata.title,
          patient: fullEMR.patient,
          provider: fullEMR.provider,
          content: fullEMR.content,
          timestamps: fullEMR.timestamps,
          security: fullEMR.security
        }
        
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `EMR-${fullEMR.id}-${fullEMR.metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        toast({
          title: "EMR Downloaded",
          description: "EMR has been downloaded successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download EMR. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `${fieldName} has been copied to your clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleShareSubmit = async () => {
    if (!selectedEMR || !shareFormData.doctorEmail || !shareFormData.purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate sharing process
      const shareId = `SHARE-${Date.now().toString(36).toUpperCase()}`
      const expiresAt = new Date()
      
      switch (shareFormData.accessDuration) {
        case "1-hour":
          expiresAt.setHours(expiresAt.getHours() + 1)
          break
        case "24-hours":
          expiresAt.setHours(expiresAt.getHours() + 24)
          break
        case "7-days":
          expiresAt.setDate(expiresAt.getDate() + 7)
          break
        case "30-days":
          expiresAt.setDate(expiresAt.getDate() + 30)
          break
        case "permanent":
          expiresAt.setFullYear(expiresAt.getFullYear() + 10)
          break
      }

      // In a real app, this would make an API call
      console.log("Sharing EMR:", {
        emrId: selectedEMR.id,
        shareId,
        doctorEmail: shareFormData.doctorEmail,
        purpose: shareFormData.purpose,
        permissions: {
          download: shareFormData.allowDownload,
          print: shareFormData.allowPrint
        },
        expiresAt: expiresAt.toISOString()
      })

      toast({
        title: "EMR Shared Successfully",
        description: `EMR has been shared with ${shareFormData.doctorEmail}. Share ID: ${shareId}`,
      })

      // Reset form and close dialog
      setShareFormData({
        doctorEmail: "",
        accessDuration: "7-days",
        purpose: "",
        allowDownload: false,
        allowPrint: false,
        notifyPatient: true
      })
      setShareDialogOpen(false)
      setSelectedEMR(null)

    } catch (error) {
      toast({
        title: "Sharing Failed",
        description: "Failed to share EMR. Please try again.",
        variant: "destructive",
      })
    }
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
                        <DropdownMenuItem onClick={() => handleDownloadEMR(emr.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download EMR
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

      {/* View EMR Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedEMR?.title}
            </DialogTitle>
            <DialogDescription>
              Detailed view of medical record - {selectedEMR?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedEMR && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="sharing">Sharing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">EMR Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedEMR.id}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(selectedEMR.id, "EMR ID")} className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline" className={getTypeColor(selectedEMR.type)}>
                          {selectedEMR.type.charAt(0).toUpperCase() + selectedEMR.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Priority:</span>
                        <Badge variant={selectedEMR.priority === 'critical' ? 'destructive' : selectedEMR.priority === 'high' ? 'default' : 'secondary'}>
                          {selectedEMR.priority.charAt(0).toUpperCase() + selectedEMR.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={selectedEMR.verified ? "default" : "destructive"}>
                          {selectedEMR.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      {selectedEMR.fileSize && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">File Size:</span>
                          <span className="text-sm">{selectedEMR.fileSize}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Provider Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Doctor:</span>
                        <span className="text-sm font-medium">{selectedEMR.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Hospital:</span>
                        <span className="text-sm">{selectedEMR.hospital}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created:</span>
                        <span className="text-sm">{formatDateTime(selectedEMR.dateCreated)}</span>
                      </div>
                      {selectedEMR.lastAccessed && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Accessed:</span>
                          <span className="text-sm">{formatDateTime(selectedEMR.lastAccessed)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedEMR.description}</p>
                  </CardContent>
                </Card>

                {selectedEMR.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedEMR.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {(() => {
                  const fullEMR = getFullEMRData(selectedEMR.id)
                  return fullEMR ? (
                    <div className="space-y-4">
                      {fullEMR.content.textData && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Medical Content
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">{fullEMR.content.textData}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {fullEMR.content.structuredData?.labResults && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Lab Results</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {fullEMR.content.structuredData.labResults.map((result, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <span className="font-medium text-sm">{result.testName}</span>
                                    <span className="text-xs text-gray-500 ml-2">({result.referenceRange})</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-medium">{result.value} {result.unit}</span>
                                    <Badge 
                                      variant={result.status === 'normal' ? 'default' : result.status === 'critical' ? 'destructive' : 'secondary'}
                                      className="ml-2 text-xs"
                                    >
                                      {result.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {fullEMR.content.fileData && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Attached File</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div>
                                  <p className="font-medium text-sm">{fullEMR.content.fileData.originalName}</p>
                                  <p className="text-xs text-gray-500">{fullEMR.content.fileData.mimeType}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Unable to load EMR content</p>
                    </div>
                  )
                })()}
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                {(() => {
                  const fullEMR = getFullEMRData(selectedEMR.id)
                  return fullEMR ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Encryption & Signing
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Encrypted:</span>
                            <Badge variant={fullEMR.security.isEncrypted ? "default" : "destructive"}>
                              {fullEMR.security.isEncrypted ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Signed:</span>
                            <Badge variant={fullEMR.security.isSigned ? "default" : "destructive"}>
                              {fullEMR.security.isSigned ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Verification:</span>
                            <Badge variant={fullEMR.security.verificationStatus === 'verified' ? "default" : "secondary"}>
                              {fullEMR.security.verificationStatus}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Method:</span>
                            <span className="text-sm font-mono">{fullEMR.security.encryptionMethod}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Cryptographic Hashes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Hash:</span>
                              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(fullEMR.security.hash, "Hash")} className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <code className="text-xs bg-gray-100 p-2 rounded block break-all">{fullEMR.security.hash}</code>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Signature:</span>
                              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(fullEMR.security.signature, "Signature")} className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <code className="text-xs bg-gray-100 p-2 rounded block break-all">{fullEMR.security.signature}</code>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Key ID:</span>
                            <code className="text-xs bg-gray-100 p-2 rounded block mt-1">{fullEMR.security.keyId}</code>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Unable to load security information</p>
                    </div>
                  )
                })()}
              </TabsContent>

              <TabsContent value="sharing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Quick Share
                    </CardTitle>
                    <CardDescription>
                      Share this EMR with a healthcare provider
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleShareEMR(selectedEMR.id)} 
                      className="w-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share EMR Access
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Access History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">{selectedEMR.provider}</p>
                            <p className="text-xs text-gray-500">Created EMR</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{formatDateTime(selectedEMR.dateCreated)}</span>
                      </div>
                      {selectedEMR.lastAccessed && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Eye className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium">You</p>
                              <p className="text-xs text-gray-500">Last viewed</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{formatDateTime(selectedEMR.lastAccessed)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Share EMR Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share EMR Access
            </DialogTitle>
            <DialogDescription>
              Grant secure access to {selectedEMR?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorEmail">Healthcare Provider Email *</Label>
              <Input
                id="doctorEmail"
                type="email"
                placeholder="doctor@hospital.com"
                value={shareFormData.doctorEmail}
                onChange={(e) => setShareFormData(prev => ({ ...prev, doctorEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessDuration">Access Duration *</Label>
              <Select 
                value={shareFormData.accessDuration} 
                onValueChange={(value) => setShareFormData(prev => ({ ...prev, accessDuration: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-hour">1 Hour</SelectItem>
                  <SelectItem value="24-hours">24 Hours</SelectItem>
                  <SelectItem value="7-days">7 Days</SelectItem>
                  <SelectItem value="30-days">30 Days</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Access *</Label>
              <Textarea
                id="purpose"
                placeholder="e.g., Consultation, Second opinion, Treatment planning..."
                value={shareFormData.purpose}
                onChange={(e) => setShareFormData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowDownload"
                    checked={shareFormData.allowDownload}
                    onCheckedChange={(checked) => setShareFormData(prev => ({ ...prev, allowDownload: checked as boolean }))}
                  />
                  <Label htmlFor="allowDownload" className="text-sm">Allow download</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowPrint"
                    checked={shareFormData.allowPrint}
                    onCheckedChange={(checked) => setShareFormData(prev => ({ ...prev, allowPrint: checked as boolean }))}
                  />
                  <Label htmlFor="allowPrint" className="text-sm">Allow printing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notifyPatient"
                    checked={shareFormData.notifyPatient}
                    onCheckedChange={(checked) => setShareFormData(prev => ({ ...prev, notifyPatient: checked as boolean }))}
                  />
                  <Label htmlFor="notifyPatient" className="text-sm">Notify patient</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShareDialogOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleShareSubmit} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Share Access
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
