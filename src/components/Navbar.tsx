"use client";

import Link from "next/link";
import { Search, Moon, Sun, Menu, X, User, LogOut, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

export interface NavLink {
  label: string;
  href: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface NavbarProps {
  logo?: string;
  logoHref?: string;
  links?: NavLink[];
  showSearch?: boolean;
  showLanguage?: boolean;
  loginHref?: string;
  signupHref?: string;
  onMenuClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Navbar({
  logo = "BlogPlatform",
  logoHref = "/",
  links = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  showSearch = true,
  showLanguage = false,
  loginHref = "/auth/login",
  signupHref = "/auth/signup",
  onMenuClick,
  searchQuery = "",
  onSearchChange,
}: NavbarProps) {
  const themeContext = useTheme();
  const { theme, toggleTheme } = themeContext || {
    theme: "light",
    toggleTheme: () => {},
  };
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Use the prop if provided, otherwise use internal state
  const currentSearchQuery =
    onSearchChange !== undefined ? searchQuery : internalSearchQuery;

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setInternalSearchQuery(query);
    }
  };

  // Handle scroll event to add blur effect and close dropdown
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Close dropdown if scrolling and it's open
      setIsDropdownOpen((prev) => (prev ? false : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in on mount and from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const logged = localStorage.getItem("isLoggedIn") === "true";
      const userData = localStorage.getItem("user");

      setIsLoggedIn(logged);

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 will-change-transform"
      style={{
        // Solid background initially, animated on scroll for all screen sizes
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 1)",
        borderBottom: isScrolled
          ? "1px solid rgba(188, 204, 220, 0.5)"
          : "1px solid rgba(188, 204, 220, 0.2)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        boxShadow: isScrolled
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
        borderRadius: isScrolled ? "50px" : "0",
        margin: isScrolled ? "0 10px" : "0",
        transform: isScrolled ? "translateY(10px)" : "translateY(0)",
        transition:
          "transform 300ms ease, background-color 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease, box-shadow 300ms ease, border-radius 300ms ease, margin 300ms ease",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-2 shrink-0">
            <span
              className="font-bold text-xl md:text-2xl tracking-tight"
              style={{ color: "#1F3A51" }}
            >
              {logo}
            </span>
          </Link>

          {/* Center - Search Bar (Desktop only) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={currentSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border-2 focus:outline-none focus:ring-2 focus:border-transparent text-sm shadow-md transition"
                  style={
                    {
                      borderColor: "#BCCCDC",
                      backgroundColor: "#F8FAFC",
                      color: "#1F3A51",
                      "--tw-ring-color": "#D9EAFD",
                    } as React.CSSProperties
                  }
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#9AA6B2" }}
                />
              </div>
            </div>
          )}

          {/* Right side - Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* GitHub Icon - Desktop only */}
            <a
              href="https://github.com/armannhansda/Blog-Platform-"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition transform hover:scale-110"
              aria-label="Visit GitHub repository"
              title="Visit GitHub repository"
              style={{ color: "#1F3A51" }}
            >
              <Github className="w-5 h-5" />
            </a>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition transform hover:scale-110"
              aria-label="Toggle dark mode"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              style={{ color: "#000000" }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Show user profile or login/signup based on auth state */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2.5 rounded-full transition flex items-center gap-2 transform hover:scale-105"
                  title={user.name}
                  style={{ color: "#1F3A51", backgroundColor: "#F8FAFC" }}
                >
                  <User className="w-5 h-5" />
                  {/* <span className="text-sm font-semibold">
            {user.name?.split(" ")[0]}
            </span> */}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xs z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9EAFD",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* User Info Section */}
                    <div
                      className="px-5 py-4 border-b backdrop-blur-sm"
                      style={{
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        borderColor: "#E8F0F8",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: "#3B82F6" }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold truncate"
                            style={{ color: "#1F3A51" }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: "#5A6B78" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 px-2">
                      <Link
                        href="/profile"
                        className="flex px-3 py-2.5 text-sm transition items-center gap-3 rounded-lg font-semibold mb-1"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          color: "#1F3A51",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#F0F6FF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "#D9EAFD" }}
                        >
                          <User
                            className="w-4 h-4"
                            style={{ color: "#3B82F6" }}
                          />
                        </div>
                        <span>My Profile</span>
                      </Link>

                      <hr style={{ borderColor: "#E8F0F8", margin: "6px 0" }} />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-sm transition flex items-center gap-3 rounded-lg font-semibold"
                        style={{
                          color: "#EF4444",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#FEE2E2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "#FECACA" }}
                        >
                          <LogOut
                            className="w-4 h-4"
                            style={{ color: "#DC2626" }}
                          />
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Sign Up Button */}
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full font-bold transition-all duration-300 text-sm shadow-lg transform hover:scale-101 hover:text-blue-300 group flex items-center justify-center gap-0 hover:gap-2 overflow-hidden"
                  style={{ backgroundColor: "#D9EAFD", color: "#1F3A51" }}
                >
                  log in
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button & quick icons */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-full transition transform hover:scale-110"
              aria-label="Open search"
              title="Search posts"
              style={{ color: "#1F3A51" }}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition transform hover:scale-110"
              aria-label="Toggle dark mode"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              style={{ color: "#9AA6B2" }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full transition transform hover:scale-110"
              aria-label="Toggle mobile menu"
              style={{ color: "#1F3A51" }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Shows only when search icon clicked */}
        {isMobileSearchOpen && (
          <div
            className="md:hidden mt-4 pb-4 border-t pt-4 animate-in fade-in duration-200"
            style={{ borderColor: "#BCCCDC" }}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search posts..."
                value={currentSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                style={
                  {
                    borderColor: "#BCCCDC",
                    backgroundColor: "#F8FAFC",
                    color: "#1F3A51",
                    "--tw-ring-color": "#D9EAFD",
                  } as React.CSSProperties
                }
                autoFocus
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#9AA6B2" }}
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden mt-4 pb-4 border-t pt-4 animate-in fade-in duration-200"
            style={{ borderColor: "#BCCCDC" }}
          >
            <div className="flex flex-col gap-3">
              {isLoggedIn && user ? (
                <>
                  {/* Mobile User Profile Dropdown */}
                  <div
                    className="border-t pt-3 mt-2 rounded-xl overflow-hidden"
                    style={{
                      borderColor: "#BCCCDC",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    {/* User Info Section */}
                    <div
                      className="px-4 py-3 border-b mb-2"
                      style={{
                        backgroundColor: "rgba(248, 250, 252, 0.9)",
                        borderColor: "#E8F0F8",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                          style={{ backgroundColor: "#3B82F6" }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold truncate"
                            style={{ color: "#1F3A51" }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: "#5A6B78" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Link */}
                    <Link
                      href="/profile"
                      className="flex font-semibold transition text-sm py-3 px-4 items-center gap-3 rounded-lg mx-2 mb-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        color: "#1F3A51",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F0F6FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#D9EAFD" }}
                      >
                        <User
                          className="w-4 h-4"
                          style={{ color: "#3B82F6" }}
                        />
                      </div>
                      <span>My Profile</span>
                    </Link>

                    {/* Divider */}
                    <hr
                      style={{
                        borderColor: "#E8F0F8",
                        margin: "6px 8px",
                      }}
                    />

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left font-semibold transition text-sm py-3 px-4 flex items-center gap-3 rounded-lg mx-2 mb-1"
                      style={{
                        color: "#EF4444",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#FEE2E2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#FECACA" }}
                      >
                        <LogOut
                          className="w-4 h-4"
                          style={{ color: "#DC2626" }}
                        />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-semibold transition text-sm py-2.5 hover:opacity-80 transform hover:scale-105 inline-block rounded-lg px-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ color: "#1F3A51" }}
                  >
                    Log in
                  </Link>

                  <Link
                    href="/signup"
                    className="px-6 py-3 rounded-full font-bold transition text-sm shadow-lg text-center transform hover:scale-105"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ backgroundColor: "#D9EAFD", color: "#1F3A51" }}
                  >
                    sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
