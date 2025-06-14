import express from 'express';
import cors from 'cors';
import routes from './routes';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

// API versioning prefix
app.use('/api', routes);
// 404 and Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;