"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Hotel,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useAuth } from "@/src/hooks/use-auth";
import { useToast } from "@/src/hooks/use-toast";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Redirect if not logged in or not an owner
  useEffect(() => {
    if (!user) {
      toast({
        title: "Access denied",
        description:
          "You must be logged in as a hotel owner to access this page.",
        variant: "destructive",
      });
      window.location.href = "/";
    } else if (user.role !== "owner") {
      toast({
        title: "Access denied",
        description: "You must be a hotel owner to access this page.",
        variant: "destructive",
      });
      window.location.href = "/";
    }
  }, [user, toast]);

  if (!user || user.role !== "owner") {
    return null;
  }

  const navItems = [
    { href: "/owner", label: "Dashboard", icon: Home },
    { href: "/owner/rooms", label: "Rooms", icon: Hotel },
    { href: "/owner/bookings", label: "Bookings", icon: Calendar },
    { href: "/owner/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/owner/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-indigo-600">
              Hotel Owner Dashboard
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || "Hotel Owner"}</p>
                <p className="text-sm text-gray-500">
                  {user?.email || "owner@example.com"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top header */}
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {pathname === "/owner"
                ? "Dashboard"
                : pathname === "/owner/rooms"
                ? "Room Management"
                : pathname === "/owner/bookings"
                ? "Booking Management"
                : pathname === "/owner/analytics"
                ? "Analytics"
                : "Settings"}
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
