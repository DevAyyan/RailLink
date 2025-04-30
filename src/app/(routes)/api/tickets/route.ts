import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { GetDBSettings, IDBSettings } from '@/sharedCode/commons';

let connectionParams: IDBSettings = GetDBSettings();

export async function GET(request: Request) {
  try {
    console.log("Fetching tickets data...");

    const connection = await mysql.createConnection(connectionParams);

    const getTicketsQuery = `SET SQL_SAFE_UPDATES = 0;
CALL UpdateTicketStatuses();
SET SQL_SAFE_UPDATES = 1;
SELECT * FROM tickets`;

    const [results, fields] = await connection.execute(getTicketsQuery);

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
    const { user_id, schedule_id, class: ticketClass } = body;

    if (!user_id || !schedule_id || !ticketClass) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure lowercase for validation and storage
    const lowerClass = ticketClass.toLowerCase();
    
    if (!['economy', 'business', 'vip'].includes(lowerClass)) {
      return NextResponse.json(
        { error: "Invalid ticket class" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    
    const [result] = await connection.execute(
      'INSERT INTO tickets (user_id, schedule_id, class, status, created_at) VALUES (?, ?, ?, ?, SYSDATE())',
      [user_id, schedule_id, lowerClass, 'booked']
    );

    connection.end();
    return NextResponse.json({ message: "Ticket added successfully", result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to add ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');
    const body = await request.json();
    const { status } = body;

    if (!ticketId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const connection = await mysql.createConnection(connectionParams);

    // Start a transaction
    await connection.beginTransaction();

    try {
      // Get the ticket information
      const [ticket] = await connection.execute(
        'SELECT * FROM tickets WHERE id = ?',
        [ticketId]
      ) as [any[], any];

      if (!ticket || ticket.length === 0) {
        await connection.rollback();
        connection.end();
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      const ticketData = ticket[0];

      // Update the ticket status
      const updateTicketQuery = 'UPDATE tickets SET status = ?, cancelled_at = ? WHERE id = ?';
      await connection.execute(
        updateTicketQuery,
        [status, status === 'cancelled' ? new Date() : null, ticketId]
      );

      // If the ticket is being cancelled, increment the available seats
      if (status === 'cancelled') {
        const updateSeatsQuery = `UPDATE schedules SET ${ticketData.class.toLowerCase()}_left = ${ticketData.class.toLowerCase()}_left + 1 WHERE id = ?`;
        await connection.execute(updateSeatsQuery, [ticketData.schedule_id]);
      }

      // Commit the transaction
      await connection.commit();

      connection.end();

      return NextResponse.json({
        message: 'Ticket updated successfully',
      });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    }
  } catch (err) {
    console.log('ERROR: PATCH API - ', (err as Error).message);

    return NextResponse.json(
      { error: (err as Error).message },
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
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(connectionParams);
    await connection.execute('DELETE FROM tickets WHERE id = ?', [id]);
    connection.end();

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
