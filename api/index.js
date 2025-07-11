const https = require('https');

module.exports = (req, res) => {
    const path = req.url || '/';
    const proxyUrl = `https://rsshub.app${path}`;
    
    https.get(proxyUrl, (proxyRes) => {
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=300');
        
        proxyRes.pipe(res);
    }).on('error', (error) => {
        res.status(500).json({ 
            error: 'Proxy failed',
            message: error.message 
        });
    });
};
