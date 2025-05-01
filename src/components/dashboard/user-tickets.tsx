"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Train, Calendar, MapPin, Clock } from "lucide-react"

interface Ticket {
  ticket_id: number
  ticket_class: 'Economy' | 'Business' | 'VIP'
  ticket_status: 'Booked' | 'Cancelled' | 'Completed'
  ticket_created_at: string
  ticket_cancelled_at: string | null
  schedule_id: number
  departure_time: string
  arrival_time: string
  schedule_status: 'On Time' | 'Delayed' | 'Cancelled'
  eco_price: number
  bus_price: number
  vip_price: number
  eco_left: number
  bus_left: number
  vip_left: number
  train_id: number
  train_name: string
  train_type: 'Metro' | 'Intercity'
  departure_station_id: number
  departure_station_name: string
  departure_station_city: string
  arrival_station_id: number
  arrival_station_name: string
  arrival_station_city: string
  payment_id: number | null
  payment_status: 'Pending' | 'Completed' | 'Failed' | null
  payment_amount: number | null
  paid_at: string | null
}

export function UserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userStr = sessionStorage.getItem("user")
        if (!userStr) {
          setError("Please login to view your tickets")
          return
        }

        const user = JSON.parse(userStr)
        const response = await fetch(`/api/tickets/details?user_id=${user.id}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch tickets")
        }

        const data = await response.json()
        setTickets(data.results)
      } catch (error) {
        console.error("Error fetching tickets:", error)
        setError("Failed to load tickets. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleCancelTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/tickets?id=${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Cancelled'
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel ticket")
      }

      // Update the tickets list
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.ticket_id === ticketId
            ? { ...ticket, ticket_status: 'Cancelled', ticket_cancelled_at: new Date().toISOString() }
            : ticket
        )
      )

      toast({
        title: "Success",
        description: "Ticket cancelled successfully",
      })
    } catch (error) {
      console.error("Error cancelling ticket:", error)
      toast({
        title: "Error",
        description: "Failed to cancel ticket. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePayment = async (ticket: Ticket) => {
    try {
      const userStr = sessionStorage.getItem("user")
      if (!userStr) {
        toast({
          title: "Error",
          description: "Please login to make a payment",
          variant: "destructive",
        })
        return
      }

      const user = JSON.parse(userStr)
      const amount = ticket.ticket_class === 'Economy' ? ticket.eco_price :
                    ticket.ticket_class === 'Business' ? ticket.bus_price :
                    ticket.vip_price

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ticket_id: ticket.ticket_id,
          amount: amount
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process payment')
      }

      // Refresh tickets to show updated payment status
      const ticketsResponse = await fetch(`/api/tickets/details?user_id=${user.id}`)
      if (!ticketsResponse.ok) {
        throw new Error('Failed to refresh tickets')
      }
      const data = await ticketsResponse.json()
      setTickets(data.results)

      toast({
        title: "Success",
        description: "Payment processed successfully",
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-green-500'
      case 'Cancelled':
        return 'bg-red-500'
      case 'Completed':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTicketClassColor = (ticketClass: string) => {
    switch (ticketClass) {
      case 'Economy':
        return 'bg-gray-100 text-gray-800'
      case 'Business':
        return 'bg-blue-100 text-blue-800'
      case 'VIP':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-800'
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string | null) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tickets...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>You haven't booked any tickets yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => (
        <Card
          key={`ticket-${ticket.ticket_id}-${index}`}
          className={`${
            ticket.ticket_status !== 'Booked' ? 'opacity-60' : ''
          } transition-opacity`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{ticket.train_name}</span>
                  <Badge className={getStatusColor(ticket.ticket_status)}>
                    {ticket.ticket_status}
                  </Badge>
                  <Badge variant="outline" className={getTicketClassColor(ticket.ticket_class)}>
                    {ticket.ticket_class}
                  </Badge>
                  <Badge variant="outline" className={getScheduleStatusColor(ticket.schedule_status)}>
                    {ticket.schedule_status}
                  </Badge>
                  {ticket.payment_status && (
                    <Badge variant="outline" className={getPaymentStatusColor(ticket.payment_status)}>
                      Payment: {ticket.payment_status}
                      {ticket.payment_amount && typeof ticket.payment_amount === 'number' && 
                        ` ($${Number(ticket.payment_amount).toFixed(2)})`}
                      {ticket.paid_at && ticket.payment_status === 'Completed' && 
                        ` - Paid on ${format(new Date(ticket.paid_at), "MMM d, yyyy")}`}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {ticket.departure_station_name}, {ticket.departure_station_city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Departure: {format(new Date(ticket.departure_time), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Time: {format(new Date(ticket.departure_time), "HH:mm")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {ticket.arrival_station_name}, {ticket.arrival_station_city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Arrival: {format(new Date(ticket.arrival_time), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Time: {format(new Date(ticket.arrival_time), "HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {ticket.ticket_status === 'Booked' && (
                <div className="flex gap-2">
                  {!ticket.payment_status && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePayment(ticket)}
                    >
                      Pay Now
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelTicket(ticket.ticket_id)}
                  >
                    Cancel Ticket
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 