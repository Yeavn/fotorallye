import db from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

type Team = {
    id: number;
    team_id: string;
    team_name: string;
    punkte: number;
    task_id: number;
}

type ErrorResponse = {
    error: string;
    message?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Team[] | ErrorResponse>
) {
    try {
        switch (req.method) {
            case 'GET':
                return await handleGet(req, res);
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse<Team[] | ErrorResponse>
) {
    const team_id = req.query.team_id as string;
    if (!team_id) {
        return res.status(400).json({ error: 'Team ID is required' });
    }
    try {
        const result = await db.query('SELECT * FROM teams WHERE team_id = ?', [team_id]);
        const rows = Array.isArray(result[0]) ? result[0] : [];
        // Immer ein Array zurückgeben, auch wenn leer
        return res.status(200).json(rows as Team[]);
    } catch (error) {
        console.error('Error fetching team:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
