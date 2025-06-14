import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../lib/db';

const messageRouter = Router();

// POST /api/message
messageRouter.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const { conversationId, agentId, fanId, senderType, text } = req.body;

        // Manual validation
        if (!conversationId || typeof conversationId !== 'string') {
            return res.status(400).json({ error: 'conversationId is required and must be a string' });
        }

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'text is required and must be a string' });
        }

        if (!senderType || !['AGENT', 'FAN'].includes(senderType)) {
            return res.status(400).json({ error: 'senderType must be either "AGENT" or "FAN"' });
        }

        if (senderType === 'AGENT' && (!agentId || typeof agentId !== 'string')) {
            return res.status(400).json({ error: 'agentId is required when senderType is AGENT' });
        }

        if (senderType === 'FAN' && (!fanId || typeof fanId !== 'string')) {
            return res.status(400).json({ error: 'fanId is required when senderType is FAN' });
        }

        // Create the message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderType,
                text,
                agentId,
                fanId
            },
        });

        console.log("Message Created Succesfully", message)

        res.status(201).json(message);
    })
);

export default messageRouter;
