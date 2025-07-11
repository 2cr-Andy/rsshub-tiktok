export default function handler(req, res) {
    const https = require('https');
    
    // 작동하는 공개 RSSHub 찾기
    const tryRSSHub = (url) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                res.setHeader('Content-Type', 'application/xml');
                res.setHeader('Cache-Control', 'public, max-age=300');
                response.pipe(res);
            } else {
                // 실패하면 다른 서버 시도
                fallbackRSS();
            }
        }).on('error', () => {
            fallbackRSS();
        });
    };
    
    // 실패 시 기본 RSS
    const fallbackRSS = () => {
        const hashtag = req.url.split('/').pop() || 'tiktok';
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>TikTok #${hashtag}</title>
<link>https://www.tiktok.com/tag/${hashtag}</link>
<description>TikTok videos for #${hashtag}</description>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<item>
<title>RSSHub 서버 연결 실패</title>
<description>다른 RSSHub 인스턴스를 시도하거나 Python에서 직접 사용하세요</description>
<pubDate>${new Date().toUTCString()}</pubDate>
</item>
</channel>
</rss>`;
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(rss);
    };
    
    // 첫 번째 시도
    tryRSSHub('https://rsshub.feeded.xyz' + req.url);
}
