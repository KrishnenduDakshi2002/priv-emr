import { Bell, User, FileText, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "raviger"

interface DoctorDashboardNavigationProps {
  currentPage?: "dashboard" | "requests" | "emrs" | "profile"
}

export default function DoctorDashboardNavigation({ currentPage = "dashboard" }: DoctorDashboardNavigationProps) {
  const navigate = useNavigate()

  const handleNavigate = (page: string) => {
    navigate(page)
  }

  const isActive = (page: string) => currentPage === page

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          <Button 
            variant="ghost" 
            className={`flex-col h-12 ${isActive("dashboard") ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => handleNavigate("/doctor-dashboard")}
          >
            {isActive("dashboard") ? (
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
            ) : (
              <Home className="h-4 w-4 mb-1" />
            )}
            <span className="text-xs">Dashboard</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`flex-col h-12 ${isActive("requests") ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => handleNavigate("/doctor-requests")}
          >
            {isActive("requests") ? (
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
            ) : (
              <Bell className="h-4 w-4 mb-1" />
            )}
            <span className="text-xs">Requests</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`flex-col h-12 ${isActive("emrs") ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => handleNavigate("/doctor-emrs")}
          >
            {isActive("emrs") ? (
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            ) : (
              <FileText className="h-4 w-4 mb-1" />
            )}
            <span className="text-xs">EMRs</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`flex-col h-12 ${isActive("profile") ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => handleNavigate("/profile-settings")}
          >
            {isActive("profile") ? (
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            ) : (
              <User className="h-4 w-4 mb-1" />
            )}
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      {/* Mobile Safe Area */}
      <div className="h-16" />
    </>
  )
}