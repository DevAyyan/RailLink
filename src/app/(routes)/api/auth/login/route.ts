import { NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons'

let connectionParams: IDBSettings = GetDBSettings()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const connection = await mysql.createConnection(connectionParams)

    const [users] = await connection.execute(
      "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
      [email, password]
    ) as [any[], any]

    connection.end()

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const user = users[0]
    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
} 