// server.ts
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import prisma from '../lib/db';
import { setIO } from '../lib/socket';

const PORT = process.env.PORT || 3001;
const FRONTENDPORT = process.env.FRONTEND_PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: `http://localhost:${FRONTENDPORT}`,
        methods: ['GET', 'POST'],
    },
});

setIO(io); // ✅ register it globally

io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('send_message', (message) => {
        io.emit('receive_message', message); // still works if you're keeping this
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

async function main() {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
        console.log('Shutting down gracefully...');
        await prisma.$disconnect();
        server.close(() => process.exit(0));
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
