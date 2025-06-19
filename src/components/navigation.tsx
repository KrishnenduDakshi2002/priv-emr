"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Home, FileText, FolderOpen, LogOut, Stethoscope } from "lucide-react"

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">PrivEMR</h1>
                <p className="text-xs text-gray-500">EMR Platform</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 bg-blue-50 text-blue-700" asChild>
                <a href="/create-emr">
                  <FileText className="h-4 w-4" />
                  Create EMR
                  <Badge variant="secondary" className="ml-1">
                    Active
                  </Badge>
                </a>
              </Button>
              <Button variant="ghost" className="flex items-center gap-2" asChild>
                <a href="/my-emrs">
                  <FolderOpen className="h-4 w-4" />
                  My EMRs
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Verified</span>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
