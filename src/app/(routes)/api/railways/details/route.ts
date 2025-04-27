import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionParams);

    const getRailwaysQuery = `
      SELECT 
        r.id,
        r.station1_id,
        r.station2_id,
        r.distance,
        s1.name as from_station_name,
        s1.city as from_station_city,
        s2.name as to_station_name,
        s2.city as to_station_city
      FROM railways r
      JOIN stations s1 ON r.station1_id = s1.id
      JOIN stations s2 ON r.station2_id = s2.id
      ORDER BY r.id
    `;

    const [results] = await connection.execute(getRailwaysQuery);
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