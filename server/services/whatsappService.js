const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client;
let qrCodeData = null;
let status = 'disconnected'; // disconnected, qr_ready, ready
let readyTimestamp = null;

const initialize = () => {
    console.log('Initializing WhatsApp Client...');

    // Safety check: Avoid multiple initializations
    if (client) return;

    client = new Client({
        authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        }
    });

    client.on('qr', (qr) => {
        console.log('WhatsApp QR Code Received');
        // Convert to Data URL for frontend
        qrcode.toDataURL(qr, (err, url) => {
            if (err) {
                console.error('Error generating QR', err);
                return;
            }
            qrCodeData = url;
            status = 'qr_ready';
        });
    });

    client.on('ready', () => {
        console.log('WhatsApp Client is Ready!');
        status = 'ready';
        qrCodeData = null;
        readyTimestamp = Date.now();
    });

    client.on('authenticated', () => {
        console.log('WhatsApp Authenticated');
        status = 'authenticated'; // Transitional
    });

    client.on('auth_failure', msg => {
        console.error('WhatsApp Auth Failure', msg);
        status = 'disconnected';
    });

    client.on('disconnected', (reason) => {
        console.log('WhatsApp Disconnected', reason);
        status = 'disconnected';
        client = null;
        // Optional: Auto-reconnect logic could go here
    });

    client.initialize().catch(err => {
        console.error("Failed to initialize WhatsApp Client:", err);
    });
};

const getStatus = () => {
    return {
        status,
        qrCode: qrCodeData,
        readyTimestamp
    };
};

const sendMessage = async (to, text) => {
    if (status !== 'ready' || !client) {
        throw new Error('WhatsApp client is not ready');
    }

    try {
        // 'to' should be formatted as '923338638325@c.us'
        // If user provides "0333...", replace leading 0 with 92 or passed generic format
        // The robust way is to use client.getNumberId(to) but that's async and checks existence.

        let chatId;
        // Basic cleaning
        const cleanNumber = to.replace(/\D/g, '');

        // Ensure format: if starts with 03..., replace 0 with 92. If starts with 3, add 92 (assuming PK default).
        // BUT better to rely on what user saved. 
        // Admin likely saved full international format or "03..."
        // I will do basic PK normalization if length is 11 starts with 0.

        let formattedNumber = cleanNumber;
        if (cleanNumber.length === 11 && cleanNumber.startsWith('0')) {
            formattedNumber = '92' + cleanNumber.substring(1);
        }

        chatId = `${formattedNumber}@c.us`;

        const response = await client.sendMessage(chatId, text);
        return { success: true, response };
    } catch (error) {
        console.error('WhatsApp Send Error:', error);
        throw error;
    }
};

const logout = async () => {
    if (client) {
        await client.logout();
        client = null;
        status = 'disconnected';
        qrCodeData = null;
    }
};

module.exports = {
    initialize,
    getStatus,
    sendMessage,
    logout
};
