const app = require("./index");
const { closeBrowserPool } = require("./utils/scrapeMultipleUrls");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(process.env);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        await closeBrowserPool();
        console.log('Browser pool closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        await closeBrowserPool();
        console.log('Browser pool closed');
        process.exit(0);
    });
});

module.exports = server;
