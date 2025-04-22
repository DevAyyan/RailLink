import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    console.log("Fetching railways data...");

    const connection = await mysql.createConnection(connectionParams);

    const getRailwaysQuery = 'SELECT * FROM railways';

    const [results, fields] = await connection.execute(getRailwaysQuery);

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

    const { station1Id, station2Id, distance } = body;

    if (!station1Id || !station2Id || !distance) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionParams);

    const insertQuery = 'INSERT INTO railways (station_1_id, station_2_id, distance_km) VALUES (?, ?, ?)';

    const [result] = await connection.execute(insertQuery, [station1Id, station2Id, distance]);

    connection.end();

    return NextResponse.json({
      message: 'Railway inserted successfully',
      result,
    });
  } catch (err) {
    console.log('ERROR: POST API - ', (err as Error).message);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
