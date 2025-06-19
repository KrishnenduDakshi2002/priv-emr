

import { useState } from "react"
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SharedProof {
  id: string
  title: string
  claims: Array<{
    statement: string
    verified: boolean
  }>
  issuer: {
    name: string
    hospital: string
    publicKey: string
  }
  issuedDate: string
  expiryDate: string | null
  algorithm: string
  proofSize: string
  isExpired: boolean
  verificationStatus: "verified" | "failed" | "pending"
}

export default function ViewProofPublic() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)

  // Mock shared proof data
  const [proof] = useState<SharedProof>({
    id: "proof-public-123",
    title: "Hepatitis-B Vaccination Status",
    claims: [
      {
        statement: "Vaccinated for Hepatitis-B",
        verified: true,
      },
      {
        statement: "Vaccination administered by licensed provider",
        verified: true,
      },
    ],
    issuer: {
      name: "Dr. Arvind Kumar",
      hospital: "Apollo Hospital",
      publicKey: "0x1a2b3c4d5e6f...",
    },
    issuedDate: "2025-03-21T10:30:00Z",
    expiryDate: null,
    algorithm: "ZK-SNARK",
    proofSize: "28 KB",
    isExpired: false,
    verificationStatus: "verified",
  })

  const handleVerifyProof = async () => {
    setIsVerifying(true)
    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsVerifying(false)
    setVerificationComplete(true)
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "border-green-200 bg-green-50"
      case "failed":
        return "border-red-200 bg-red-50"
      case "pending":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">🧾 Verify Proof</h1>
            <p className="text-xs text-gray-500">Zero-Knowledge Verification</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-3 py-4 space-y-4">
        {/* Proof Header */}
        <Card
          className={`border-0 shadow-sm border-l-4 ${proof.isExpired ? "border-l-red-500" : "border-l-green-500"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{proof.title}</h2>
                  <p className="text-sm text-gray-600">Zero-Knowledge Proof</p>
                </div>
              </div>
              <Badge
                variant={proof.isExpired ? "destructive" : "default"}
                className={proof.isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
              >
                {proof.isExpired ? "Expired" : "Valid"}
              </Badge>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Issued:</span>
                <span className="text-gray-900">{new Date(proof.issuedDate).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires:</span>
                <span className="text-gray-900">
                  {proof.expiryDate ? new Date(proof.expiryDate).toLocaleDateString("en-IN") : "Never"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Algorithm:</span>
                <span className="text-gray-900 font-mono">{proof.algorithm}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size:</span>
                <span className="text-gray-900">{proof.proofSize}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Alert className={getVerificationColor(proof.verificationStatus)}>
          <div className="flex items-center gap-2">
            {getVerificationIcon(proof.verificationStatus)}
            <AlertDescription className="text-sm font-medium">
              {proof.verificationStatus === "verified" && "✅ Proof Successfully Verified"}
              {proof.verificationStatus === "failed" && "❌ Proof Verification Failed"}
              {proof.verificationStatus === "pending" && "⏳ Verification Pending"}
            </AlertDescription>
          </div>
        </Alert>

        {/* Verified Claims */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">✅ Verified Claims</CardTitle>
            <p className="text-sm text-gray-600">The following statements have been cryptographically proven:</p>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {proof.claims.map((claim, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  {claim.verified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{claim.statement}</p>
                  <p className="text-xs text-green-700 mt-1">
                    {claim.verified ? "Cryptographically verified" : "Verification failed"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Issuer Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">🏥 Issuer Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Doctor:</span>
                <span className="text-gray-900 font-medium">{proof.issuer.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hospital:</span>
                <span className="text-gray-900">{proof.issuer.hospital}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Public Key:</span>
                <span className="text-gray-900 font-mono text-xs">{proof.issuer.publicKey}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <div className="space-y-1">
              <p className="font-medium">🔒 Privacy Preserved:</p>
              <p>• No access to original medical documents</p>
              <p>• Only verified claims are visible</p>
              <p>• Patient's full medical history remains private</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Verification Actions */}
        <div className="space-y-3">
          {!verificationComplete && (
            <Button
              onClick={handleVerifyProof}
              disabled={isVerifying || proof.isExpired}
              className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isVerifying ? (
                <>
                  <Shield className="mr-2 h-4 w-4 animate-pulse" />
                  Verifying Proof...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Run Verification
                </>
              )}
            </Button>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-gray-300 text-gray-600">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50">
              <Shield className="mr-2 h-4 w-4" />
              Technical Details
            </Button>
          </div>
        </div>

        {/* Expired Notice */}
        {proof.isExpired && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              This proof has expired and is no longer valid for verification.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
