"use client"

import { BookingForm } from "@/components/booking/booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function BookingPage() {
    return (
      <ProtectedRoute>
        <div className="min-h-[calc(100vh-4rem)] pt-8">
          <div className="flex flex-col max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Book Your Journey</h1>
              <p className="text-lg opacity-80">Find and book train tickets for your journey</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Ticket Booking</CardTitle>
                  <CardDescription>Enter your journey details to find available trains</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
}
  