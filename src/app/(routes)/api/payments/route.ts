import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, ticket_id, amount, transaction_id } = body;

    if (!ticket_id || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      'INSERT INTO payments (ticket_id, amount) VALUES (?, ?)',
      [ticket_id, amount]
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, payment_status } = body;

    if (!id || !payment_status) {
      return NextResponse.json(
        { error: "Payment ID and status are required" },
        { status: 400 }
      );
    }

    // Validate payment status
    if (!['Pending', 'Completed', 'Failed'].includes(payment_status)) {
      return NextResponse.json(
        { error: "Invalid payment status. Must be 'Pending', 'Completed', or 'Failed'" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      'UPDATE payments SET payment_status = ?, paid_at = ? WHERE id = ?',
      [payment_status, payment_status === 'Completed' ? new Date() : null, id]
    );

    connection.end();

    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Payment status updated successfully",
      result 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
} 