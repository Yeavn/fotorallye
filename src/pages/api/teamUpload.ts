// app/api/complete-task/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { team_id, task_id } = req.body;

    if (!team_id || typeof task_id !== 'number') {
        return res.status(400).json({ error: 'Ungültige Daten' });
    }

    try {
        const db = await mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Bestehende Aufgaben abrufen
        // Bestehende Aufgaben abrufenf
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM teams WHERE team_id = ?',
            [team_id]
        );

        console.log('Rows:', rows); // Debugging-Ausgabe

        rows[0].aufgaben.push(task_id);
        rows[0].punkte += 50;
        console.log('Updated numbers:', rows[0].aufgaben); // Debugging-Ausgabe
        await db.query('UPDATE teams SET aufgaben = ? WHERE team_id = ?', [JSON.stringify(rows[0].aufgaben), team_id])
        await db.query('UPDATE teams SET punkte = ? WHERE team_id = ?', [rows[0].punkte, team_id]);

        return res.status(200).json({ success: true, updatedTasks: rows[0].aufgaben });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ error: 'Datenbankverbindung fehlgeschlagen' });
        }
        return res.status(500).json({ error: 'Serverfehler' });
    }
}
