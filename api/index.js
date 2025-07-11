export default function handler(req, res) {
    const https = require('https');
    const http = require('http');
    
    // 더 많은 RSSHub 인스턴스들 시도
    const instances = [
        { host: 'rsshub.zeabur.app', protocol: https },
        { host: 'rsshub.liumingye.cn', protocol: https },
        { host: 'rsshub.netlify.app', protocol: https },
        { host: 'rss.shab.fun', protocol: https }
    ];
    
    let attemptIndex = 0;
    
    const tryNext = () => {
        if (attemptIndex >= instances.length) {
            sendFallback();
            return;
        }
        
        const instance = instances[attemptIndex];
        const url = `${instance.host}${req.url}`;
        console.log(`Trying: ${url}`);
        
        instance.protocol.get(`https://${url}`, (response) => {
            if (response.statusCode === 200) {
                res.setHeader('Content-Type', 'application/xml');
                res.setHeader('Cache-Control', 'public, max-age=300');
                response.pipe(res);
            } else {
                attemptIndex++;
                tryNext();
            }
        }).on('error', (err) => {
            console.error(`Failed: ${url}`, err.message);
            attemptIndex++;
            tryNext();
        });
    };
    
    const sendFallback = () => {
        // 모든 인스턴스 실패 시
        const hashtag = req.url.split('/').pop() || 'tiamazingskin';
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>TikTok #${hashtag}</title>
<link>https://www.tiktok.com/tag/${hashtag}</link>
<description>Videos for #${hashtag}</description>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<item>
<title>테스트 중 - 모든 RSSHub 서버 응답 없음</title>
<description>시도한 서버: ${instances.map(i => i.host).join(', ')}</description>
<pubDate>${new Date().toUTCString()}</pubDate>
</item>
</channel>
</rss>`;
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(rss);
    };
    
    tryNext();
}
