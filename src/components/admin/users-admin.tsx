"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: string
}

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "created_at", label: "Creation date:"},
]

const addFormFields = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "password", label: "Password" },
  { key: "role", label: "Role" },
]

export function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete user")
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add user")
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  return (
    <DataTable
      title="Users"
      columns={columns}
      data={users}
      onDelete={handleDelete}
      onAdd={handleAdd}
      addFormFields={addFormFields}
    />
  )
}