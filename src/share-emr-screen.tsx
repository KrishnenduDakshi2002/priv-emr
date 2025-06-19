

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, Clock, FileText, Shield, Send, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EMR {
  id: string
  title: string
  type: string
  dateReceived: string
}

export default function ShareEMRScreen() {
  const [formData, setFormData] = useState({
    doctorEmail: "",
    selectedEMRs: [] as string[],
    accessDuration: "",
    purpose: "",
    consent: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Mock EMR data
  const [availableEMRs] = useState<EMR[]>([
    {
      id: "1",
      title: "Blood Test Report - Apr 2025",
      type: "lab",
      dateReceived: "2025-04-10",
    },
    {
      id: "2",
      title: "X-Ray Chest - Mar 2025",
      type: "imaging",
      dateReceived: "2025-03-28",
    },
    {
      id: "3",
      title: "ECG Report - Feb 2025",
      type: "diagnostic",
      dateReceived: "2025-02-20",
    },
    {
      id: "4",
      title: "Prescription - Mar 2025",
      type: "prescription",
      dateReceived: "2025-03-15",
    },
  ])

  const accessDurationOptions = [
    { value: "1-time", label: "One-time view" },
    { value: "7-days", label: "7 days" },
    { value: "30-days", label: "30 days" },
    { value: "permanent", label: "Permanent access" },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return "🧪"
      case "imaging":
        return "📸"
      case "prescription":
        return "💊"
      case "diagnostic":
        return "📊"
      default:
        return "📄"
    }
  }

  const handleEMRSelection = (emrId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedEMRs: checked ? [...prev.selectedEMRs, emrId] : prev.selectedEMRs.filter((id) => id !== emrId),
    }))

    if (errors.selectedEMRs) {
      setErrors((prev) => ({ ...prev, selectedEMRs: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.doctorEmail || !/\S+@\S+\.\S+/.test(formData.doctorEmail)) {
      newErrors.doctorEmail = "Please enter a valid doctor email"
    }

    if (formData.selectedEMRs.length === 0) {
      newErrors.selectedEMRs = "Please select at least one EMR to share"
    }

    if (!formData.accessDuration) {
      newErrors.accessDuration = "Please select access duration"
    }

    if (!formData.consent) {
      newErrors.consent = "Please provide consent to share EMRs"
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
        doctorEmail: "",
        selectedEMRs: [],
        accessDuration: "",
        purpose: "",
        consent: false,
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Granted!</h2>
            <p className="text-gray-600 mb-4">EMR access has been successfully shared with {formData.doctorEmail}</p>
            <Button onClick={() => setIsSuccess(false)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Share More EMRs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">📤 Share EMR Access</h1>
            <p className="text-xs text-gray-500">Grant doctor access</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-3 py-4 space-y-4">
        {/* Doctor Email */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Doctor Details</h2>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="doctorEmail" className="text-sm font-medium text-gray-700">
                Doctor Email Address *
              </Label>
              <Input
                id="doctorEmail"
                type="email"
                placeholder="doctor@hospital.com"
                value={formData.doctorEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, doctorEmail: e.target.value }))}
                className={`h-12 ${errors.doctorEmail ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
              />
              {errors.doctorEmail && <p className="text-xs text-red-500">{errors.doctorEmail}</p>}
              <p className="text-xs text-gray-500">We'll verify the doctor's identity before granting access</p>
            </div>
          </CardContent>
        </Card>

        {/* Select EMRs */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Select EMRs to Share</h2>
            </div>

            <div className="space-y-2">
              {availableEMRs.map((emr) => (
                <div key={emr.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id={`emr-${emr.id}`}
                    checked={formData.selectedEMRs.includes(emr.id)}
                    onCheckedChange={(checked: boolean) => handleEMRSelection(emr.id, checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={`emr-${emr.id}`} className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getTypeIcon(emr.type)}</span>
                        <span className="text-sm font-medium text-gray-900">{emr.title}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Received: {new Date(emr.dateReceived).toLocaleDateString("en-IN")}
                      </p>
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            {errors.selectedEMRs && <p className="text-xs text-red-500">{errors.selectedEMRs}</p>}
          </CardContent>
        </Card>

        {/* Access Duration */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Access Duration</h2>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">How long should the doctor have access? *</Label>
              <Select
                value={formData.accessDuration}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, accessDuration: value }))}
              >
                <SelectTrigger className={`h-12 ${errors.accessDuration ? "border-red-500" : "border-gray-300"}`}>
                  <SelectValue placeholder="Select access duration" />
                </SelectTrigger>
                <SelectContent>
                  {accessDurationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accessDuration && <p className="text-xs text-red-500">{errors.accessDuration}</p>}
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-500">
                Purpose of Access (Optional)
              </Label>
              <Textarea
                id="purpose"
                placeholder="e.g., Follow-up consultation, Second opinion..."
                value={formData.purpose}
                onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                className="min-h-[80px] border-gray-300 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consent */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, consent: checked as boolean }))}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="consent" className="text-sm font-medium text-gray-700 cursor-pointer leading-5">
                  I consent to share the selected EMRs with the specified doctor for the stated purpose.
                </Label>
                <p className="text-xs text-gray-500 leading-4">
                  The doctor will be able to view and download the shared records during the access period.
                </p>
              </div>
            </div>
            {errors.consent && <p className="text-xs text-red-500 mt-2">{errors.consent}</p>}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            All EMRs are encrypted and can only be accessed by verified healthcare providers. You can revoke access at
            any time from your dashboard.
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
                Granting Access...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Grant Access
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
