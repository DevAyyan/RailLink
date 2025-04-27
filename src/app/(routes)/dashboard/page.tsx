"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserTickets } from "@/components/dashboard/user-tickets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] pt-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Tickets</CardTitle>
              <CardDescription>View and manage your booked tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTickets />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
  