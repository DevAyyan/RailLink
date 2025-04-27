"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Station {
  id: number
  name: string
  city: string
}

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "city", label: "City" },
]

const addFormFields = [
  { key: "name", label: "Name" },
  { key: "city", label: "City" },
]

export function StationsAdmin() {
  const [stations, setStations] = useState<Station[]>([])
  const { toast } = useToast()

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/stations")
      if (!response.ok) throw new Error("Failed to fetch stations")
      const data = await response.json()
      setStations(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch stations",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchStations()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/stations?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete station")
      await fetchStations()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add station")
      await fetchStations()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Stations"
      columns={columns}
      data={stations}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}