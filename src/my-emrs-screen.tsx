
import { useState } from "react"
import { ArrowLeft, Plus, Search, Eye, Share2, Calendar, User, CheckCircle, XCircle, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EMR {
  id: string
  title: string
  sender: string
  hospital: string
  dateReceived: string
  verified: boolean
  type: string
  description?: string
}

export default function MyEMRsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Mock EMR data
  const [emrs] = useState<EMR[]>([
    {
      id: "1",
      title: "Blood Test Report",
      sender: "Dr. Arvind Kumar",
      hospital: "Apollo Hospital",
      dateReceived: "2025-04-10",
      verified: true,
      type: "lab",
      description: "Complete Blood Count and Lipid Profile",
    },
    {
      id: "2",
      title: "X-Ray Chest",
      sender: "Dr. Priya Sharma",
      hospital: "Max Healthcare",
      dateReceived: "2025-03-28",
      verified: true,
      type: "imaging",
    },
    {
      id: "3",
      title: "Prescription",
      sender: "Dr. Rajesh Patel",
      hospital: "Fortis Hospital",
      dateReceived: "2025-03-15",
      verified: false,
      type: "prescription",
    },
    {
      id: "4",
      title: "ECG Report",
      sender: "Dr. Sunita Roy",
      hospital: "AIIMS Delhi",
      dateReceived: "2025-02-20",
      verified: true,
      type: "diagnostic",
    },
  ])

  const filteredEMRs = emrs.filter((emr) => {
    const matchesSearch =
      emr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emr.sender.toLowerCase().includes(searchQuery.toLowerCase())
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
      default:
        return "📄"
    }
  }

  const handleViewEMR = (emrId: string) => {
    // Navigate to EMR detail view
    console.log("Viewing EMR:", emrId)
  }

  const handleShareEMR = (emrId: string) => {
    // Navigate to share EMR screen
    console.log("Sharing EMR:", emrId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">📄 My EMRs</h1>
            <p className="text-xs text-gray-500">{filteredEMRs.length} records</p>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 p-2">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-3 pb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search EMRs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-300 focus:border-blue-500"
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

      {/* EMR Cards List */}
      <div className="px-3 py-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEMRs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No EMRs Found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery ? "Try adjusting your search" : "Your medical records will appear here"}
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Upload Record
            </Button>
          </div>
        ) : (
          filteredEMRs.map((emr) => (
            <Card key={emr.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(emr.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{emr.title}</h3>
                      {emr.description && <p className="text-xs text-gray-500 mt-1">{emr.description}</p>}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <User className="h-3 w-3" />
                    <span className="font-medium">{emr.sender}</span>
                    <span className="text-gray-400">•</span>
                    <span>{emr.hospital}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(emr.dateReceived)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={emr.verified ? "default" : "destructive"}
                      className={`text-xs ${
                        emr.verified
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {emr.verified ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Verified
                        </>
                      )}
                    </Badge>

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

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
