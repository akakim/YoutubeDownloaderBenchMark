import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { AppSidebarProps } from "@/types/appSidebarProps"
import {
  BookOpenIcon,
  ChartPieIcon,
  CropIcon,
  GearIcon,
  MapTrifoldIcon,
  RobotIcon,
  RowsIcon,
  TerminalIcon,
} from "@phosphor-icons/react"

export const sideBarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <RowsIcon />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "주제 분석하기",
      url: "/search",
      icon: <TerminalIcon />,
      isActive: true,
      items: [
        {
          title: "키워드 검색",
          url: "/keyword",
        },
        {
          title: "요즘 잘하는 채널 랭킹!",
          url: "/category",
        },
        {
          title: "좋은 쇼츠 검색",
          url: "/gooshorts",
        },
      ],
    },
    {
      title: "영상 분석",
      url: "#",
      icon: <RobotIcon />,
      items: [
        {
          title: "영상에서 텍스트 추출",
          url: "/analyze/mp4totxt",
        },
        {
          title: "대박영상요소 분석",
          url: "/analyze/goodvideo",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/doc",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <GearIcon />,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <CropIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <ChartPieIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapTrifoldIcon />,
    },
  ],
}

type AppSidebarComponentProps = AppSidebarProps &
  React.ComponentProps<typeof Sidebar>

export function AppSidebar({
  onMenuClick,
  ...props
}: AppSidebarComponentProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sideBarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain onMenuClick={onMenuClick} items={sideBarData.navMain} />
        <NavProjects projects={sideBarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sideBarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
