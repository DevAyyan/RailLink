"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface Schedule {
  id: number
  train_id: number
  dep_station_id: number
  departure_time: string
  arrival_station_id: number
  arrival_time: string
  status: 'On Time' | 'Delayed' | 'Cancelled'
  eco_price: number
  bus_price: number
  vip_price: number
  eco_left: number
  bus_left: number
  vip_left: number
}

const columns = [
  { key: "id", label: "ID" },
  { key: "train_id", label: "Train ID" },
  { key: "dep_station_id", label: "Departure Station" },
  { key: "departure_time", label: "Departure Time" },
  { key: "arrival_station_id", label: "Arrival Station" },
  { key: "arrival_time", label: "Arrival Time" },
  { 
    key: "status", 
    label: "Status",
    type: "select",
    options: ['On Time', 'Delayed', 'Cancelled']
  },
  { key: "eco_price", label: "Economy Price" },
  { key: "bus_price", label: "Business Price" },
  { key: "vip_price", label: "VIP Price" },
  { key: "eco_left", label: "Economy Seats Left" },
  { key: "bus_left", label: "Business Seats Left" },
  { key: "vip_left", label: "VIP Seats Left" }
]

const addFormFields = [
  { key: "train_id", label: "Train ID" },
  { key: "dep_station_id", label: "Departure Station" },
  { key: "departure_time", label: "Departure Time" },
  { key: "arrival_station_id", label: "Arrival Station" },
  { key: "arrival_time", label: "Arrival Time" },
  { key: "eco_price", label: "Economy Price" },
  { key: "bus_price", label: "Business Price" },
  { key: "vip_price", label: "VIP Price" }
]

export function SchedulesAdmin() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const { toast } = useToast()

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules")
      if (!response.ok) throw new Error("Failed to fetch schedules")
      const data = await response.json()
      setSchedules(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/schedules?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete schedule")
      await fetchSchedules()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add schedule")
      await fetchSchedules()
    } catch (error) {
      throw error
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("/api/schedules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (!response.ok) throw new Error("Failed to update status");
      await fetchSchedules();
      
      toast({
        title: "Success",
        description: "Schedule status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule status",
        variant: "destructive",
      });
    }
  };

  return (
    <DataTable
      title="Schedules"
      columns={columns}
      data={schedules}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
      onStatusChange={handleStatusChange}
    />
  )
}