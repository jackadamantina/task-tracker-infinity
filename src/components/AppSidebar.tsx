

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, ChartGantt, BarChart, TrendingUp, Mail, Target, Settings } from "lucide-react";
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
  { title: "Visão Geral", url: "/", icon: BarChart },
  { title: "Board Kanban", url: "/kanban", icon: Kanban },
  { title: "Relatório", url: "/relatorios", icon: ChartGantt },
  { title: "Configurações", url: "/config", icon: Settings },
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
      ? "bg-yellow-400 text-gray-900 shadow-lg font-bold border-l-4 border-yellow-600 transform scale-[1.02] rounded-r-lg" 
      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg";

  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-sm">
      <SidebarHeader className="border-b border-gray-100 p-6 bg-white">
        <div className="flex items-center gap-3">
          <TaskTrackerLogo size="sm" showText={false} />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Task Tracker</h1>
            <p className="text-sm text-gray-500">Tarefas e projetos</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => `flex items-center gap-4 px-4 py-4 transition-all duration-200 ${getNavCls(isActive)}`}
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

