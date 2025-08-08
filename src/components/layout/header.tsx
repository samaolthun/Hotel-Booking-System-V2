"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-shrink-0 font-bold text-lg md:text-xl text-foreground"
              >
                CAMBODIA HOTELS
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 ml-6">
              <div className="flex items-baseline space-x-4">
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

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4">
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
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Home
                </Link>
                <Link
                  href="/hotels"
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Hotels
                </Link>
                <Link
                  href="/bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  My Bookings
                </Link>
                <Link
                  href="/favorites"
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Favorites
                </Link>
                {user?.role === "owner" && (
                  <Link
                    href="/owner"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary"
                  >
                    Owner Dashboard
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-red-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-accent">
                {!user ? (
                  <div className="px-2 space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleAuthClick("login")}
                      className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => handleAuthClick("register")}
                      className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Register
                    </Button>
                  </div>
                ) : (
                  <div className="px-2 space-y-2">
                    <div className="flex items-center px-3">
                      <div className="flex-shrink-0">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium">{user.name}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleProfileClick}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSettingsClick}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
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
