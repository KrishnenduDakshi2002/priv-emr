import React from "react"
import { usePath, useNavigate } from "raviger"
import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  FileText,
  Share2,
  Shield,
  Activity,
  Zap,
  Link as LinkIcon,
  CheckCircle,
  Stethoscope,
  Users,
  FolderOpen,
  UserPlus,
  Wallet,
  Lock,
  Database,
  TestTube,
  UserCog,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Navigation items organized by categories
const navigationData = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  navMain: [
    {
      title: "User Features",
      items: [
        {
          title: "User Dashboard",
          url: "/user",
          icon: Home,
        },
        // {
        //   title: "My EMRs",
        //   url: "/my-emrs",
        //   icon: FileText,
        // },
        {
          title: "My EMRs Main",
          url: "/my-emrs-main",
          icon: FolderOpen,
        },
        {
          title: "Share EMR",
          url: "/share-emr",
          icon: Share2,
        },
        {
          title: "My Proofs",
          url: "/my-proofs",
          icon: Shield,
        },
      ],
    },
    {
      title: "ZK Proof Features",
      items: [
        {
          title: "Generate Proof",
          url: "/generate-proof",
          icon: Zap,
        },
        {
          title: "Share Proof",
          url: "/share-proof",
          icon: LinkIcon,
        },
        {
          title: "Verify Proof",
          url: "/verify-proof",
          icon: CheckCircle,
        },
      ],
    },
    {
      title: "Doctor Features",
      items: [
        {
          title: "Doctor Dashboard",
          url: "/doctor-dashboard",
          icon: Stethoscope,
        },
        {
          title: "Doctor Requests",
          url: "/doctor-requests",
          icon: Inbox,
        },
        {
          title: "Doctor EMRs",
          url: "/doctor-emrs",
          icon: FileText,
        },
        {
          title: "Request Access",
          url: "/doctor-request-access",
          icon: UserPlus,
        },
      ],
    },
    {
      title: "Admin & Lab",
      items: [
        {
          title: "Admin Panel",
          url: "/admin",
          icon: UserCog,
        },
        // {
        //   title: "Doctor Portal",
        //   url: "/doctor",
        //   icon: Stethoscope,
        // },
        // {
        //   title: "Lab Portal",
        //   url: "/lab",
        //   icon: TestTube,
        // },
        {
          title: "Create EMR",
          url: "/create-emr",
          icon: FileText,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePath()
  const navigate = useNavigate()

  const handleNavigation = (url: string) => {
    navigate(url)
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Stethoscope className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">PrivEMR</span>
            <span className="truncate text-xs">Medical Platform</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {navigationData.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = currentPath === item.url
                  const Icon = item.icon
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <button 
                          onClick={() => handleNavigation(item.url)}
                          className="w-full"
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={navigationData.user.avatar}
                      alt={navigationData.user.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {navigationData.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {navigationData.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {navigationData.user.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                  <User2 />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity />
                  Activity Log
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
} 