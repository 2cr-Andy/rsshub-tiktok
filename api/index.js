export default function handler(req, res) {
    const https = require('https');
    https.get('https://rsshub.app' + req.url, (r) => {
        res.status(r.statusCode);
        r.pipe(res);
    });
}
