"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = sessionStorage.getItem("user")
    const isAdmin = sessionStorage.getItem("isAdmin") === "true"

    if (!user) {
      router.push("/login")
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push("/")
      return
    }

    setIsLoading(false)
  }, [router, requireAdmin])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
} 