// src/routes/conversation.ts
import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../lib/db';

const coversationRouter = Router();

// GET /api/conversation/:id
coversationRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const conversation = await prisma.conversation.findFirst({
            where: { fanId: id },
            include: { messages: true, fan: true, }
        });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        res.json(conversation);
    })
);

export default coversationRouter;