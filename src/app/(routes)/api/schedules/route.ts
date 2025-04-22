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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { 
      train_id, 
      dep_station_id, 
      departure_time, 
      arrival_station_id, 
      arrival_time, 
      status = 'On Time',
      eco_price, 
      bus_price, 
      vip_price 
    } = body;

    // Validate required fields
    if (!train_id || !dep_station_id || !departure_time || !arrival_station_id || !arrival_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate status
    if (!['On Time', 'Delayed', 'Cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionParams);

    // Check if train exists
    const [trainCheck] = await connection.execute(
      'SELECT id FROM trains WHERE id = ?',
      [train_id]
    ) as [any[], any];

    if (!trainCheck || trainCheck.length === 0) {
      connection.end();
      return NextResponse.json({ error: 'Train not found' }, { status: 404 });
    }

    // Check if stations exist
    const [stationsCheck] = await connection.execute(
      'SELECT id FROM stations WHERE id IN (?, ?)',
      [dep_station_id, arrival_station_id]
    ) as [any[], any];

    if (!stationsCheck || stationsCheck.length !== 2) {
      connection.end();
      return NextResponse.json({ error: 'One or both stations not found' }, { status: 404 });
    }

    // Insert schedule
    const insertQuery = `
      INSERT INTO schedules (train_id, dep_station_id, departure_time, arrival_station_id, arrival_time, status, eco_price, bus_price, vip_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

    `;

    const [result] = await connection.execute(insertQuery, [
      train_id, 
      dep_station_id, 
      departure_time, 
      arrival_station_id, 
      arrival_time, 
      status, 
      eco_price, 
      bus_price, 
      vip_price
    ]);

    connection.end();

    return NextResponse.json({
      message: 'Schedule created successfully',
      result,
    });
  } catch (err) {
    console.log('ERROR: PUT API - ', (err as Error).message);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
