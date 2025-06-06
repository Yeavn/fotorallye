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
        const result = await db.query('SELECT * FROM teams');
        const rows = Array.isArray(result[0]) ? result[0] : [];
        return res.status(200).json(rows as Team[]);
    } catch (error) {
        console.error('Error fetching team:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}