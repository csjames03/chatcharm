import app from './app';
import prisma from '../lib/db'

const PORT = process.env.PORT || 3001;

// Graceful shutdown
async function main() {
    const server = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
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
