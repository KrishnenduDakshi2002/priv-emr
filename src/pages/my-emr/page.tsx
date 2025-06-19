import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Eye,
  Copy,
  Filter,
  Download,
  Hash,
  Key,
  Calendar,
  Mail,
  FileText,
  Shield,
  ChevronDown,
  ExternalLink,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface EMRRecord {
  id: string
  patientEmail: string
  aadhaarNumber: string
  abhaId: string
  title: string
  hash: string
  signature: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

export default function MyEMRsPage() {
  const [emrRecords, setEmrRecords] = useState<EMRRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<EMRRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<EMRRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockRecords: EMRRecord[] = [
      {
        id: "EMR-2024001",
        patientEmail: "patient1@example.com",
        aadhaarNumber: "1234-5678-9012",
        abhaId: "12-3456-7890-1234",
        title: "Blood Test Report - Complete Blood Count",
        hash: "0xa1b2c3d4e5f6...789abc",
        signature: "0x9876543210ab...cdef12",
        timestamp: "2024-01-15T10:30:00Z",
        status: "completed",
      },
      {
        id: "EMR-2024002",
        patientEmail: "patient2@example.com",
        aadhaarNumber: "2345-6789-0123",
        abhaId: "23-4567-8901-2345",
        title: "X-Ray Report - Chest PA View",
        hash: "0xb2c3d4e5f6a7...890bcd",
        signature: "0x8765432109ba...dcfe21",
        timestamp: "2024-01-14T14:45:00Z",
        status: "completed",
      },
      {
        id: "EMR-2024003",
        patientEmail: "patient3@example.com",
        aadhaarNumber: "3456-7890-1234",
        abhaId: "34-5678-9012-3456",
        title: "Consultation Notes - Diabetes Follow-up",
        hash: "0xc3d4e5f6a7b8...901cde",
        signature: "0x7654321098cb...edcf32",
        timestamp: "2024-01-13T09:15:00Z",
        status: "completed",
      },
      {
        id: "EMR-2024004",
        patientEmail: "patient4@example.com",
        aadhaarNumber: "4567-8901-2345",
        abhaId: "45-6789-0123-4567",
        title: "ECG Report - Routine Checkup",
        hash: "0xd4e5f6a7b8c9...012def",
        signature: "0x6543210987dc...fedc43",
        timestamp: "2024-01-12T16:20:00Z",
        status: "pending",
      },
      {
        id: "EMR-2024005",
        patientEmail: "patient5@example.com",
        aadhaarNumber: "5678-9012-3456",
        abhaId: "56-7890-1234-5678",
        title: "MRI Scan Report - Brain",
        hash: "0xe5f6a7b8c9d0...123ef0",
        signature: "0x5432109876ed...gfed54",
        timestamp: "2024-01-11T11:00:00Z",
        status: "completed",
      },
    ]

    setTimeout(() => {
      setEmrRecords(mockRecords)
      setFilteredRecords(mockRecords)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = emrRecords.filter(
      (record) =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.aadhaarNumber.includes(searchTerm) ||
        record.abhaId.includes(searchTerm),
    )
    setFilteredRecords(filtered)
  }, [searchTerm, emrRecords])

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `${fieldName} has been copied to your clipboard.`,
      })
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: EMRRecord["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">My EMRs</h1>
            </div>
            <p className="text-gray-600">View and manage all medical records you've created</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  EMR Records Dashboard
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {filteredRecords.length} Records
                </Badge>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Encrypted and digitally signed medical records
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by EMR ID, patient email, title, Aadhaar, or ABHA ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">EMR ID</TableHead>
                      <TableHead className="font-semibold">Patient Details</TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Hash</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{record.id}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(record.id, "EMR ID")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{record.patientEmail}</div>
                            <div className="text-xs text-gray-500">Aadhaar: {record.aadhaarNumber}</div>
                            <div className="text-xs text-gray-500">ABHA: {record.abhaId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="text-sm font-medium truncate" title={record.title}>
                              {record.title}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {record.hash.substring(0, 12)}...
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(record.hash, "Hash")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">{formatTimestamp(record.timestamp)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedRecord(record)}
                                  className="h-8"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    EMR Details - {selectedRecord?.id}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedRecord && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                          <Mail className="h-4 w-4" />
                                          Patient Email
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <code className="text-sm">{selectedRecord.patientEmail}</code>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                          <Key className="h-4 w-4" />
                                          Aadhaar Number
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <code className="text-sm font-mono">{selectedRecord.aadhaarNumber}</code>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                          <Shield className="h-4 w-4" />
                                          ABHA ID
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <code className="text-sm font-mono">{selectedRecord.abhaId}</code>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                          <Calendar className="h-4 w-4" />
                                          Created
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <span className="text-sm">{formatTimestamp(selectedRecord.timestamp)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <FileText className="h-4 w-4" />
                                        EMR Title
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm">{selectedRecord.title}</span>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="font-medium text-gray-900">Cryptographic Details</h4>

                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                          <Hash className="h-4 w-4" />
                                          Encrypted Hash
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                          <code className="flex-1 text-sm font-mono text-gray-600">
                                            {selectedRecord.hash}
                                          </code>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(selectedRecord.hash, "Hash")}
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
                                          <code className="flex-1 text-sm font-mono text-gray-600">
                                            {selectedRecord.signature}
                                          </code>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(selectedRecord.signature, "Signature")}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Copy className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                      <Button variant="outline" className="flex-1">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View on Blockchain
                                      </Button>
                                      <Button variant="outline" className="flex-1">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Report
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No EMRs found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? "No records match your search criteria." : "You haven't created any EMRs yet."}
                  </p>
                  <Button asChild>
                    <a href="/create-emr">Create Your First EMR</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
