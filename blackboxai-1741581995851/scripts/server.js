const http = require('http');
const fs = require('fs');
const path = require('path');
const miningOptimizer = require('./miner');
const defiAgent = require('./defi-agent');

const PORT = process.env.PORT || 8000;

const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle API endpoints
    if (req.url.startsWith('/api/')) {
        return handleApiRequest(req, res);
    }

    // Serve static files
    let filePath = path.join(__dirname, '..', 'public', req.url === '/' ? 'mining.html' : req.url);
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

async function handleApiRequest(req, res) {
    const sendJson = (data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    const sendError = (error) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    };

    try {
        // Mining API endpoints
        if (req.url === '/api/mining/stats' && req.method === 'GET') {
            const stats = miningOptimizer.getStatus();
            return sendJson(stats);
        }

        if (req.url === '/api/mining/start' && req.method === 'POST') {
            await miningOptimizer.start();
            return sendJson({ status: 'Mining started' });
        }

        if (req.url === '/api/mining/stop' && req.method === 'POST') {
            await miningOptimizer.stop();
            return sendJson({ status: 'Mining stopped' });
        }

        // DeFi API endpoints
        if (req.url === '/api/defi/stats' && req.method === 'GET') {
            const stats = defiAgent.getStatus();
            return sendJson(stats);
        }

        if (req.url === '/api/defi/start' && req.method === 'POST') {
            await defiAgent.start();
            return sendJson({ status: 'DeFi agent started' });
        }

        if (req.url === '/api/defi/stop' && req.method === 'POST') {
            await defiAgent.stop();
            return sendJson({ status: 'DeFi agent stopped' });
        }

        // Default response for unknown endpoints
        res.writeHead(404);
        res.end('API endpoint not found');
    } catch (error) {
        sendError(error);
    }
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
        console.error('Server error:', error);
    }
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    miningOptimizer.stop();
    defiAgent.stop();
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});
