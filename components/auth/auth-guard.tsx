"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { hasRole } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "user" | "underwriter" | "admin"
}

export function AuthGuard({ children, requiredRole = "user" }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Auth check function
    const authCheck = async () => {
      // If still loading auth state, wait
      if (isLoading) return

      // If no user and not on auth pages, redirect to login
      if (!user) {
        if (
          !pathname.startsWith("/login") &&
          !pathname.startsWith("/signup") &&
          !pathname.startsWith("/reset-password")
        ) {
          router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)
        } else {
          setAuthorized(true)
        }
        setChecking(false)
        return
      }

      // If user exists and on auth pages, redirect to dashboard
      if (
        user &&
        (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/reset-password"))
      ) {
        router.push("/dashboard")
        setChecking(false)
        return
      }

      // Check role-based access
      if (requiredRole) {
        const hasAccess = await hasRole(requiredRole)
        if (!hasAccess) {
          router.push("/unauthorized")
          setChecking(false)
          return
        }
      }

      setAuthorized(true)
      setChecking(false)
    }

    authCheck()
  }, [isLoading, user, pathname, router, requiredRole])

  // Show loading indicator while checking auth
  if (isLoading || checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If authorized, render children
  return authorized ? <>{children}</> : null
}

