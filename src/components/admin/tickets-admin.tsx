"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: number
  user_id: number
  schedule_id: number
  class: string
  status: string
  cancelled_at: string | null
  created_at: string
}

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "schedule_id", label: "Schedule ID" },
  { key: "class", label: "Class" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "cancelled_at", label: "Cancelled At" }
]

const addFormFields = [
  { key: "user_id", label: "User ID" },
  { key: "schedule_id", label: "Schedule ID" },
  { key: "class", label: "Class", type: "select", options: ["Economy", "Business", "VIP"] }
]

export function TicketsAdmin() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const { toast } = useToast()

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets")
      if (!response.ok) throw new Error("Failed to fetch tickets")
      const data = await response.json()
      setTickets(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/tickets?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete ticket")
      await fetchTickets()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add ticket")
      await fetchTickets()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Tickets"
      columns={columns}
      data={tickets}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}