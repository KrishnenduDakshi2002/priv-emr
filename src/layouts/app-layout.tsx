import React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePath } from "raviger"

// Route to breadcrumb mapping
const routeBreadcrumbs: Record<string, { label: string; href?: string }[]> = {
  "/user": [{ label: "User Dashboard" }],
  "/admin": [{ label: "Admin Panel" }],
  "/doctor": [{ label: "Doctor Portal" }],
  "/lab": [{ label: "Lab Portal" }],
  "/create-emr": [{ label: "Lab Portal", href: "/lab" }, { label: "Create EMR" }],
  "/my-emr": [{ label: "My EMRs" }],
  "/my-emrs": [{ label: "My EMRs" }],
  "/my-emrs-main": [{ label: "My EMRs", href: "/my-emrs" }, { label: "Main" }],
  "/share-emr": [{ label: "Share EMR" }],
  "/my-proofs": [{ label: "My Proofs" }],
  "/generate-proof": [{ label: "ZK Proofs", href: "/my-proofs" }, { label: "Generate Proof" }],
  "/share-proof": [{ label: "ZK Proofs", href: "/my-proofs" }, { label: "Share Proof" }],
  "/verify-proof": [{ label: "ZK Proofs", href: "/my-proofs" }, { label: "Verify Proof" }],
  "/doctor-dashboard": [{ label: "Doctor Dashboard" }],
  "/doctor-requests": [{ label: "Doctor", href: "/doctor-dashboard" }, { label: "Requests" }],
  "/doctor-emrs": [{ label: "Doctor", href: "/doctor-dashboard" }, { label: "EMRs" }],
  "/doctor-request-access": [{ label: "Doctor", href: "/doctor-dashboard" }, { label: "Request Access" }],
}

// Route to title mapping
const routeTitles: Record<string, string> = {
  "/": "Welcome to PrivEMR",
  "/user": "User Dashboard",
  "/admin": "Admin Panel",
  "/doctor": "Doctor Portal",
  "/lab": "Lab Portal",
  "/create-emr": "Create EMR",
  "/my-emr": "My EMRs",
  "/my-emrs": "My EMRs",
  "/my-emrs-main": "My EMRs - Main",
  "/share-emr": "Share EMR",
  "/my-proofs": "My Proofs",
  "/generate-proof": "Generate Proof",
  "/share-proof": "Share Proof",
  "/verify-proof": "Verify Proof",
  "/doctor-dashboard": "Doctor Dashboard",
  "/doctor-requests": "Doctor Requests",
  "/doctor-emrs": "Doctor EMRs",
  "/doctor-request-access": "Request Access",
}

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const currentPath = usePath()
  const breadcrumbs = routeBreadcrumbs[currentPath || "/"] || []
  const pageTitle = routeTitles[currentPath || "/"] || "PrivEMR"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((breadcrumb: { label: string; href?: string }, index: number) => (
                    <React.Fragment key={index}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {breadcrumb.href ? (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
              </div>
              {children}
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 