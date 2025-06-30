
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, ChartGantt } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { TaskTrackerLogo } from "./TaskTrackerLogo";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Usuários", url: "/usuarios", icon: Users },
  { title: "Kanban", url: "/kanban", icon: Kanban },
  { title: "Relatórios", url: "/relatorios", icon: ChartGantt },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (isActiveRoute: boolean) =>
    isActiveRoute 
      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-400/30 font-semibold border-l-4 border-yellow-600" 
      : "hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 hover:border-l-4 hover:border-yellow-300 transition-all duration-200";

  return (
    <Sidebar className="bg-white border-r border-yellow-200 shadow-lg">
      <SidebarHeader className="border-b border-yellow-100 p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
        <TaskTrackerLogo collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-bold text-yellow-700 uppercase tracking-wider px-3 py-3 mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${getNavCls(isActive)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
