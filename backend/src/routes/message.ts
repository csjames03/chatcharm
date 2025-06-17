import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../lib/db';
import { getIO } from '../../lib/socket'; // 👈 get io here

const messageRouter = Router();

messageRouter.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const { conversationId, agentId, fanId, senderType, text } = req.body;

        // Basic validation (same as yours)
        if (!conversationId || typeof conversationId !== 'string') {
            return res.status(400).json({ error: 'conversationId is required' });
        }
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'text is required' });
        }
        if (!senderType || !['AGENT', 'FAN'].includes(senderType)) {
            return res.status(400).json({ error: 'senderType invalid' });
        }
        if (senderType === 'AGENT' && (!agentId || typeof agentId !== 'string')) {
            return res.status(400).json({ error: 'agentId required' });
        }
        if (senderType === 'FAN' && (!fanId || typeof fanId !== 'string')) {
            return res.status(400).json({ error: 'fanId required' });
        }

        const message = await prisma.message.create({
            data: { conversationId, senderType, text, agentId, fanId },
        });

        // 🔥 Emit the created message to all clients
        getIO().emit('receive_message', message);

        res.status(201).json(message);
    })
);

export default messageRouter;
