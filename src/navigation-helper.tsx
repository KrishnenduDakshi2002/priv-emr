

// Navigation helper component for consistent routing
export const navigationRoutes = {
  // Primary Features
  "my-emrs": "/my-emrs",
  "share-emr": "/share-emr",
  "my-proofs": "/my-proofs",
  "activity-log": "/activity-log",

  // ZK Proof Features
  "generate-proof": "/generate-proof",
  "share-proof": "/share-proof",
  "verify-proof": "/verify-proof",

  // Doctor Features (if user is also a doctor)
  "doctor-dashboard": "/doctor-dashboard",
  "doctor-requests": "/doctor-requests",
  "doctor-emrs": "/doctor-emrs",
  "doctor-request-access": "/doctor-request-access",

  // Advanced Settings
  "wallet-settings": "/wallet-settings",
  "privacy-controls": "/privacy-controls",
  "backup-recovery": "/backup-recovery",

  // Quick Actions
  "upload-emr": "/upload-emr",
  "emergency-access": "/emergency-access",

  // Account
  "profile-settings": "/profile-settings",
  "security-settings": "/security-settings",
} as const

export type NavigationRoute = keyof typeof navigationRoutes

export const getNavigationRoute = (route: NavigationRoute): string => {
  return navigationRoutes[route]
}

// Feature categories for organization
export const featureCategories = {
  primary: [
    { id: "my-emrs", title: "My EMRs", icon: "📄" },
    { id: "share-emr", title: "Share EMR Access", icon: "📤" },
    { id: "my-proofs", title: "My ZK Proofs", icon: "🧾" },
    { id: "activity-log", title: "Activity Log", icon: "🔄" },
  ],
  privacy: [
    { id: "generate-proof", title: "Generate Proof", icon: "⚙️" },
    { id: "share-proof", title: "Share Proof", icon: "🔗" },
    { id: "verify-proof", title: "Verify Proof", icon: "✅" },
  ],
  advanced: [
    { id: "wallet-settings", title: "Wallet Settings", icon: "🔐" },
    { id: "privacy-controls", title: "Privacy Controls", icon: "🛡️" },
    { id: "backup-recovery", title: "Backup & Recovery", icon: "💾" },
  ],
} as const
