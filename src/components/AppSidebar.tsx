
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
      ? "gradient-accent text-gray-800 shadow-lg shadow-yellow font-bold border-l-4 border-yellow-500 transform scale-[1.02]" 
      : "hover:bg-gray-50 text-gray-600 hover:text-blue-600 hover:border-l-4 hover:border-blue-400 hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.01]";

  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-lg">
      <SidebarHeader className="border-b border-gray-100 p-6 bg-white">
        <TaskTrackerLogo collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="px-4 py-8">
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 py-4 mb-4 bg-gray-50 rounded-lg border border-gray-100">
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
                      className={({ isActive }) => `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${getNavCls(isActive)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-semibold text-sm tracking-wide">{item.title}</span>}
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
