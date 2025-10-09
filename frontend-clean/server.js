const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configure proper MIME types for all file extensions
app.use((req, res, next) => {
    // Set proper MIME types for JavaScript files
    if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Set proper MIME types for CSS files
    else if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    // Set proper MIME types for HTML files
    else if (req.path.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    // Set proper MIME types for JSON files
    else if (req.path.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    // Set proper MIME types for images
    else if (req.path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
    }
    else if (req.path.endsWith('.jpg') || req.path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
    }
    else if (req.path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
    }
    else if (req.path.endsWith('.ico')) {
        res.setHeader('Content-Type', 'image/x-icon');
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // CORS headers for API access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

// Serve static files with proper MIME type handling
app.use(express.static('.', {
    setHeaders: (res, path) => {
        // Ensure JavaScript files have correct MIME type
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'SnapIT Forms Frontend'
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        version: '1.0.0',
        environment: 'development'
    });
});

// Only serve index.html for root path, let static files be served properly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for SPA routing
app.get('*', (req, res) => {
    // Don't redirect API calls or static assets
    if (req.path.startsWith('/api/') ||
        req.path.includes('.') ||
        req.path.startsWith('/js/') ||
        req.path.startsWith('/css/') ||
        req.path.startsWith('/images/')) {
        return res.status(404).send('Not Found');
    }

    // Serve index.html for all other routes (SPA support)
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 SnapitForms local development server running at http://localhost:${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/health`);
    console.log(`🔧 API status available at http://localhost:${port}/api/status`);
    console.log('Press Ctrl+C to stop the server');
});