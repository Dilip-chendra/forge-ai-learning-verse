
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Upload,
  Target,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  BookCopy,
  BrainCircuit
} from "lucide-react";
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: BarChart
  },
  {
    title: "Smart Study Generator",
    path: "/study-generator",
    icon: BrainCircuit
  },
  {
    title: "Upload-to-Learn",
    path: "/upload-to-learn",
    icon: Upload
  },
  {
    title: "AI SkillForge",
    path: "/skill-forge",
    icon: Target
  },
  {
    title: "AI Tutor",
    path: "/ai-tutor",
    icon: MessageSquare
  },
  {
    title: "Learning Library",
    path: "/library",
    icon: BookCopy
  }
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center items-center py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-eduforge-purple text-white p-2 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xl font-heading font-semibold">EduForge<span className="text-eduforge-purple">AI</span></span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={location.pathname === item.path ? "bg-primary/10 text-primary" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-4">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" className="justify-start" asChild>
            <Link to="/settings" className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
