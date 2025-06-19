
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Upload, FileText, Shield, Hash, CheckCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { EMRSuccessModal } from "@/components/emr-success-modal"

interface EMRData {
  patientEmail: string
  aadhaarNumber: string
  abhaId: string
  title: string
  details: string
  file?: File
}

interface ProcessingStep {
  id: string
  label: string
  status: "pending" | "processing" | "completed" | "error"
}

export default function CreateEMRPage() {
  const [formData, setFormData] = useState<EMRData>({
    patientEmail: "",
    aadhaarNumber: "",
    abhaId: "",
    title: "",
    details: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "fetch-key", label: "Fetching patient public key", status: "pending" },
    { id: "encrypt", label: "Encrypting EMR data", status: "pending" },
    { id: "hash", label: "Generating hash", status: "pending" },
    { id: "sign", label: "Digital signing", status: "pending" },
    { id: "store", label: "Storing EMR", status: "pending" },
    { id: "blockchain", label: "Recording on-chain", status: "pending" },
  ])
  const [emrResult, setEmrResult] = useState<{
    id: string
    hash: string
    signature: string
    timestamp: string
  } | null>(null)

  const handleInputChange = (field: keyof EMRData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
      toast({
        title: "File uploaded",
        description: `${file.name} has been selected for upload.`,
      })
    }
  }

  const updateStepStatus = (stepId: string, status: ProcessingStep["status"]) => {
    setProcessingSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)))
  }

  const simulateProcessingStep = (stepId: string, delay: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      updateStepStatus(stepId, "processing")

      setTimeout(() => {
        // Simulate occasional errors for demonstration
        if (Math.random() < 0.05) {
          updateStepStatus(stepId, "error")
          reject(new Error(`Failed at step: ${stepId}`))
        } else {
          updateStepStatus(stepId, "completed")
          resolve()
        }
      }, delay)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.patientEmail ||
      !formData.aadhaarNumber ||
      !formData.abhaId ||
      !formData.title ||
      (!formData.details && !formData.file)
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields including Aadhaar and ABHA ID.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate cryptographic processing steps
      await simulateProcessingStep("fetch-key", 1500)
      await simulateProcessingStep("encrypt", 2000)
      await simulateProcessingStep("hash", 1000)
      await simulateProcessingStep("sign", 1500)
      await simulateProcessingStep("store", 2000)
      await simulateProcessingStep("blockchain", 2500)

      // Generate mock result
      const result = {
        id: `EMR-${Date.now().toString(36).toUpperCase()}`,
        hash: `0x${Math.random().toString(16).substring(2, 18)}...${Math.random().toString(16).substring(2, 8)}`,
        signature: `0x${Math.random().toString(16).substring(2, 18)}...${Math.random().toString(16).substring(2, 8)}`,
        timestamp: new Date().toISOString(),
      }

      setEmrResult(result)
      setShowSuccessModal(true)

      toast({
        title: "EMR created successfully",
        description: "Your EMR has been encrypted, signed, and stored securely.",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your EMR. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setFormData({ patientEmail: "", aadhaarNumber: "", abhaId: "", title: "", details: "" })
    setProcessingSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })))
    setEmrResult(null)
  }

  const getStepIcon = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case "error":
        return <div className="h-4 w-4 bg-red-600 rounded-full" />
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Create & Upload EMR</h1>
            </div>
            <p className="text-gray-600">Securely create, encrypt, and digitally sign electronic medical records</p>
          </div>

          {!isProcessing ? (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  EMR Creation Form
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Fill in the patient details and EMR information below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail" className="text-sm font-medium">
                      Patient Email *
                    </Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      placeholder="patient@example.com"
                      value={formData.patientEmail}
                      onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                      className="h-11"
                      required
                    />
                    <p className="text-xs text-gray-500">Used to fetch patient's public key for encryption</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaarNumber" className="text-sm font-medium">
                      Aadhaar Number *
                    </Label>
                    <Input
                      id="aadhaarNumber"
                      type="text"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                      className="h-11"
                      maxLength={12}
                      required
                    />
                    <p className="text-xs text-gray-500">12-digit Aadhaar identification number</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abhaId" className="text-sm font-medium">
                      ABHA ID *
                    </Label>
                    <Input
                      id="abhaId"
                      type="text"
                      placeholder="12-3456-7890-1234"
                      value={formData.abhaId}
                      onChange={(e) => handleInputChange("abhaId", e.target.value)}
                      className="h-11"
                      required
                    />
                    <p className="text-xs text-gray-500">Ayushman Bharat Health Account ID</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      EMR Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Blood Report, Visit Notes, X-Ray Results, etc."
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">EMR Details *</Label>
                    <Tabs defaultValue="text" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Text Entry
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          File Upload
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text" className="mt-4">
                        <Textarea
                          placeholder="Enter detailed medical information, observations, test results, treatment notes, etc."
                          value={formData.details}
                          onChange={(e) => handleInputChange("details", e.target.value)}
                          className="min-h-[200px] resize-none"
                        />
                      </TabsContent>

                      <TabsContent value="upload" className="mt-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Upload EMR Document</p>
                            <p className="text-xs text-gray-500">PDF, DOCX files supported</p>
                            <Input
                              type="file"
                              accept=".pdf,.docx,.doc"
                              onChange={handleFileUpload}
                              className="max-w-xs mx-auto"
                            />
                          </div>
                          {formData.file && (
                            <Badge variant="secondary" className="mt-4">
                              {formData.file.name}
                            </Badge>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Encrypt & Sign EMR
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} className="px-8 h-12">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Processing EMR
                </CardTitle>
                <CardDescription className="text-blue-100">Encrypting and signing your EMR securely</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    {processingSteps.map((step) => (
                      <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                        {getStepIcon(step.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.label}</p>
                        </div>
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : step.status === "processing"
                                ? "secondary"
                                : step.status === "error"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>
                        {processingSteps.filter((s) => s.status === "completed").length}/{processingSteps.length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (processingSteps.filter((s) => s.status === "completed").length / processingSteps.length) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {emrResult && (
        <EMRSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          emrData={{
            id: emrResult.id,
            patientEmail: formData.patientEmail,
            title: formData.title,
            hash: emrResult.hash,
            signature: emrResult.signature,
            timestamp: emrResult.timestamp,
            aadhaarNumber: formData.aadhaarNumber,
            abhaId: formData.abhaId,
          }}
        />
      )}
    </div>
  )
}
