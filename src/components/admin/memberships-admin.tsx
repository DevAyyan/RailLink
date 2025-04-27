"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Membership {
  id: number
  user_id: number
  tier: string
  expiry_date: string
}

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "tier", label: "Tier" },
  { key: "expiry_date", label: "Expiry Date" }
]

const addFormFields = [
  { key: "user_id", label: "User ID" },
  { key: "tier", label: "Tier", type: "select", options: ["Economy", "Business", "VIP"] },
  { key: "expiry_date", label: "Expiry Date", type: "date" }
]

export function MembershipsAdmin() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const { toast } = useToast()

  const fetchMemberships = async () => {
    try {
      const response = await fetch("/api/memberships")
      if (!response.ok) throw new Error("Failed to fetch memberships")
      const data = await response.json()
      setMemberships(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch memberships",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchMemberships()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/memberships?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete membership")
      await fetchMemberships()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add membership")
      await fetchMemberships()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Memberships"
      columns={columns}
      data={memberships}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}