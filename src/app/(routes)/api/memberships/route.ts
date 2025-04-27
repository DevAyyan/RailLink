import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, tier, expiry_date } = body;

    if (!user_id || !tier || !expiry_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!['Economy', 'Business', 'VIP'].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid membership tier" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      'INSERT INTO memberships (user_id, tier, expiry_date) VALUES (?, ?, ?)',
      [user_id, tier, expiry_date]
    );

    connection.end();
    return NextResponse.json({ message: "Membership added successfully", result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to add membership" },
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
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    await connection.execute('DELETE FROM memberships WHERE id = ?', [id]);
    connection.end();

    return NextResponse.json({ message: "Membership deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to delete membership" },
      { status: 500 }
    );
  }
} 