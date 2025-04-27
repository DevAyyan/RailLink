import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, ticket_id, amount, transaction_id } = body;

    if (!user_id || !ticket_id || !amount || !transaction_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      'INSERT INTO payments (user_id, ticket_id, amount, transaction_id) VALUES (?, ?, ?, ?)',
      [user_id, ticket_id, amount, transaction_id]
    );

    connection.end();
    return NextResponse.json({ message: "Payment added successfully", result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to add payment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    await connection.execute('DELETE FROM payments WHERE id = ?', [id]);
    connection.end();

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
} 