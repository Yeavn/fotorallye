// app/api/complete-task/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

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
        const [rows] = await db.query(
            'SELECT aufgaben FROM teams WHERE team_id = ?',
            [team_id]
        );

        if ((rows as any[]).length === 0) {
            return res.status(404).json({ error: 'Team nicht gefunden' });
        }

        const aufgabenRaw = (rows as any[])[0].aufgaben;
        let currentTasks: number[] = [];

        if (aufgabenRaw) {
            try {
                const parsed = JSON.parse(aufgabenRaw);
                if (Array.isArray(parsed)) {
                    currentTasks = parsed;
                } else if (typeof parsed === 'number') {
                    currentTasks = [parsed];
                } else {
                    currentTasks = [];
                }
            } catch {
                currentTasks = [];
            }
        }

        if (!currentTasks.includes(task_id)) {
            currentTasks.push(task_id);

            await db.execute(
                'UPDATE teams SET aufgaben = ? WHERE team_id = ?',
                [JSON.stringify(currentTasks), team_id]
            );
        }

        return res.status(200).json({ success: true, updatedTasks: currentTasks });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ error: 'Datenbankverbindung fehlgeschlagen' });
        }
        return res.status(500).json({ error: 'Serverfehler' });
    }
}
