"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, User, LogOut, Settings } from "lucide-react"; // Removed Search import
import { Button } from "@/src/components/ui/button";
// Removed Input import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { AuthModal } from "@/src/components/auth/auth-modal";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";
import { useAuth } from "@/src/hooks/use-auth";

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user, logout } = useAuth();

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-shrink-0 font-bold text-xl text-foreground"
              >
                CAMBODIA HOTELS BOOKING
              </Link>
              <div className="flex items-center gap-4 ml-6">
                <div className="flex items-baseline space-x-8">
                  <Link
                    href="/"
                    className="nav-link text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/hotels"
                    className="nav-link text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Hotels
                  </Link>
                  <Link
                    href="/bookings"
                    className="nav-link text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/favorites"
                    className="nav-link text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Favorites
                  </Link>
                  {/* Owner/Admin Dashboard link for owners/admins */}
                  {user?.role === "owner" && (
                    <Link
                      href="/owner"
                      className="nav-link text-primary font-bold hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm"
                    >
                      Owner Dashboard
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="nav-link text-red-700 font-bold hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Removed the search input and icon */}
              <ThemeToggle />

              {!user ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick("login")}
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleAuthClick("register")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
