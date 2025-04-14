"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowRight, Clock, CreditCard, Train } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface SearchResultsProps {
  results: any[]
  selectedClass: string
  date: Date
  fromCity: string
  toCity: string
  fromStation: string
  toStation: string
}

export function SearchResults({
  results,
  selectedClass,
  date,
  fromCity,
  toCity,
  fromStation,
  toStation,
}: SearchResultsProps) {
  const [selectedTrain, setSelectedTrain] = useState<any | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()

  const handleBook = (train: any) => {
    setSelectedTrain(train)
    setShowConfirmation(true)
  }

  const confirmBooking = async () => {
    if (!selectedTrain) return

    setIsBooking(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsBooking(false)
    setShowConfirmation(false)

    toast({
      title: "Ticket Booked Successfully!",
      description: `Your ticket for ${selectedTrain.trainName} (${selectedTrain.trainNumber}) has been booked.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Search Results</h3>
        <Badge variant="outline">{format(date, "EEEE, MMMM d, yyyy")}</Badge>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {fromCity} ({fromStation}) to {toCity} ({toStation})
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>No trains found for the selected route and date.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((train) => (
            <Card key={train.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Train className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <span className="font-semibold">{train.trainName}</span>
                        <span className="text-sm text-muted-foreground ml-2">({train.trainNumber})</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{train.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{train.departureTime}</div>
                      <div className="text-sm text-muted-foreground">{fromStation}</div>
                    </div>

                    <div className="flex-1 mx-4 flex items-center">
                      <div className="h-[2px] flex-1 bg-border relative">
                        <div className="absolute -top-[9px] left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                      </div>
                      <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    </div>

                    <div className="space-y-1 text-right">
                      <div className="text-2xl font-bold">{train.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">{toStation}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="font-medium">Rs. {train.price[selectedClass]}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {train.availableSeats[selectedClass]} seats available
                      </div>
                    </div>

                    <Button onClick={() => handleBook(train)}>Book Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>Please review your booking details before confirming.</DialogDescription>
          </DialogHeader>

          {selectedTrain && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Train</p>
                  <p className="font-medium">
                    {selectedTrain.trainName} ({selectedTrain.trainNumber})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(date, "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">
                    {fromStation}, {fromCity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium">
                    {toStation}, {toCity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-medium">{selectedTrain.departureTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrival</p>
                  <p className="font-medium">{selectedTrain.arrivalTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium capitalize">{selectedClass}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">Rs. {selectedTrain.price[selectedClass]}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking} disabled={isBooking}>
              {isBooking ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

