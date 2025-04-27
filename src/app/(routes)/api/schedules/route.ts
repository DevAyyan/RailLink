import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    console.log("Fetching schedules data...");

    const connection = await mysql.createConnection(connectionParams);

    const getSchedulesQuery = 'SELECT * FROM schedules';

    const [results, fields] = await connection.execute(getSchedulesQuery);

    connection.end();

    return NextResponse.json({ fields: fields.map((f) => f.name), results });
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message);

    const response = {
      error: (err as Error).message,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      train_id, 
      dep_station_id, 
      departure_time, 
      arrival_station_id, 
      arrival_time,
      status,
      eco_price,
      bus_price,
      vip_price
    } = body;

    if (!train_id || !dep_station_id || !departure_time || 
        !arrival_station_id || !arrival_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      `INSERT INTO schedules (
        train_id, dep_station_id, departure_time, 
        arrival_station_id, arrival_time, status,
        eco_price, bus_price, vip_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        train_id, 
        dep_station_id, 
        departure_time,
        arrival_station_id, 
        arrival_time, 
        status || 'On Time',
        eco_price || 0, 
        bus_price || 0, 
        vip_price || 0
      ]
    );

    connection.end();
    return NextResponse.json({ message: "Schedule added successfully", result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to add schedule" },
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
        { error: "Schedule ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    await connection.execute('DELETE FROM schedules WHERE id = ?', [id]);
    connection.end();

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Schedule ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    if (!['On Time', 'Delayed', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    await connection.execute(
      'UPDATE schedules SET status = ? WHERE id = ?',
      [status, id]
    );
    connection.end();

    return NextResponse.json({ message: "Schedule status updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update schedule status" },
      { status: 500 }
    );
  }
}
