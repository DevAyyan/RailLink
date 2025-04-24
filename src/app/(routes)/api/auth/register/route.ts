import { NextResponse } from "next/server"
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons'

let connectionParams: IDBSettings = GetDBSettings()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const connection = await mysql.createConnection(connectionParams)

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ) as [any[], any]

    if (existingUsers && existingUsers.length > 0) {
      connection.end()
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Insert new user with default role 'guest'
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'guest')",
      [name, email, password]
    ) as [any, any]

    connection.end()

    return NextResponse.json({
      message: "User registered successfully",
      userId: result.insertId
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    )
  }
} 