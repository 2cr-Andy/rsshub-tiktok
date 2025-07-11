export default async function handler(req, res) {
    try {
        const { init } = await import('../lib/index.js');
        const app = await init();
        return app(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
}
