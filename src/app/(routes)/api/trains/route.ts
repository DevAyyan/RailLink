import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    console.log("Fetching trains data...");

    const connection = await mysql.createConnection(connectionParams);

    const getTrainsQuery = 'SELECT * FROM trains';

    const [results, fields] = await connection.execute(getTrainsQuery);

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

    const { name, eco_max, bus_max, vip_max, speed, type } = body;

    if (!name || !eco_max || !bus_max || !vip_max || !speed || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionParams);

    const insertQuery = 'INSERT INTO trains (name, eco_max, bus_max, vip_max, speed, type) VALUES (?, ?, ?, ?, ?, ?)';

    const [result] = await connection.execute(insertQuery, [name, eco_max, bus_max, vip_max, speed, type]);

    connection.end();

    return NextResponse.json({
      message: 'Train inserted successfully',
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
