

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Info, Key, Upload, Check, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MobileRegistrationScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    aadhaar: "",
    abhaId: "",
    email: "",
    phone: "",
    consent: false,
  })

  const [showAadhaar, setShowAadhaar] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasWallet, setHasWallet] = useState(false)
  const [step, setStep] = useState(1)

  const validateAadhaar = (aadhaar: string) => {
    const cleaned = aadhaar.replace(/\s/g, "")
    return /^\d{12}$/.test(cleaned)
  }

  const validateABHA = (abha: string) => {
    return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(abha) || /^\d{14}$/.test(abha)
  }

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/)
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join("-")
    }
    return cleaned
  }

  const maskAadhaar = (aadhaar: string) => {
    if (aadhaar.length > 8) {
      return aadhaar.substring(0, 4) + "-XXXX-" + aadhaar.substring(aadhaar.length - 4)
    }
    return aadhaar
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "aadhaar") {
      value = formatAadhaar(value)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.aadhaar || !validateAadhaar(formData.aadhaar)) {
      newErrors.aadhaar = "Please enter a valid 12-digit Aadhaar number"
    }

    if (!formData.abhaId || !validateABHA(formData.abhaId)) {
      newErrors.abhaId = "Please enter a valid ABHA ID"
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.consent) {
      newErrors.consent = "Please accept the consent to continue"
    }

    if (!hasWallet) {
      newErrors.wallet = "Please generate or import a wallet"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateWallet = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHasWallet(true)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    alert("Registration successful! Redirecting to dashboard...")
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
            <h1 className="text-base font-semibold text-gray-900">Register</h1>
            <p className="text-xs text-gray-500">Step {step} of 2</p>
          </div>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }} />
        </div>
      </div>

      <TooltipProvider>
        <div className="px-3 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                {/* Personal Info Card */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">1</span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`h-12 ${errors.fullName ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      />
                      {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`h-12 ${errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-500">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="h-12 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Medical IDs Card */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Medical Identity</h2>
                    </div>

                    {/* Aadhaar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="aadhaar" className="text-sm font-medium text-gray-700">
                          Aadhaar Number *
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">12-digit unique identity number</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <Input
                          id="aadhaar"
                          type={showAadhaar ? "text" : "password"}
                          placeholder="XXXX-XXXX-XXXX"
                          value={showAadhaar ? formData.aadhaar : maskAadhaar(formData.aadhaar)}
                          onChange={(e) => handleInputChange("aadhaar", e.target.value)}
                          className={`h-12 pr-12 ${errors.aadhaar ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                          maxLength={14}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0"
                          onClick={() => setShowAadhaar(!showAadhaar)}
                        >
                          {showAadhaar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.aadhaar && <p className="text-xs text-red-500">{errors.aadhaar}</p>}
                    </div>

                    {/* ABHA ID */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="abhaId" className="text-sm font-medium text-gray-700">
                          ABHA ID *
                        </Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Format: username@provider</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="abhaId"
                        type="text"
                        placeholder="abha.healthID@ndhm"
                        value={formData.abhaId}
                        onChange={(e) => handleInputChange("abhaId", e.target.value)}
                        className={`h-12 ${errors.abhaId ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      />
                      {errors.abhaId && <p className="text-xs text-red-500">{errors.abhaId}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Continue Button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                    disabled={!formData.fullName || !formData.email || !formData.aadhaar || !formData.abhaId}
                  >
                    Continue to Wallet Setup
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Wallet Setup Card */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Key className="h-4 w-4 text-purple-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Secure Wallet</h2>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Your wallet securely stores medical records and enables encrypted communication with healthcare
                        providers.
                      </p>
                    </div>

                    {!hasWallet ? (
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={generateWallet}
                          disabled={isLoading}
                          className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Key className="mr-2 h-4 w-4" />
                              Generate My Wallet
                            </>
                          )}
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-gray-500">or</span>
                          </div>
                        </div>

                        <Button type="button" variant="outline" className="w-full h-12 border-gray-300 text-gray-700">
                          <Upload className="mr-2 h-4 w-4" />
                          Import Existing Wallet
                        </Button>
                      </div>
                    ) : (
                      <Alert className="border-green-200 bg-green-50">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 text-sm">
                          Wallet generated and secured on your device.
                        </AlertDescription>
                      </Alert>
                    )}

                    {errors.wallet && <p className="text-xs text-red-500">{errors.wallet}</p>}
                  </CardContent>
                </Card>

                {/* Consent Card */}
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
                          I agree to share my Aadhaar and ABHA for medical purposes and verification.
                        </Label>
                        <p className="text-xs text-gray-500 leading-4">
                          Your data will be encrypted and used only for healthcare services as per DPDP Act 2023.
                        </p>
                      </div>
                    </div>
                    {errors.consent && <p className="text-xs text-red-500 mt-2">{errors.consent}</p>}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 border-gray-300 text-gray-600"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !hasWallet || !formData.consent}
                    className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </TooltipProvider>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
