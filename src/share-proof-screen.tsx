

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Send, Loader2, CheckCircle, Shield, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ZKProof {
  id: string
  title: string
  claims: string[]
  sourceEMR: string
  createdDate: string
  proofSize: string
}

export default function ShareProofScreen() {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    accessExpiry: "",
    purpose: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Mock proof data (would come from props/navigation)
  const [proof] = useState<ZKProof>({
    id: "proof-123",
    title: "COVID-19 Negative",
    claims: ["COVID-19 test result: Negative", "Tested within last 72 hours"],
    sourceEMR: "Lab Report – Feb 2025",
    createdDate: "2025-03-10",
    proofSize: "24 KB",
  })

  const accessExpiryOptions = [
    { value: "1-time", label: "One-time verification" },
    { value: "24-hours", label: "24 hours" },
    { value: "7-days", label: "7 days" },
    { value: "30-days", label: "30 days" },
    { value: "permanent", label: "Permanent access" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.recipientEmail || !/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = "Please enter a valid email address"
    }

    if (!formData.accessExpiry) {
      newErrors.accessExpiry = "Please select access duration"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        recipientEmail: "",
        accessExpiry: "",
        purpose: "",
      })
    }, 3000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Proof Shared!</h2>
            <p className="text-gray-600 mb-4">
              Your zero-knowledge proof has been securely shared with {formData.recipientEmail}
            </p>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                🔒 They can verify your claims without accessing your medical records
              </p>
            </div>
            <Button onClick={() => setIsSuccess(false)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Share Another Proof
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-base font-semibold text-gray-900">📤 Share ZK Proof</h1>
            <p className="text-xs text-gray-500">Privacy-preserving sharing</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-3 py-4 space-y-4">
        {/* Proof Summary */}
        <Card className="border-0 shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{proof.title}</h3>
                <p className="text-sm text-gray-600">Zero-Knowledge Proof</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Claims:</span>
                <span className="text-gray-900 font-medium">{proof.claims.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Source:</span>
                <span className="text-gray-900">{proof.sourceEMR}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size:</span>
                <span className="text-gray-900">{proof.proofSize}</span>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs font-medium text-gray-700">What will be shared:</p>
              {proof.claims.map((claim, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>{claim}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recipient Details */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recipient Details</h2>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="recipientEmail" className="text-sm font-medium text-gray-700">
                Recipient Email Address *
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@example.com"
                value={formData.recipientEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, recipientEmail: e.target.value }))}
                className={`h-12 ${errors.recipientEmail ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
              />
              {errors.recipientEmail && <p className="text-xs text-red-500">{errors.recipientEmail}</p>}
              <p className="text-xs text-gray-500">They'll receive a secure link to verify your proof</p>
            </div>
          </CardContent>
        </Card>

        {/* Access Settings */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Access Settings</h2>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Access Duration *</Label>
              <Select
                value={formData.accessExpiry}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, accessExpiry: value }))}
              >
                <SelectTrigger className={`h-12 ${errors.accessExpiry ? "border-red-500" : "border-gray-300"}`}>
                  <SelectValue placeholder="Select access duration" />
                </SelectTrigger>
                <SelectContent>
                  {accessExpiryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accessExpiry && <p className="text-xs text-red-500">{errors.accessExpiry}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-500">
                Purpose (Optional)
              </Label>
              <Textarea
                id="purpose"
                placeholder="e.g., For employment verification, Insurance claim, Travel requirements..."
                value={formData.purpose}
                onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                className="min-h-[80px] border-gray-300 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">
            <div className="space-y-1">
              <p className="font-medium">🔒 Privacy Protected:</p>
              <p>• Only your selected claims will be verifiable</p>
              <p>• Your full medical records remain private</p>
              <p>• Recipient cannot access original documents</p>
              <p>• You can revoke access anytime</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </form>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
