export default async function handler(req, res) {
    const fetch = (await import('node-fetch')).default;
    const hashtag = req.url.split('/').pop();
    
    try {
        // 여러 RSSHub 시도
        const response = await fetch(`https://rsshub.feeded.xyz${req.url}`);
        const data = await response.text();
        
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(data);
    } catch (error) {
        // 모든 RSSHub 실패 시 기본 RSS
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>TikTok #${hashtag}</title>
<link>https://www.tiktok.com/tag/${hashtag}</link>
<description>Videos from #${hashtag}</description>
</channel>
</rss>`;
        
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(rss);
    }
}
