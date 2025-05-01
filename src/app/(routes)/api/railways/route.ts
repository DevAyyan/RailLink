import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const [results] = await connection.execute(`
      SELECT * FROM railways`);
    connection.end();
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch railways" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { station_1_id, station_2_id, distance_km } = body;

    if (!station_1_id || !station_2_id || !distance_km) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      'INSERT INTO railways (station_1_id, station_2_id, distance_km) VALUES (?, ?, ?)',
      [station_1_id, station_2_id, distance_km]
    );

    connection.end();

    return NextResponse.json({ message: "Railway added successfully", result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to add railway" },
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
        { error: "Railway ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    await connection.execute('DELETE FROM railways WHERE id = ?', [id]);
    connection.end();

    return NextResponse.json({ message: "Railway deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to delete railway" },
      { status: 500 }
    );
  }
}
