import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../lib/db';

const templatesRouter = Router();

// GET /api/templates
templatesRouter.get(
    '/',
    asyncHandler(async (_req: Request, res: Response) => {
        const templates = await prisma.template.findMany();
        res.json(templates);
    })
);

export default templatesRouter;