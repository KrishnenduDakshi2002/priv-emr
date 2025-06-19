

import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import BellNotification from "./bell-notification-component"

export default function UpdatedMyEMRsHeader() {
  const handleNotificationClick = () => {
    // Navigate to activity log screen
    console.log("Opening activity log...")
  }

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 h-14">
        <Button variant="ghost" size="sm" className="text-gray-600 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">📄 My EMRs</h1>
          <p className="text-xs text-gray-500">4 records</p>
        </div>
        <div className="flex items-center gap-1">
          <BellNotification unreadCount={3} onClick={handleNotificationClick} />
          <Button variant="ghost" size="sm" className="text-blue-600 p-2">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
