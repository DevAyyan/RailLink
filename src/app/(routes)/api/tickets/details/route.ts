import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Connecting to database...');
    connection = await mysql.createConnection(connectionParams);
    console.log('Database connection established');

    // First verify if the user exists
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    ) as [any[], any];

    if (!users || users.length === 0) {
      console.log('User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found, fetching tickets...');

    try {
      // Update ticket statuses
      console.log('Updating ticket statuses...');
      await connection.execute('SET SQL_SAFE_UPDATES = 0');
      await connection.execute('CALL UpdateTicketStatuses()');
      await connection.execute('SET SQL_SAFE_UPDATES = 1');
      console.log('Ticket statuses updated successfully');
    } catch (updateError) {
      console.error('Error updating ticket statuses:', updateError);
    }

    // Fetch tickets
    const getTicketsQuery = `
      SELECT 
        t.id as ticket_id,
        t.class as ticket_class,
        t.status as ticket_status,
        t.created_at as ticket_created_at,
        t.cancelled_at as ticket_cancelled_at,
        s.id as schedule_id,
        s.departure_time,
        s.arrival_time,
        s.status as schedule_status,
        s.eco_price,
        s.bus_price,
        s.vip_price,
        s.eco_left,
        s.bus_left,
        s.vip_left,
        tr.id as train_id,
        tr.name as train_name,
        tr.type as train_type,
        ds.id as departure_station_id,
        ds.name as departure_station_name,
        ds.city as departure_station_city,
        ss.id as arrival_station_id,
        ss.name as arrival_station_name,
        ss.city as arrival_station_city,
        p.id as payment_id,
        p.payment_status,
        p.amount as payment_amount
      FROM tickets t
      LEFT JOIN schedules s ON t.schedule_id = s.id
      LEFT JOIN trains tr ON s.train_id = tr.id
      LEFT JOIN stations ds ON s.dep_station_id = ds.id
      LEFT JOIN stations ss ON s.arrival_station_id = ss.id
      LEFT JOIN payments p ON t.id = p.ticket_id
      WHERE t.user_id = ?
      ORDER BY s.departure_time DESC
    `;

    console.log('Executing query with userId:', userId);
    const [results] = await connection.execute(getTicketsQuery, [userId]) as [any[], any];
    console.log('Query executed successfully, results:', results);

    if (!results || results.length === 0) {
      console.log('No tickets found for user:', userId);
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('ERROR: API - ', err);
    console.error('Error details:', {
      message: (err as Error).message,
      stack: (err as Error).stack
    });

    // Return a more specific error message
    const errorMessage = (err as Error).message.includes('UpdateTicketStatuses')
      ? 'Error updating ticket statuses'
      : (err as Error).message.includes('schedules')
      ? 'Error fetching schedule information'
      : (err as Error).message.includes('trains')
      ? 'Error fetching train information'
      : (err as Error).message.includes('stations')
      ? 'Error fetching station information'
      : 'Failed to load tickets';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
} 