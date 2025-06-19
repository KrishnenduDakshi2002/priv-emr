
import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BellNotificationProps {
  unreadCount?: number
  onClick?: () => void
}

export default function BellNotification({ unreadCount = 0, onClick }: BellNotificationProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    onClick?.()
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`p-2 transition-all duration-150 ${isPressed ? "scale-95 bg-gray-100" : "hover:bg-gray-50"}`}
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? "text-blue-600" : "text-gray-600"}`} />
      </Button>

      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  )
}
