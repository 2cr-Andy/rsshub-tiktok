export default function handler(req, res) {
    const https = require('https');
    
    // 메인 페이지
    if (!req.url || req.url === '/') {
        res.status(200).send(`
            <h1>RSS Proxy is running!</h1>
            <p>Test links:</p>
            <ul>
                <li><a href="/bbc/news">BBC News</a></li>
                <li><a href="/github/trending/daily">GitHub Trending</a></li>
                <li><a href="/tiktok/hashtag/tiamazingskin">TikTok #tiamazingskin</a></li>
            </ul>
        `);
        return;
    }
    
    // rsshub.app으로 직접 프록시
    const proxyUrl = `https://rsshub.app${req.url}`;
    console.log(`Proxying to: ${proxyUrl}`);
    
    https.get(proxyUrl, (response) => {
        console.log(`Response status: ${response.statusCode}`);
        console.log(`Content-Type: ${response.headers['content-type']}`);
        
        // 헤더 복사
        Object.keys(response.headers).forEach(key => {
            if (key.toLowerCase() !== 'content-encoding') {
                res.setHeader(key, response.headers[key]);
            }
        });
        
        // 응답 스트리밍
        response.pipe(res);
        
    }).on('error', (err) => {
        console.error('Proxy error:', err.message);
        
        res.status(500).json({
            error: 'Proxy failed',
            message: err.message,
            attempted: proxyUrl
        });
    });
}
