"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Railway {
  id: number
  station_1_id: number
  station_2_id: number
  distance_km: number
}

const columns = [
  { key: "id", label: "ID" },
  { key: "station_1_id", label: "From Station ID" },
  { key: "station_2_id", label: "To Station ID" },
  { key: "distance_km", label: "Distance (km)" }
]

const addFormFields = [
  { key: "station_1_id", label: "From Station ID" },
  { key: "station_2_id", label: "To Station ID" },
  { key: "distance_km", label: "Distance (km)" }
]

export function RailwaysAdmin() {
  const [railways, setRailways] = useState<Railway[]>([])
  const { toast } = useToast()

  const fetchRailways = async () => {
    try {
      const response = await fetch("/api/railways")
      if (!response.ok) throw new Error("Failed to fetch railways")
      const data = await response.json()
      setRailways(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch railways",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchRailways()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/railways?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete railway")
      await fetchRailways()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/railways", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add railway")
      await fetchRailways()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Railways"
      columns={columns}
      data={railways}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}