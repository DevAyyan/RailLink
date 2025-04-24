"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-6">
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
            <p className="text-muted-foreground">
              This is your personal dashboard where you can manage your bookings and account.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
  