import app from '../server/index.js';
import mongoose from 'mongoose';

let isConnected = false;

export default async function handler(req, res) {
    if (!isConnected) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                bufferCommands: false, // critical to stop buffering timeout
            });
            isConnected = true;
            console.log('MongoDB Connected in Vercel Function');
        } catch (error) {
            console.error('MongoDB Connection Error:', error);
            return res.status(500).json({ success: false, error: 'Database Connection Failed: ' + error.message });
        }
    }

    return app(req, res);
}
