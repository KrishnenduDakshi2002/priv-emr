import { EMRRecord, EMRSummary, CreateEMRFormData, EMRProcessingStatus, EMR_STORAGE_KEYS } from '@/types/emr'

// Crypto utilities (simulated for frontend)
export class EMRCrypto {
  static async generateHash(data: string): Promise<string> {
    // Simulate hash generation
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16) + '...'
  }

  static async generateSignature(data: string): Promise<string> {
    // Simulate digital signature
    const timestamp = Date.now().toString()
    const combined = data + timestamp
    return '0x' + btoa(combined).substring(0, 16) + '...' + btoa(timestamp).substring(0, 8)
  }

  static async encryptData(data: string): Promise<string> {
    // Simulate encryption (in real app, this would use actual encryption)
    return btoa(data) // Simple base64 encoding as simulation
  }

  static async decryptData(encryptedData: string): Promise<string> {
    // Simulate decryption
    try {
      return atob(encryptedData)
    } catch {
      return encryptedData // Return as-is if not base64
    }
  }
}

// File processing utilities
export class FileProcessor {
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1]) // Remove data:mime;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  static async generateFileChecksum(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ]

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50MB' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported' }
    }

    return { valid: true }
  }
}

// EMR processing and creation
export class EMRProcessor {
  static generateEMRId(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `EMR-${timestamp}-${random}`
  }

  static async processFormData(formData: CreateEMRFormData): Promise<EMRRecord> {
    const now = new Date().toISOString()
    const emrId = this.generateEMRId()

    // Process file if present
    let fileData = undefined
    if (formData.file) {
      const base64Data = await FileProcessor.fileToBase64(formData.file)
      const checksum = await FileProcessor.generateFileChecksum(formData.file)
      
      fileData = {
        originalName: formData.file.name,
        mimeType: formData.file.type,
        size: formData.file.size,
        base64Data,
        checksum
      }
    }

    // Generate content for hashing
    const contentForHash = JSON.stringify({
      patient: formData.patientEmail,
      title: formData.title,
      description: formData.description,
      textData: formData.textData,
      fileChecksum: fileData?.checksum,
      timestamp: now
    })

    // Generate security data
    const hash = await EMRCrypto.generateHash(contentForHash)
    const signature = await EMRCrypto.generateSignature(contentForHash)
    const encryptedContent = formData.textData ? await EMRCrypto.encryptData(formData.textData) : undefined

    const emrRecord: EMRRecord = {
      id: emrId,
      version: '1.0',
      
      patient: {
        email: formData.patientEmail,
        aadhaarNumber: formData.aadhaarNumber,
        abhaId: formData.abhaId,
        name: formData.patientName
      },

      provider: {
        name: formData.providerName,
        hospitalName: formData.hospitalName,
        licenseNumber: formData.licenseNumber,
        specialization: 'Laboratory Medicine' // Default for lab portal
      },

      metadata: {
        id: emrId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subType: formData.subType,
        priority: formData.priority,
        status: 'active',
        tags: formData.tags
      },

      content: {
        textData: encryptedContent,
        fileData,
        structuredData: this.extractStructuredData(formData.textData || '', formData.type)
      },

      security: {
        hash,
        signature,
        encryptionMethod: 'AES-256-GCM',
        keyId: `key-${Date.now()}`,
        isEncrypted: true,
        isSigned: true,
        verificationStatus: 'verified'
      },

      timestamps: {
        createdAt: now,
        updatedAt: now,
        scheduledFor: formData.scheduledFor,
        expiresAt: formData.expiresAt
      },

      access: {
        createdBy: {
          name: formData.providerName,
          hospitalName: formData.hospitalName,
          licenseNumber: formData.licenseNumber
        },
        accessLog: [{
          accessedBy: formData.providerName,
          accessedAt: now,
          action: 'view'
        }],
        sharedWith: []
      },

      compliance: {
        hipaaCompliant: true,
        gdprCompliant: true,
        localRegulationsCompliant: true,
        retentionPeriod: 7,
        consentGiven: true,
        consentDate: now,
        auditTrail: [{
          action: 'created',
          timestamp: now,
          userId: formData.providerName,
          details: 'EMR created via lab portal'
        }]
      }
    }

    return emrRecord
  }

  private static extractStructuredData(textData: string, type: string): any {
    // Simple extraction of structured data based on type and content
    // In a real app, this would use NLP or structured input forms
    
    const structuredData: any = {}

    if (type === 'lab') {
      // Try to extract lab values
      const labPattern = /(\w+):\s*(\d+\.?\d*)\s*(\w+)?/g
      const matches = [...textData.matchAll(labPattern)]
      
      if (matches.length > 0) {
        structuredData.labResults = matches.map(match => ({
          testName: match[1],
          value: parseFloat(match[2]),
          unit: match[3] || '',
          referenceRange: 'Normal',
          status: 'normal' as const
        }))
      }
    }

    return Object.keys(structuredData).length > 0 ? structuredData : undefined
  }

  static convertToSummary(emrRecord: EMRRecord): EMRSummary {
    return {
      id: emrRecord.id,
      title: emrRecord.metadata.title,
      description: emrRecord.metadata.description,
      type: emrRecord.metadata.type,
      subType: emrRecord.metadata.subType,
      dateCreated: emrRecord.timestamps.createdAt,
      provider: emrRecord.provider.name,
      hospital: emrRecord.provider.hospitalName,
      verified: emrRecord.security.verificationStatus === 'verified',
      priority: emrRecord.metadata.priority,
      fileSize: emrRecord.content.fileData ? FileProcessor.formatFileSize(emrRecord.content.fileData.size) : undefined,
      lastAccessed: emrRecord.timestamps.lastAccessedAt,
      tags: emrRecord.metadata.tags
    }
  }
}

// Local storage management
export class EMRStorage {
  static saveEMR(emrRecord: EMRRecord): void {
    try {
      const existingRecords = this.getAllEMRs()
      const updatedRecords = [...existingRecords, emrRecord]
      console.log('Saving EMR to localStorage:', emrRecord.id, emrRecord.metadata.title)
      console.log('Total EMRs after save:', updatedRecords.length)
      localStorage.setItem(EMR_STORAGE_KEYS.RECORDS, JSON.stringify(updatedRecords))
    } catch (error) {
      console.error('Failed to save EMR to localStorage:', error)
      throw new Error('Failed to save EMR record')
    }
  }

  static getAllEMRs(): EMRRecord[] {
    try {
      const stored = localStorage.getItem(EMR_STORAGE_KEYS.RECORDS)
      const records = stored ? JSON.parse(stored) : []
      console.log('Retrieved EMRs from localStorage:', records.length, 'records')
      return records
    } catch (error) {
      console.error('Failed to retrieve EMRs from localStorage:', error)
      return []
    }
  }

  static getEMRSummaries(): EMRSummary[] {
    const records = this.getAllEMRs()
    const summaries = records.map(record => EMRProcessor.convertToSummary(record))
    console.log('Converting to summaries:', summaries.length, 'summaries')
    return summaries
  }

  static getEMRById(id: string): EMRRecord | null {
    const records = this.getAllEMRs()
    return records.find(record => record.id === id) || null
  }

  static updateEMR(id: string, updates: Partial<EMRRecord>): void {
    const records = this.getAllEMRs()
    const index = records.findIndex(record => record.id === id)
    
    if (index !== -1) {
      records[index] = { ...records[index], ...updates }
      localStorage.setItem(EMR_STORAGE_KEYS.RECORDS, JSON.stringify(records))
    }
  }

  static deleteEMR(id: string): void {
    const records = this.getAllEMRs()
    const filteredRecords = records.filter(record => record.id !== id)
    localStorage.setItem(EMR_STORAGE_KEYS.RECORDS, JSON.stringify(filteredRecords))
  }

  static clearAllEMRs(): void {
    localStorage.removeItem(EMR_STORAGE_KEYS.RECORDS)
  }

  static exportEMRs(): string {
    const records = this.getAllEMRs()
    return JSON.stringify(records, null, 2)
  }

  static importEMRs(jsonData: string): void {
    try {
      const records = JSON.parse(jsonData) as EMRRecord[]
      localStorage.setItem(EMR_STORAGE_KEYS.RECORDS, JSON.stringify(records))
    } catch (error) {
      throw new Error('Invalid EMR data format')
    }
  }
}

// Processing simulation for UI
export class ProcessingSimulator {
  static async simulateEMRProcessing(
    formData: CreateEMRFormData,
    onStatusUpdate: (status: EMRProcessingStatus) => void
  ): Promise<EMRRecord> {
    const steps: EMRProcessingStatus['step'][] = [
      'validation',
      'encryption', 
      'signing',
      'storage',
      'indexing',
      'notification'
    ]

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const progress = ((i + 1) / steps.length) * 100

      // Start processing
      onStatusUpdate({
        step,
        status: 'processing',
        progress,
        message: `Processing ${step}...`
      })

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

      // Complete step
      onStatusUpdate({
        step,
        status: 'completed',
        progress,
        message: `${step} completed successfully`
      })
    }

    // Process the actual EMR
    const emrRecord = await EMRProcessor.processFormData(formData)
    
    // Save to localStorage
    EMRStorage.saveEMR(emrRecord)

    return emrRecord
  }
} 