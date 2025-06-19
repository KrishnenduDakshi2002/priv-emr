
import { useState } from "react"
import { ArrowLeft, Plus, Eye, Share2, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import BellNotification from "./bell-notification-component"

interface ZKProof {
  id: string
  title: string
  claim: string
  sourceEMR: string
  createdDate: string
  expiryDate: string | null
  status: "active" | "expired" | "revoked"
  shareCount: number
  proofType: "covid" | "vaccination" | "age" | "hospital" | "general"
}

export default function MyProofsScreen() {
  const [proofs] = useState<ZKProof[]>([
    {
      id: "1",
      title: "COVID-19 Negative",
      claim: "COVID-19 test result: Negative",
      sourceEMR: "Lab Report – Feb 2025",
      createdDate: "2025-03-10T10:30:00Z",
      expiryDate: "2025-04-10T10:30:00Z",
      status: "active",
      shareCount: 3,
      proofType: "covid",
    },
    {
      id: "2",
      title: "Hepatitis-B Vaccinated",
      claim: "Vaccinated for Hepatitis-B",
      sourceEMR: "Vaccination Record – Jan 2025",
      createdDate: "2025-03-08T14:20:00Z",
      expiryDate: null,
      status: "active",
      shareCount: 1,
      proofType: "vaccination",
    },
    {
      id: "3",
      title: "Age Verification",
      claim: "Age > 18 years",
      sourceEMR: "Identity Document",
      createdDate: "2025-03-05T09:15:00Z",
      expiryDate: "2025-09-05T09:15:00Z",
      status: "active",
      shareCount: 2,
      proofType: "age",
    },
    {
      id: "4",
      title: "Hospital Verification",
      claim: "Treated at Registered Hospital",
      sourceEMR: "Discharge Summary – Dec 2024",
      createdDate: "2025-02-28T16:45:00Z",
      expiryDate: "2025-03-15T16:45:00Z",
      status: "expired",
      shareCount: 0,
      proofType: "hospital",
    },
  ])

  const getProofIcon = (type: string) => {
    switch (type) {
      case "covid":
        return "🦠"
      case "vaccination":
        return "💉"
      case "age":
        return "🆔"
      case "hospital":
        return "🏥"
      default:
        return "🧾"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "expired":
        return "bg-red-100 text-red-700"
      case "revoked":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const getExpiryText = (expiryDate: string | null, status: string) => {
    if (status === "revoked") return "Revoked"
    if (status === "expired") return "Expired"
    if (!expiryDate) return "Never expires"

    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays <= 0) return "Expires today"
    if (diffInDays === 1) return "Expires tomorrow"
    if (diffInDays <= 7) return `${diffInDays} days left`
    return `${Math.ceil(diffInDays / 30)} months left`
  }

  const handleViewProof = (proofId: string) => {
    console.log("Viewing proof:", proofId)
  }

  const handleShareProof = (proofId: string) => {
    console.log("Sharing proof:", proofId)
  }

  const handleRevokeProof = (proofId: string) => {
    console.log("Revoking proof:", proofId)
  }

  const handleGenerateProof = () => {
    console.log("Navigate to generate proof flow")
  }

  const activeProofs = proofs.filter((proof) => proof.status === "active")
  const inactiveProofs = proofs.filter((proof) => proof.status !== "active")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">🧾 My Proofs</h1>
            <p className="text-xs text-gray-500">{activeProofs.length} active</p>
          </div>
          <BellNotification unreadCount={2} />
        </div>
      </div>

      <div className="px-3 py-4 space-y-4">
        {/* Privacy Notice */}
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">
            🟢 Privacy Protected: Your proofs share only specific facts, never your full medical records.
          </AlertDescription>
        </Alert>

        {/* Generate New Proof */}
        <Card className="border-0 shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Generate New Proof</h3>
                  <p className="text-sm text-gray-600">Prove facts without sharing full records</p>
                </div>
              </div>
              <Button onClick={handleGenerateProof} className="bg-blue-500 hover:bg-blue-600 text-white">
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Proofs */}
        {activeProofs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ✅ Active Proofs
              <Badge variant="default" className="bg-green-100 text-green-700">
                {activeProofs.length}
              </Badge>
            </h2>

            {activeProofs.map((proof) => (
              <Card key={proof.id} className="border-0 shadow-sm border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Proof Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getProofIcon(proof.proofType)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{proof.title}</h3>
                          <p className="text-xs text-gray-600">{proof.claim}</p>
                        </div>
                      </div>
                      <Badge variant="default" className={getStatusColor(proof.status)}>
                        {proof.status === "active" ? "Active" : proof.status}
                      </Badge>
                    </div>

                    {/* Proof Details */}
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Source:</span>
                        <span className="text-gray-900 font-medium">{proof.sourceEMR}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-900">{new Date(proof.createdDate).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Expires:</span>
                        <span className="text-gray-900">{getExpiryText(proof.expiryDate, proof.status)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Shared:</span>
                        <span className="text-gray-900">{proof.shareCount} times</span>
                      </div>
                    </div>

                    {/* ZK Tech Info */}
                    <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 p-2 rounded">
                      <Shield className="h-3 w-3" />
                      <span>Zero-Knowledge Proof • Privacy Preserved</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewProof(proof.id)}
                        className="flex-1 border-gray-300 text-gray-600"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleShareProof(proof.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeProof(proof.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Inactive Proofs */}
        {inactiveProofs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ⏰ Inactive Proofs
              <Badge variant="destructive" className="bg-red-100 text-red-700">
                {inactiveProofs.length}
              </Badge>
            </h2>

            {inactiveProofs.map((proof) => (
              <Card key={proof.id} className="border-0 shadow-sm border-l-4 border-l-red-500 opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{getProofIcon(proof.proofType)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{proof.title}</h4>
                        <p className="text-xs text-gray-600">{proof.sourceEMR}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className={getStatusColor(proof.status)}>
                        {proof.status === "expired" ? "Expired" : "Revoked"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(proof.createdDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {proofs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Proofs Yet</h3>
            <p className="text-gray-500 text-sm mb-4">Create privacy-preserving proofs from your medical records</p>
            <Button onClick={handleGenerateProof} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Generate First Proof
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
