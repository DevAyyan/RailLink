import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    console.log("Fetching users data...");

    const connection = await mysql.createConnection(connectionParams);

    const getUsersQuery = 'SELECT * FROM users';

    const [results, fields] = await connection.execute(getUsersQuery);

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

    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionParams);

    const insertQuery = 'INSERT INTO user (name, email, password, role, created_at) VALUES (?, ?, ?, ?, SYSDATE)';

    const [result] = await connection.execute(insertQuery, [name, email, password, role]);

    connection.end();

    return NextResponse.json({
      message: 'User inserted successfully',
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
