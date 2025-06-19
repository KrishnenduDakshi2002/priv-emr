import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'raviger'
import { 
  FileText, 
  Shield, 
  Stethoscope, 
  TestTube, 
  UserCog,
  ArrowRight 
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  const quickActions = [
    {
      title: "User Portal",
      description: "Manage your medical records and proofs",
      icon: FileText,
      href: "/user",
      color: "bg-blue-500"
    },
    {
      title: "Doctor Portal", 
      description: "Access patient records and manage requests",
      icon: Stethoscope,
      href: "/doctor",
      color: "bg-green-500"
    },
    {
      title: "Lab Portal",
      description: "Upload and manage lab results",
      icon: TestTube,
      href: "/lab", 
      color: "bg-purple-500"
    },
    {
      title: "Admin Panel",
      description: "System administration and management",
      icon: UserCog,
      href: "/admin",
      color: "bg-red-500"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">PrivEMR</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Secure, privacy-preserving electronic medical records with zero-knowledge proofs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(action.href)}>
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between p-0">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Secure EMRs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Store and manage electronic medical records with end-to-end encryption and user-controlled access.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Zero-Knowledge Proofs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Generate cryptographic proofs about your medical data without revealing the underlying information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              <span>Healthcare Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Seamless integration with healthcare providers, labs, and medical professionals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 