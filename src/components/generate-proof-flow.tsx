

import { useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EMR {
  id: string
  title: string
  type: string
  dateReceived: string
  verified: boolean
}

interface ProofClaim {
  id: string
  title: string
  description: string
  category: "health" | "identity" | "verification"
  complexity: "simple" | "medium" | "complex"
}

export default function GenerateProofFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedEMR, setSelectedEMR] = useState<string | null>(null)
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProof, setGeneratedProof] = useState<any>(null)

  // Mock EMR data
  const [emrs] = useState<EMR[]>([
    {
      id: "1",
      title: "COVID-19 Test Report",
      type: "lab",
      dateReceived: "2025-02-15",
      verified: true,
    },
    {
      id: "2",
      title: "Vaccination Certificate",
      type: "vaccination",
      dateReceived: "2025-01-20",
      verified: true,
    },
    {
      id: "3",
      title: "Blood Test Report",
      type: "lab",
      dateReceived: "2025-03-10",
      verified: true,
    },
    {
      id: "4",
      title: "Discharge Summary",
      type: "hospital",
      dateReceived: "2024-12-28",
      verified: true,
    },
  ])

  // Mock proof claims based on selected EMR
  const getAvailableClaims = (emrId: string): ProofClaim[] => {
    const emr = emrs.find((e) => e.id === emrId)
    if (!emr) return []

    switch (emr.type) {
      case "lab":
        if (emr.title.includes("COVID")) {
          return [
            {
              id: "covid-negative",
              title: "COVID-19 Status: Negative",
              description: "Prove you tested negative for COVID-19",
              category: "health",
              complexity: "simple",
            },
            {
              id: "test-date",
              title: "Tested within last 72 hours",
              description: "Prove test was conducted recently",
              category: "verification",
              complexity: "medium",
            },
          ]
        }
        return [
          {
            id: "blood-normal",
            title: "Blood parameters within normal range",
            description: "Prove your blood test results are normal",
            category: "health",
            complexity: "medium",
          },
        ]
      case "vaccination":
        return [
          {
            id: "hep-b-vaccinated",
            title: "Vaccinated for Hepatitis-B",
            description: "Prove you have received Hepatitis-B vaccination",
            category: "health",
            complexity: "simple",
          },
          {
            id: "vaccination-valid",
            title: "Vaccination certificate is valid",
            description: "Prove vaccination was administered by licensed provider",
            category: "verification",
            complexity: "complex",
          },
        ]
      case "hospital":
        return [
          {
            id: "hospital-registered",
            title: "Treated at registered hospital",
            description: "Prove treatment was at a licensed medical facility",
            category: "verification",
            complexity: "medium",
          },
          {
            id: "discharge-date",
            title: "Discharged on specific date",
            description: "Prove discharge date without revealing condition",
            category: "identity",
            complexity: "simple",
          },
        ]
      default:
        return []
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab":
        return "🧪"
      case "vaccination":
        return "💉"
      case "hospital":
        return "🏥"
      default:
        return "📄"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-green-100 text-green-700"
      case "identity":
        return "bg-blue-100 text-blue-700"
      case "verification":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "⚡"
      case "medium":
        return "⚙️"
      case "complex":
        return "🔬"
      default:
        return "⚡"
    }
  }

  const handleEMRSelect = (emrId: string) => {
    setSelectedEMR(emrId)
  }

  const handleClaimToggle = (claimId: string) => {
    setSelectedClaims((prev) => (prev.includes(claimId) ? prev.filter((id) => id !== claimId) : [...prev, claimId]))
  }

  const handleGenerateProof = async () => {
    setIsGenerating(true)

    // Simulate ZK proof generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setGeneratedProof({
      id: "proof-" + Date.now(),
      title: selectedClaims.length > 1 ? "Multi-Claim Proof" : getAvailableClaims(selectedEMR!)[0]?.title,
      claims: selectedClaims.length,
      size: "24 KB",
      algorithm: "ZK-SNARK",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
    })

    setIsGenerating(false)
    setCurrentStep(4)
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedEMR) {
      setCurrentStep(2)
    } else if (currentStep === 2 && selectedClaims.length > 0) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const availableClaims = selectedEMR ? getAvailableClaims(selectedEMR) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          <Button variant="ghost" size="sm" className="text-gray-600 p-2" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-semibold text-gray-900">Generate ZK Proof</h1>
            <p className="text-xs text-gray-500">Step {currentStep} of 4</p>
          </div>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-3 py-4">
        {/* Step 1: Select EMR Source */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">📁 Select EMR Source</CardTitle>
                <p className="text-sm text-gray-600">Choose the medical record to create a proof from</p>
              </CardHeader>
            </Card>

            <div className="space-y-3">
              {emrs.map((emr) => (
                <Card
                  key={emr.id}
                  className={`border-0 shadow-sm cursor-pointer transition-all ${
                    selectedEMR === emr.id ? "border-l-4 border-l-blue-500 bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => handleEMRSelect(emr.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getTypeIcon(emr.type)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{emr.title}</h3>
                          <p className="text-xs text-gray-600">
                            {new Date(emr.dateReceived).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {emr.verified && (
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            ✅ Verified
                          </Badge>
                        )}
                        {selectedEMR === emr.id && <CheckCircle className="h-5 w-5 text-blue-600" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!selectedEMR}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue to Claims
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Choose Claims */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">🎯 Choose What to Prove</CardTitle>
                <p className="text-sm text-gray-600">Select the specific facts you want to prove</p>
              </CardHeader>
            </Card>

            <Alert className="border-purple-200 bg-purple-50">
              <Shield className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800 text-sm">
                Zero-Knowledge proofs let you prove these facts without revealing your full medical record.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {availableClaims.map((claim) => (
                <Card key={claim.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={claim.id}
                        checked={selectedClaims.includes(claim.id)}
                        onCheckedChange={() => handleClaimToggle(claim.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={claim.id} className="cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{getComplexityIcon(claim.complexity)}</span>
                            <h3 className="font-semibold text-gray-900 text-sm">{claim.title}</h3>
                            <Badge variant="outline" className={getCategoryColor(claim.category)}>
                              {claim.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{claim.description}</p>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedClaims.length === 0}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Generate Proof ({selectedClaims.length} claims)
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 3: Proof Generation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">⚙️ Generating Proof</CardTitle>
                <p className="text-sm text-gray-600">Creating your zero-knowledge proof...</p>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm border-l-4 border-l-purple-500">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isGenerating ? (
                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                  ) : (
                    <Zap className="h-8 w-8 text-purple-600" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isGenerating ? "Generating ZK Proof..." : "Ready to Generate"}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p>• Using ZK-SNARK algorithm</p>
                  <p>• Processing {selectedClaims.length} claim(s)</p>
                  <p>• Preserving your privacy</p>
                  <p>• Estimated time: 30 seconds</p>
                </div>

                {!isGenerating && (
                  <Button onClick={handleGenerateProof} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Zap className="mr-2 h-4 w-4" />
                    Start Generation
                  </Button>
                )}

                {isGenerating && (
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: "70%" }} />
                    </div>
                    <p className="text-sm text-gray-500">This may take a moment...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Proof Generated */}
        {currentStep === 4 && generatedProof && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  ✅ Proof Generated Successfully
                </CardTitle>
                <p className="text-sm text-gray-600">Your zero-knowledge proof is ready to use</p>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{generatedProof.title}</h3>
                      <p className="text-sm text-gray-600">{generatedProof.claims} claim(s) proven</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Algorithm:</span>
                      <span className="text-gray-900 font-medium">{generatedProof.algorithm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Proof Size:</span>
                      <span className="text-gray-900">{generatedProof.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="text-gray-900">{generatedProof.validUntil}</span>
                    </div>
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 text-sm">
                      Your original medical record remains private and encrypted.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-gray-300 text-gray-600">
                Save to My Proofs
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">Share Now</Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Safe Area */}
      <div className="h-4" />
    </div>
  )
}
