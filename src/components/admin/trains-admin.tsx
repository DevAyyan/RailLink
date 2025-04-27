"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Train {
  id: number
  name: string
  type: string
  eco_max: number
  bus_max: number
  vip_max: number
}

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "eco_max", label: "Economy Capacity" },
  { key: "bus_max", label: "Business Capacity" },
  { key: "vip_max", label: "VIP Capacity" },
]

const addFormFields = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "eco_max", label: "Economy Capacity" },
  { key: "bus_max", label: "Business Capacity" },
  { key: "vip_max", label: "VIP Capacity" },
]

export function TrainsAdmin() {
  const [trains, setTrains] = useState<Train[]>([])
  const { toast } = useToast()

  const fetchTrains = async () => {
    try {
      const response = await fetch("/api/trains")
      if (!response.ok) throw new Error("Failed to fetch trains")
      const data = await response.json()
      setTrains(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch trains",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchTrains()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/trains?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete train")
      await fetchTrains() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/trains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add train")
      await fetchTrains() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Trains"
      columns={columns}
      data={trains}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}