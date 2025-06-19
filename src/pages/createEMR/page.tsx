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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { Upload, FileText, Shield, Hash, CheckCircle, Plus, X, AlertCircle, Loader2 } from "lucide-react"
import { CreateEMRFormData, EMRProcessingStatus, EMRType, EMRPriority } from "@/types/emr"
import { ProcessingSimulator, FileProcessor } from "@/lib/emr-utils"
import { useNavigate } from "raviger"

const EMR_TYPES: { value: EMRType; label: string }[] = [
  { value: "lab", label: "Laboratory Report" },
  { value: "imaging", label: "Medical Imaging" },
  { value: "diagnostic", label: "Diagnostic Test" },
  { value: "prescription", label: "Prescription" },
  { value: "vaccination", label: "Vaccination Record" },
  { value: "consultation", label: "Consultation Notes" },
  { value: "surgery", label: "Surgery Report" },
  { value: "other", label: "Other" }
]

const PRIORITIES: { value: EMRPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
  { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-700" }
]

export default function CreateEMRPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CreateEMRFormData>({
    patientEmail: "",
    aadhaarNumber: "",
    abhaId: "",
    patientName: "",
    title: "",
    description: "",
    type: "lab",
    subType: "",
    priority: "medium",
    tags: [],
    textData: "",
    providerName: "Lab Technician",
    hospitalName: "PrivEMR Lab",
    licenseNumber: ""
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<EMRProcessingStatus | null>(null)
  const [currentTag, setCurrentTag] = useState("")
  const [fileValidation, setFileValidation] = useState<{ valid: boolean; error?: string } | null>(null)

  const handleInputChange = (field: keyof CreateEMRFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validation = FileProcessor.validateFile(file)
      setFileValidation(validation)
      
      if (validation.valid) {
        setFormData(prev => ({ ...prev, file }))
        toast({
          title: "File uploaded",
          description: `${file.name} (${FileProcessor.formatFileSize(file.size)}) has been selected.`,
        })
      } else {
        toast({
          title: "File validation failed",
          description: validation.error,
          variant: "destructive",
        })
      }
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = (): boolean => {
    const required = [
      'patientEmail',
      'aadhaarNumber', 
      'abhaId',
      'title',
      'description',
      'providerName',
      'hospitalName'
    ] as const

    for (const field of required) {
      if (!formData[field]?.trim()) {
        toast({
          title: "Missing required field",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive",
        })
        return false
      }
    }

    if (!formData.textData?.trim() && !formData.file) {
      toast({
        title: "Missing EMR content",
        description: "Please provide either text data or upload a file.",
        variant: "destructive",
      })
      return false
    }

    if (formData.file && fileValidation && !fileValidation.valid) {
      toast({
        title: "Invalid file",
        description: fileValidation.error,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    setProcessingStatus(null)

    try {
      const emrRecord = await ProcessingSimulator.simulateEMRProcessing(
        formData,
        (status) => setProcessingStatus(status)
      )

      toast({
        title: "EMR created successfully",
        description: `EMR ${emrRecord.id} has been encrypted, signed, and stored securely.`,
      })

      // Add a success state to show navigation options
      setProcessingStatus({
        step: 'completed',
        status: 'completed',
        progress: 100,
        message: `EMR ${emrRecord.id} created successfully! Click below to view your EMRs.`
      })

    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your EMR. Please try again.",
        variant: "destructive",
      })
      setProcessingStatus(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      patientEmail: "",
      aadhaarNumber: "",
      abhaId: "",
      patientName: "",
      title: "",
      description: "",
      type: "lab",
      subType: "",
      priority: "medium",
      tags: [],
      textData: "",
      providerName: "Lab Technician",
      hospitalName: "PrivEMR Lab",
      licenseNumber: ""
    })
    setProcessingStatus(null)
    setFileValidation(null)
  }

  const getProcessingIcon = (status: EMRProcessingStatus['status']) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      {!isProcessing ? (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create New EMR
            </CardTitle>
            <CardDescription className="text-blue-100">
              Securely create, encrypt, and digitally sign electronic medical records
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">Patient Email *</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      placeholder="patient@example.com"
                      value={formData.patientEmail}
                      onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Full name (optional)"
                      value={formData.patientName || ""}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                      maxLength={12}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="abhaId">ABHA ID *</Label>
                    <Input
                      id="abhaId"
                      placeholder="12-3456-7890-1234"
                      value={formData.abhaId}
                      onChange={(e) => handleInputChange("abhaId", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* EMR Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">EMR Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">EMR Type *</Label>
                    <Select value={formData.type} onValueChange={(value: EMRType) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select EMR type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMR_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value: EMRPriority) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(priority => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">EMR Title *</Label>
                  <Input
                    id="title"
                    placeholder="Blood Report, X-Ray Results, etc."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the EMR content"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subType">Sub Type</Label>
                  <Input
                    id="subType"
                    placeholder="e.g., CBC, X-Ray Chest, etc."
                    value={formData.subType || ""}
                    onChange={(e) => handleInputChange("subType", e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* EMR Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">EMR Content</h3>
                
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Entry</TabsTrigger>
                    <TabsTrigger value="upload">File Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="textData">Medical Data</Label>
                      <Textarea
                        id="textData"
                        placeholder="Enter detailed medical information, observations, test results, treatment notes, etc."
                        value={formData.textData || ""}
                        onChange={(e) => handleInputChange("textData", e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="mt-4">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Upload EMR Document</p>
                          <p className="text-xs text-gray-500">PDF, DOCX, Images supported (Max 50MB)</p>
                          <Input
                            type="file"
                            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.gif,.txt"
                            onChange={handleFileUpload}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                      </div>
                      
                      {formData.file && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{formData.file.name}</p>
                            <p className="text-xs text-gray-500">
                              {FileProcessor.formatFileSize(formData.file.size)}
                            </p>
                          </div>
                          {fileValidation?.valid && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      )}
                      
                      {fileValidation && !fileValidation.valid && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{fileValidation.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Provider Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Provider Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="providerName">Provider Name *</Label>
                    <Input
                      id="providerName"
                      placeholder="Doctor/Lab Technician name"
                      value={formData.providerName}
                      onChange={(e) => handleInputChange("providerName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital/Lab Name *</Label>
                    <Input
                      id="hospitalName"
                      placeholder="Hospital or laboratory name"
                      value={formData.hospitalName}
                      onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Medical license number (optional)"
                    value={formData.licenseNumber || ""}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isProcessing}
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
        /* Processing View */
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Processing EMR
            </CardTitle>
            <CardDescription className="text-blue-100">
              Encrypting and signing your EMR securely
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {processingStatus && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                    {getProcessingIcon(processingStatus.status)}
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">{processingStatus.step}</p>
                      {processingStatus.message && (
                        <p className="text-sm text-gray-600">{processingStatus.message}</p>
                      )}
                    </div>
                    <Badge
                      variant={
                        processingStatus.status === "completed"
                          ? "default"
                          : processingStatus.status === "processing"
                            ? "secondary"
                            : processingStatus.status === "error"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {processingStatus.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(processingStatus.progress)}%</span>
                    </div>
                    <Progress value={processingStatus.progress} className="h-2" />
                  </div>

                  {processingStatus.status === 'completed' && processingStatus.progress === 100 && (
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={() => navigate("/my-emrs-main")} 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View My EMRs
                      </Button>
                      <Button 
                        onClick={resetForm} 
                        variant="outline" 
                        className="px-6"
                      >
                        Create Another
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
