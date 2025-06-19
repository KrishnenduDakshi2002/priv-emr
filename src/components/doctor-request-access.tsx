

import type React from "react"

import { useState } from "react"
import { ArrowLeft, FileText, Send, Loader2, CheckCircle, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DoctorRequestAccess() {
  const [formData, setFormData] = useState({
    patientIdentifier: "",
    purpose: "",
    accessDuration: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [patientFound, setPatientFound] = useState<{
    name: string
    email: string
    abhaId: string
  } | null>(null)

  const accessDurationOptions = [
    { value: "1-time", label: "One-time access" },
    { value: "24-hours", label: "24 hours" },
    { value: "7-days", label: "7 days" },
    { value: "30-days", label: "30 days" },
    { value: "permanent", label: "Permanent access" },
  ]

  const handlePatientSearch = async () => {
    if (!formData.patientIdentifier) return

    setIsLoading(true)
    // Simulate patient lookup
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock patient data
    setPatientFound({
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      abhaId: "priya.health@ndhm",
    })
    setIsLoading(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientIdentifier) {
      newErrors.patientIdentifier = "Please enter patient email or ABHA ID"
    }

    if (!patientFound) {
      newErrors.patientIdentifier = "Please search and verify patient first"
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Please specify the purpose of access"
    }

    if (!formData.accessDuration) {
      newErrors.accessDuration = "Please select access duration"
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
        patientIdentifier: "",
        purpose: "",
        accessDuration: "",
      })
      setPatientFound(null)
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Sent!</h2>
            <p className="text-gray-600 mb-4">
              Access request has been sent to {patientFound?.name}. You'll be notified once they respond.
            </p>
            <Button onClick={() => setIsSuccess(false)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Send Another Request
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
            <h1 className="text-base font-semibold text-gray-900">📤 Request EMR Access</h1>
            <p className="text-xs text-gray-500">Request patient records</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-3 py-4 space-y-4">
        {/* Patient Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Find Patient</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="patientIdentifier" className="text-sm font-medium text-gray-700">
                  Patient Email or ABHA ID *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="patientIdentifier"
                    type="text"
                    placeholder="patient@email.com or abha.id@ndhm"
                    value={formData.patientIdentifier}
                    onChange={(e) => setFormData((prev) => ({ ...prev, patientIdentifier: e.target.value }))}
                    className={`h-12 flex-1 ${errors.patientIdentifier ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  />
                  <Button
                    type="button"
                    onClick={handlePatientSearch}
                    disabled={!formData.patientIdentifier || isLoading}
                    className="h-12 px-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.patientIdentifier && <p className="text-xs text-red-500">{errors.patientIdentifier}</p>}
              </div>

              {/* Patient Found */}
              {patientFound && (
                <Alert className="border-green-200 bg-green-50">
                  <User className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="space-y-1">
                      <p className="font-medium">{patientFound.name}</p>
                      <p className="text-sm">{patientFound.email}</p>
                      <p className="text-sm">ABHA: {patientFound.abhaId}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Access Details</h2>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
                Purpose of Access *
              </Label>
              <Textarea
                id="purpose"
                placeholder="e.g., Follow-up consultation, Second opinion, Treatment planning..."
                value={formData.purpose}
                onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                className={`min-h-[80px] ${errors.purpose ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
              />
              {errors.purpose && <p className="text-xs text-red-500">{errors.purpose}</p>}
            </div>

            {/* Access Duration */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Access Duration *</Label>
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
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Doctor:</span>
                <span className="text-gray-900 font-medium">Dr. Arvind Kumar</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Specialization:</span>
                <span className="text-gray-900">Cardiologist</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hospital:</span>
                <span className="text-gray-900">Apollo Hospital</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">License:</span>
                <span className="text-gray-900">MCI-12345</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading || !patientFound}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Access Request
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
