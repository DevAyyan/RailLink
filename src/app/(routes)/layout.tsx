"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Stations", href: "/stations" },
  { name: "Trains", href: "/trains" },
  { name: "Booking", href: "/booking" },
  { name: "Railmap", href: "/railmap" },
  { name: "Membership", href: "/membership" },
]

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    const checkAuth = () => {
      const userStr = sessionStorage.getItem("user")
      const admin = sessionStorage.getItem("isAdmin")
      setIsLoggedIn(!!userStr)
      setIsAdmin(admin === "true")
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name)
      }
    }

    handleResize()
    checkAuth()

    window.addEventListener("resize", handleResize)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("isAdmin")
    setIsLoggedIn(false)
    setIsAdmin(false)
    setUserName("")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-lg p-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">RailLink</div>

          {!isMobile && (
            <div className="flex-1 flex justify-center">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-4 lg:gap-8 bg-gray-50 p-3 rounded-full shadow-md">
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className="text-gray-800 hover:text-blue-600 transition font-medium px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-100">
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600">Logged in as {userName}</span>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline">Admin Panel</Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 py-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-800 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isLoggedIn ? (
                    <>
                      <div className="text-sm text-gray-600 px-4 py-2">
                        Logged in as {userName}
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="text-gray-800 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-gray-800 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100 text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-gray-800 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="text-gray-800 hover:text-blue-600 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>

      <div
        className="relative h-screen flex items-center justify-center text-white bg-cover bg-center bg-black"
        style={{ backgroundImage: "url('/images/trainImage1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 w-full max-w-6xl px-4 pt-20">{children}</div>
      </div>
    </div>
  )
}
