"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface TrainRoute {
  id: number
  train_id: number
  railway_id: number
  sequence: number
}

const columns = [
  { key: "id", label: "ID" },
  { key: "train_id", label: "Train ID" },
  { key: "railway_id", label: "Railway ID" },
  { key: "sequence", label: "Sequence" },
]

const addFormFields = [
  { key: "train_id", label: "Train ID" },
  { key: "railway_id", label: "Railway ID" },
  { key: "sequence", label: "Sequence" },
]

export function TrainRoutesAdmin() {
  const [routes, setRoutes] = useState<TrainRoute[]>([])
  const { toast } = useToast()

  const fetchRoutes = async () => {
    try {
      const response = await fetch("/api/train-routes")
      if (!response.ok) throw new Error("Failed to fetch train routes")
      const data = await response.json()
      setRoutes(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch train routes",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/train-routes?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete train route")
      await fetchRoutes()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/train-routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add train route")
      await fetchRoutes()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Train Routes"
      columns={columns}
      data={routes}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}