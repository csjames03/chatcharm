// src/routes/conversations.ts
import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../lib/db';

// The shape your frontend ChatType expects:
export type ChatSummary = {
    id: string;
    name: string;
    priorityRate: 'HIGH' | 'MEDIUM' | 'LOW';
    imageUrl: string | null;
    date: Date;
};

const router = Router();

// GET /api/conversations
router.get(
    '/',
    asyncHandler(async (_req: Request, res: Response) => {
        // 1) Load all conversations, including fan info and latest message
        const convs = await prisma.conversation.findMany({
            include: {
                fan: true,
                messages: {
                    orderBy: { timestamp: 'desc' },
                    take: 20
                }
            },
            orderBy: {
                // you could sort by priority, date, etc.
                priority: 'desc'
            }
        });

        // 2) Map into frontend-friendly ChatSummary[]
        const chats: ChatSummary[] = convs.map((c) => ({
            id: c.fan.id,
            name: c.fan.name,
            priorityRate: c.priority,
            imageUrl: c.fan.avatarUrl,
            date: c.messages[0]?.timestamp ?? new Date()
        }));

        // 3) Send as JSON
        res.json(chats);
    })
);

export default router;