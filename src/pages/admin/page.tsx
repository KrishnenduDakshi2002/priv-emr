
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Copy, Search, Shield, CheckCircle, XCircle, Loader2, LogOut, Database, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EntityData {
  email: string
  publicKey: string
  entityType: string
  verificationStatus: "verified" | "not-verified" | "pending"
  registeredAt?: string
}

export default function Admin() {
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<EntityData | null>(null)

  // Registration form state
  const [email, setEmail] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [entityType, setEntityType] = useState("")

  // Search form state
  const [searchEmail, setSearchEmail] = useState("")

  const handleRegister = async () => {
    if (!email || !publicKey || !entityType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: `${entityType} registered successfully with on-chain verification.`,
      })

      // Reset form
      setEmail("")
      setPublicKey("")
      setEntityType("")
      setIsRegistering(false)
    }, 2000)
  }

  const handleSearch = async () => {
    if (!searchEmail) {
      toast({
        title: "Validation Error",
        description: "Please enter an email address to search.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      // Mock search result
      const mockResult: EntityData = {
        email: searchEmail,
        publicKey: "0x742d35Cc6634C0532925a3b8D0C9964E5Bfe421C",
        entityType: "Hospital",
        verificationStatus: Math.random() > 0.5 ? "verified" : "not-verified",
        registeredAt: "2024-01-15T10:30:00Z",
      }

      setSearchResult(mockResult)
      setIsSearching(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-gray-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PrivEMR Admin</h1>
            </div>

            <nav className="flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Database className="mr-2 h-4 w-4" />
                Manage Records
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Button>
              <Button variant="outline" className="text-gray-600 hover:text-gray-900">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Public Key Registration & Verification</h2>
          <p className="text-gray-600">Manage verified entities in the healthcare blockchain network</p>
        </div>

        <Tabs defaultValue="register" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="register">Register Entity</TabsTrigger>
            <TabsTrigger value="verify">Search & Verify</TabsTrigger>
          </TabsList>

          {/* Registration Tab */}
          <TabsContent value="register" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Register New Entity</span>
                </CardTitle>
                <CardDescription>
                  Add a new verified entity to the blockchain network. Data will be stored off-chain with a hash stored
                  on-chain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entityType">Entity Type *</Label>
                    <Select value={entityType} onValueChange={setEntityType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="lab">Laboratory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="publicKey"
                      placeholder="0xabc123..."
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(publicKey)}
                      disabled={!publicKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleRegister} disabled={isRegistering} className="bg-blue-600 hover:bg-blue-700">
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Entity"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verify" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span>Search & Verify Entity</span>
                </CardTitle>
                <CardDescription>
                  Search for registered entities by email and verify their on-chain status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="searchEmail">Enter Email Address</Label>
                    <Input
                      id="searchEmail"
                      type="email"
                      placeholder="Search by email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleSearch} disabled={isSearching} variant="outline">
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {searchResult && (
                  <Card className="mt-6 bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Search Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email</Label>
                          <p className="text-sm font-mono">{searchResult.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Entity Type</Label>
                          <Badge variant="secondary" className="ml-2">
                            {searchResult.entityType}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Public Key</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="flex-1 p-2 bg-gray-200 rounded text-sm font-mono break-all">
                            {searchResult.publicKey}
                          </code>
                          <Button variant="outline" size="icon" onClick={() => copyToClipboard(searchResult.publicKey)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Verification Status</Label>
                        <div className="mt-2">
                          {searchResult.verificationStatus === "verified" ? (
                            <Alert className="border-green-200 bg-green-50">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-800">
                                ✅ Verified - On-chain hash matches stored data
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <Alert className="border-red-200 bg-red-50">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                ❌ Not Verified - On-chain hash mismatch or not found
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>

                      {searchResult.registeredAt && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Registered</Label>
                          <p className="text-sm text-gray-700">
                            {new Date(searchResult.registeredAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}