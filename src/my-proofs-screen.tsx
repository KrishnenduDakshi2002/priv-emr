import { useState } from "react"
import { ArrowLeft, Plus, Eye, Share2, X, Shield, CheckCircle, Download, Send, Mail, Clock, Copy, QrCode, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  claims: Array<{
    statement: string
    verified: boolean
  }>
  algorithm: string
  proofSize: string
  issuer: {
    name: string
    hospital: string
    publicKey: string
  }
  technicalDetails: {
    hash: string
    signature: string
    merkleRoot: string
  }
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
      claims: [
        { statement: "COVID-19 test result: Negative", verified: true },
        { statement: "Test performed within last 72 hours", verified: true },
        { statement: "PCR test method used", verified: true }
      ],
      algorithm: "ZK-SNARK",
      proofSize: "24 KB",
      issuer: {
        name: "Dr. Priya Sharma",
        hospital: "Max Healthcare",
        publicKey: "0x1a2b3c4d5e6f7890abcdef..."
      },
      technicalDetails: {
        hash: "0xabc123def456...",
        signature: "0x789xyz012...",
        merkleRoot: "0xdef456abc..."
      }
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
      claims: [
        { statement: "Hepatitis-B vaccination completed", verified: true },
        { statement: "Administered by licensed healthcare provider", verified: true },
        { statement: "Full vaccination series completed", verified: true }
      ],
      algorithm: "ZK-STARK",
      proofSize: "32 KB",
      issuer: {
        name: "Dr. Arvind Kumar",
        hospital: "Apollo Hospital",
        publicKey: "0x2b3c4d5e6f7890abcdef..."
      },
      technicalDetails: {
        hash: "0xbcd234efg567...",
        signature: "0x890abc123...",
        merkleRoot: "0xefg567bcd..."
      }
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
      claims: [
        { statement: "Age greater than 18 years", verified: true },
        { statement: "Identity verified by government document", verified: true }
      ],
      algorithm: "ZK-SNARK",
      proofSize: "18 KB",
      issuer: {
        name: "Government Registry",
        hospital: "Digital Identity Authority",
        publicKey: "0x3c4d5e6f7890abcdef..."
      },
      technicalDetails: {
        hash: "0xcde345fgh678...",
        signature: "0x901bcd234...",
        merkleRoot: "0xfgh678cde..."
      }
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
      claims: [
        { statement: "Treatment received at registered hospital", verified: true },
        { statement: "Discharge completed successfully", verified: true }
      ],
      algorithm: "ZK-SNARK",
      proofSize: "26 KB",
      issuer: {
        name: "Dr. Rajesh Gupta",
        hospital: "AIIMS Delhi",
        publicKey: "0x4d5e6f7890abcdef..."
      },
      technicalDetails: {
        hash: "0xdef456ghi789...",
        signature: "0xa12cde345...",
        merkleRoot: "0xghi789def..."
      }
    },
  ])

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedProof, setSelectedProof] = useState<ZKProof | null>(null)

  // Share form state
  const [shareForm, setShareForm] = useState({
    recipientEmail: "",
    accessExpiry: "",
    purpose: "",
    shareMethod: "email" as "email" | "link" | "qr"
  })
  const [shareErrors, setShareErrors] = useState<Record<string, string>>({})
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")

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
    const proof = proofs.find(p => p.id === proofId)
    if (proof) {
      setSelectedProof(proof)
      setViewModalOpen(true)
    }
  }

  const handleShareProof = (proofId: string) => {
    const proof = proofs.find(p => p.id === proofId)
    if (proof) {
      setSelectedProof(proof)
      setShareModalOpen(true)
    }
  }

  const handleRevokeProof = (proofId: string) => {
    console.log("Revoking proof:", proofId)
    // Implementation for revoking proof
  }

  const handleGenerateProof = () => {
    console.log("Navigate to generate proof flow")
  }

  // Share form validation
  const validateShareForm = () => {
    const newErrors: Record<string, string> = {}

    if (shareForm.shareMethod === "email") {
      if (!shareForm.recipientEmail || !/\S+@\S+\.\S+/.test(shareForm.recipientEmail)) {
        newErrors.recipientEmail = "Please enter a valid email address"
      }
    }

    if (!shareForm.accessExpiry) {
      newErrors.accessExpiry = "Please select access duration"
    }

    setShareErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle share submission
  const handleShareSubmit = async () => {
    if (!validateShareForm()) return

    setIsSharing(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate shareable link
    const link = `https://privemr.app/verify/${selectedProof?.id}?token=${Math.random().toString(36).substring(7)}`
    setGeneratedLink(link)

    setIsSharing(false)
    setShareSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setShareSuccess(false)
      setShareModalOpen(false)
      setShareForm({
        recipientEmail: "",
        accessExpiry: "",
        purpose: "",
        shareMethod: "email"
      })
      setGeneratedLink("")
    }, 3000)
  }

  // Copy link to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
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

      {/* View Proof Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              {selectedProof?.title}
            </DialogTitle>
          </DialogHeader>

                     {selectedProof && (
             <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-2">
              {/* Proof Status */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm font-medium">
                  ✅ Proof Successfully Verified
                </AlertDescription>
              </Alert>

              {/* Proof Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Proof Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Algorithm:</span>
                      <span className="text-gray-900 font-mono">{selectedProof.algorithm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Proof Size:</span>
                      <span className="text-gray-900">{selectedProof.proofSize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">{new Date(selectedProof.createdDate).toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Expires:</span>
                      <span className="text-gray-900">
                        {selectedProof.expiryDate ? new Date(selectedProof.expiryDate).toLocaleDateString("en-IN") : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Share Count:</span>
                      <span className="text-gray-900">{selectedProof.shareCount} times</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verified Claims */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    ✅ Verified Claims
                  </CardTitle>
                  <p className="text-sm text-gray-600">The following statements have been cryptographically proven:</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedProof.claims.map((claim, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{claim.statement}</p>
                        <p className="text-xs text-green-700 mt-1">Cryptographically verified</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Issuer Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    🏥 Issuer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Provider:</span>
                      <span className="text-gray-900 font-medium">{selectedProof.issuer.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Institution:</span>
                      <span className="text-gray-900">{selectedProof.issuer.hospital}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Public Key:</span>
                      <span className="text-gray-900 font-mono text-xs">{selectedProof.issuer.publicKey}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    🔧 Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hash:</span>
                      <span className="text-gray-900 font-mono text-xs">{selectedProof.technicalDetails.hash}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Signature:</span>
                      <span className="text-gray-900 font-mono text-xs">{selectedProof.technicalDetails.signature}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Merkle Root:</span>
                      <span className="text-gray-900 font-mono text-xs">{selectedProof.technicalDetails.merkleRoot}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

                           </div>
           )}
           
           {/* Fixed Action Buttons */}
           {selectedProof && (
             <div className="flex gap-3 pt-4 border-t border-gray-200 flex-shrink-0 mt-4">
               <Button variant="outline" className="flex-1">
                 <Download className="mr-2 h-4 w-4" />
                 Export Proof
               </Button>
               <Button 
                 onClick={() => {
                   setViewModalOpen(false)
                   handleShareProof(selectedProof.id)
                 }}
                 className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
               >
                 <Share2 className="mr-2 h-4 w-4" />
                 Share Proof
               </Button>
             </div>
           )}
         </DialogContent>
       </Dialog>

             {/* Share Proof Modal */}
       <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
         <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
           <DialogHeader className="flex-shrink-0">
             <DialogTitle className="flex items-center gap-2">
               <Share2 className="h-5 w-5 text-blue-600" />
               Share ZK Proof
             </DialogTitle>
           </DialogHeader>

           {selectedProof && (
             <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-2">
              {shareSuccess ? (
                // Success State
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proof Shared Successfully!</h3>
                  <p className="text-gray-600 mb-4">
                    Your zero-knowledge proof has been securely shared
                  </p>
                  
                  {generatedLink && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700 mb-2">Shareable Link:</p>
                      <div className="flex items-center gap-2">
                        <Input value={generatedLink} readOnly className="text-xs" />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(generatedLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      🔒 Recipients can verify your claims without accessing your medical records
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                // Share Form
                <>
                  {/* Proof Summary */}
                  <Card className="border-0 shadow-sm border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedProof.title}</h3>
                          <p className="text-sm text-gray-600">Zero-Knowledge Proof</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Claims:</span>
                          <span className="text-gray-900 font-medium">{selectedProof.claims.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Source:</span>
                          <span className="text-gray-900">{selectedProof.sourceEMR}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Size:</span>
                          <span className="text-gray-900">{selectedProof.proofSize}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-gray-700">What will be shared:</p>
                        {selectedProof.claims.map((claim, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            <span>{claim.statement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Share Method Tabs */}
                  <Tabs value={shareForm.shareMethod} onValueChange={(value) => setShareForm({...shareForm, shareMethod: value as "email" | "link" | "qr"})}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="link" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Link
                      </TabsTrigger>
                      <TabsTrigger value="qr" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        QR Code
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Recipient Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter recipient's email address"
                          value={shareForm.recipientEmail}
                          onChange={(e) => setShareForm({...shareForm, recipientEmail: e.target.value})}
                          className={shareErrors.recipientEmail ? "border-red-300" : ""}
                        />
                        {shareErrors.recipientEmail && (
                          <p className="text-xs text-red-600">{shareErrors.recipientEmail}</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4">
                      <Alert className="border-blue-200 bg-blue-50">
                        <Link className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-sm">
                          Generate a secure link that can be shared via any communication method
                        </AlertDescription>
                      </Alert>
                    </TabsContent>

                    <TabsContent value="qr" className="space-y-4">
                      <Alert className="border-purple-200 bg-purple-50">
                        <QrCode className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-800 text-sm">
                          Generate a QR code for easy scanning and verification
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                  </Tabs>

                  {/* Access Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="access-expiry">Access Duration</Label>
                    <Select value={shareForm.accessExpiry} onValueChange={(value) => setShareForm({...shareForm, accessExpiry: value})}>
                      <SelectTrigger className={shareErrors.accessExpiry ? "border-red-300" : ""}>
                        <SelectValue placeholder="Select access duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-time">One-time verification</SelectItem>
                        <SelectItem value="24-hours">24 hours</SelectItem>
                        <SelectItem value="7-days">7 days</SelectItem>
                        <SelectItem value="30-days">30 days</SelectItem>
                        <SelectItem value="permanent">Permanent access</SelectItem>
                      </SelectContent>
                    </Select>
                    {shareErrors.accessExpiry && (
                      <p className="text-xs text-red-600">{shareErrors.accessExpiry}</p>
                    )}
                  </div>

                  {/* Purpose (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose (Optional)</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Why are you sharing this proof? (e.g., job application, travel requirement)"
                      value={shareForm.purpose}
                      onChange={(e) => setShareForm({...shareForm, purpose: e.target.value})}
                      rows={3}
                    />
                  </div>

                  {/* Privacy Notice */}
                  <Alert className="border-green-200 bg-green-50">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">🔒 Privacy Protected:</p>
                        <p>• Only your selected claims will be verifiable</p>
                        <p>• Your full medical records remain private</p>
                        <p>• Recipients cannot access original documents</p>
                        <p>• You can revoke access anytime</p>
                      </div>
                    </AlertDescription>
                  </Alert>

                                   </>
               )}
             </div>
           )}
           
           {/* Fixed Submit Button */}
           {selectedProof && !shareSuccess && (
             <div className="pt-4 border-t border-gray-200 flex-shrink-0">
               <Button
                 onClick={handleShareSubmit}
                 disabled={isSharing}
                 className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
               >
                 {isSharing ? (
                   <>
                     <Clock className="mr-2 h-4 w-4 animate-spin" />
                     Sharing Proof...
                   </>
                 ) : (
                   <>
                     <Send className="mr-2 h-4 w-4" />
                     Share ZK Proof
                   </>
                 )}
               </Button>
             </div>
           )}
         </DialogContent>
       </Dialog>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
