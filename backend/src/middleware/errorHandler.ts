import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
}