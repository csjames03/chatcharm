import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../lib/db';

const fansRouter = Router();

// GET /api/fans/:id
fansRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const fan = await prisma.fan.findUnique({
            where: { id },
            include: {
                spendings: true,
                conversations: true
            }
        });
        if (!fan) return res.status(404).json({ error: 'Fan not found' });
        res.json(fan);
    })
);

export default fansRouter;