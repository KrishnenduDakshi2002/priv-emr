

import { CheckCircle, XCircle, Eye, Share2, Calendar, User, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EMRCardProps {
  emr: {
    id: string
    title: string
    description: string
    dateCreated: string
    sender: string
    hospital: string
    verified: boolean
    type: string
    fileSize?: string
    lastAccessed?: string
  }
  onView: (id: string) => void
  onShare: (id: string) => void
}

export default function EMRCard({ emr, onView, onShare }: EMRCardProps) {
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

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
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
                <DropdownMenuItem onClick={() => onView(emr.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(emr.id)}>
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
                <span className="font-medium">{emr.sender}</span>
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
                onClick={() => onView(emr.id)}
                className="h-8 px-3 text-xs border-gray-300"
              >
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => onShare(emr.id)}
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
  )
}
