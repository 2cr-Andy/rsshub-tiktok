export default function handler(req, res) {
    const https = require('https');
    
    // 실제로 작동하는 RSSHub 인스턴스들
    const instances = [
        'rsshub.app',
        'rsshub-instance.zeabur.app',
        'rsshub.feeded.xyz',
        'rss.fatpandac.com'
    ];
    
    let attemptIndex = 0;
    
    const tryNext = () => {
        if (attemptIndex >= instances.length) {
            sendFallback();
            return;
        }
        
        const host = instances[attemptIndex];
        const fullUrl = `https://${host}${req.url}`;
        console.log(`Trying: ${fullUrl}`);
        
        https.get(fullUrl, (response) => {
            console.log(`Response from ${host}: ${response.statusCode}`);
            
            if (response.statusCode === 200) {
                res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                res.setHeader('Cache-Control', 'public, max-age=300');
                response.pipe(res);
            } else {
                attemptIndex++;
                tryNext();
            }
        }).on('error', (err) => {
            console.error(`Failed ${host}:`, err.message);
            attemptIndex++;
            tryNext();
        });
    };
    
    const sendFallback = () => {
        const path = req.url || '/';
        const parts = path.split('/');
        const hashtag = parts[parts.length - 1] || 'tiamazingskin';
        
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>TikTok #${hashtag}</title>
<link>https://www.tiktok.com/tag/${hashtag}</link>
<description>Latest videos from #${hashtag}</description>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<item>
<title>모든 RSSHub 서버 응답 없음</title>
<description>시도한 서버: ${instances.join(', ')}</description>
<link>https://www.tiktok.com/tag/${hashtag}</link>
<pubDate>${new Date().toUTCString()}</pubDate>
</item>
</channel>
</rss>`;
        
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.status(200).send(rss);
    };
    
    // URL 경로 확인
    if (!req.url || req.url === '/') {
        res.status(200).send('RSS Proxy is running! Try /tiktok/hashtag/tiamazingskin');
        return;
    }
    
    tryNext();
}
