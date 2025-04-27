"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  id: number
  user_id: number
  ticket_id: number
  amount: number
  payment_status: string
  transaction_id: string
  created_at: string
}

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "ticket_id", label: "Ticket ID" },
  { key: "amount", label: "Amount" },
  { key: "payment_status", label: "Status" },
  { key: "transaction_id", label: "Transaction ID" },
  { key: "created_at", label: "Created At" }
]

const addFormFields = [
  { key: "user_id", label: "User ID" },
  { key: "ticket_id", label: "Ticket ID" },
  { key: "amount", label: "Amount" },
  { key: "transaction_id", label: "Transaction ID" }
]

export function PaymentsAdmin() {
  const [payments, setPayments] = useState<Payment[]>([])
  const { toast } = useToast()

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (!response.ok) throw new Error("Failed to fetch payments")
      const data = await response.json()
      setPayments(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/payments?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete payment")
      await fetchPayments()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add payment")
      await fetchPayments()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Payments"
      columns={columns}
      data={payments}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}