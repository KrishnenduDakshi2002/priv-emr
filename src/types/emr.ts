// EMR Data Schema for PrivEMR System

export interface PatientInfo {
  email: string
  aadhaarNumber: string
  abhaId: string
  name?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  phoneNumber?: string
  address?: string
}

export interface MedicalProvider {
  name: string
  licenseNumber?: string
  specialization?: string
  hospitalName: string
  hospitalId?: string
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
}

export interface EMRMetadata {
  id: string
  title: string
  description: string
  type: 'lab' | 'imaging' | 'prescription' | 'diagnostic' | 'vaccination' | 'consultation' | 'surgery' | 'other'
  subType?: string // e.g., "Blood Test", "X-Ray", "MRI", etc.
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'active' | 'archived' | 'deleted'
  tags: string[]
}

export interface EMRSecurity {
  hash: string
  signature: string
  encryptionMethod: string
  keyId: string
  isEncrypted: boolean
  isSigned: boolean
  verificationStatus: 'pending' | 'verified' | 'failed'
}

export interface EMRContent {
  textData?: string
  fileData?: {
    originalName: string
    mimeType: string
    size: number
    base64Data: string
    checksum: string
  }
  structuredData?: {
    // For structured medical data
    vitals?: {
      bloodPressure?: string
      heartRate?: number
      temperature?: number
      weight?: number
      height?: number
      bmi?: number
    }
    labResults?: {
      testName: string
      value: string | number
      unit?: string
      referenceRange?: string
      status: 'normal' | 'abnormal' | 'critical'
    }[]
    medications?: {
      name: string
      dosage: string
      frequency: string
      duration: string
      instructions?: string
    }[]
    diagnosis?: {
      primary: string
      secondary?: string[]
      icdCodes?: string[]
    }
    procedures?: {
      name: string
      date: string
      description?: string
      cptCode?: string
    }[]
  }
}

export interface EMRTimestamps {
  createdAt: string
  updatedAt: string
  lastAccessedAt?: string
  expiresAt?: string
  scheduledFor?: string // For future appointments/procedures
}

export interface EMRAccess {
  createdBy: MedicalProvider
  accessLog: {
    accessedBy: string
    accessedAt: string
    action: 'view' | 'edit' | 'share' | 'download' | 'print'
    ipAddress?: string
  }[]
  sharedWith: {
    email: string
    role: 'doctor' | 'lab' | 'patient' | 'insurance' | 'other'
    permissions: ('read' | 'write' | 'share')[]
    sharedAt: string
    expiresAt?: string
  }[]
}

export interface EMRCompliance {
  hipaaCompliant: boolean
  gdprCompliant: boolean
  localRegulationsCompliant: boolean
  retentionPeriod: number // in years
  consentGiven: boolean
  consentDate: string
  auditTrail: {
    action: string
    timestamp: string
    userId: string
    details?: string
  }[]
}

// Main EMR Record Interface
export interface EMRRecord {
  // Core identifiers
  id: string
  version: string
  
  // Patient information
  patient: PatientInfo
  
  // Medical provider information
  provider: MedicalProvider
  
  // EMR metadata
  metadata: EMRMetadata
  
  // Content and data
  content: EMRContent
  
  // Security and cryptography
  security: EMRSecurity
  
  // Timestamps
  timestamps: EMRTimestamps
  
  // Access control
  access: EMRAccess
  
  // Compliance and legal
  compliance: EMRCompliance
}

// Simplified EMR for display purposes
export interface EMRSummary {
  id: string
  title: string
  description: string
  type: EMRMetadata['type']
  subType?: string
  dateCreated: string
  provider: string
  hospital: string
  verified: boolean
  priority: EMRMetadata['priority']
  fileSize?: string
  lastAccessed?: string
  tags: string[]
}

// Form data for creating EMR
export interface CreateEMRFormData {
  // Patient info
  patientEmail: string
  aadhaarNumber: string
  abhaId: string
  patientName?: string
  
  // EMR basic info
  title: string
  description: string
  type: EMRMetadata['type']
  subType?: string
  priority: EMRMetadata['priority']
  tags: string[]
  
  // Content
  textData?: string
  file?: File
  
  // Provider info (usually auto-filled for labs)
  providerName: string
  hospitalName: string
  licenseNumber?: string
  
  // Additional metadata
  scheduledFor?: string
  expiresAt?: string
}

// Processing status for EMR creation
export interface EMRProcessingStatus {
  step: 'validation' | 'encryption' | 'signing' | 'storage' | 'indexing' | 'notification' | 'completed'
  status: 'pending' | 'processing' | 'completed' | 'error'
  message?: string
  progress: number
}

// Local storage keys
export const EMR_STORAGE_KEYS = {
  RECORDS: 'privemr_records',
  DRAFTS: 'privemr_drafts',
  SETTINGS: 'privemr_settings',
  USER_PROFILE: 'privemr_user_profile'
} as const

// Utility types
export type EMRType = EMRMetadata['type']
export type EMRPriority = EMRMetadata['priority']
export type EMRStatus = EMRMetadata['status']
export type VerificationStatus = EMRSecurity['verificationStatus'] 