import { BookingForm } from "@/components/booking/booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingPage() {
    return (
      <div className="flex flex-col relative container align-middle mt-96">
        <div className="mt-52">
          <h1 className="text-5xl font-bold tracking-tight mb-2">Book tickets</h1>
          <p className="text-lg opacity-80">Find and book train tickets for your journey</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-12">
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
    );
}
  