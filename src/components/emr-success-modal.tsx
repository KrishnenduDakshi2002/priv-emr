
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, Copy, ArrowLeft, Hash, Key, Mail, Calendar, FileText, Shield } from "lucide-react"

interface EMRSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  emrData: {
    id: string
    patientEmail: string
    aadhaarNumber: string
    abhaId: string
    title: string
    hash: string
    signature: string
    timestamp: string
  }
}

export function EMRSuccessModal({ isOpen, onClose, emrData }: EMRSuccessModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast({
        title: "Copied to clipboard",
        description: `${fieldName} has been copied to your clipboard.`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            EMR Created Successfully
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
              ✅ Successfully Processed
            </Badge>
            <p className="text-sm text-green-700">Your EMR has been encrypted, digitally signed, and securely stored</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  EMR Reference ID
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm font-mono">{emrData.id}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(emrData.id, "EMR ID")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4" />
                  Patient Email
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm">{emrData.patientEmail}</code>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Key className="h-4 w-4" />
                  Aadhaar Number
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono">{emrData.aadhaarNumber}</code>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Shield className="h-4 w-4" />
                  ABHA ID
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono">{emrData.abhaId}</code>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                EMR Title
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{emrData.title}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Cryptographic Details</h4>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Hash className="h-4 w-4" />
                  Encrypted Hash
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-gray-600">{emrData.hash}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(emrData.hash, "Hash")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Key className="h-4 w-4" />
                  Digital Signature
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-gray-600">{emrData.signature}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(emrData.signature, "Signature")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Timestamp
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{formatTimestamp(emrData.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => copyToClipboard(emrData.id, "EMR ID")} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              {copiedField === "EMR ID" ? "Copied!" : "Copy EMR ID"}
            </Button>
            <Button onClick={onClose} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}