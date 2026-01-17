const { makeWASocket, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const fs = require('fs');
const useMongoDBAuthState = require('./mongoAuth');

let sock;
let qrCodeData = null;
let status = 'disconnected'; // disconnected, qr_ready, ready
let readyTimestamp = null;
let connectionUser = null;

const initialize = async () => {
    console.log('Initializing WhatsApp Client (Baileys - MongoDB Auth)...');

    // Safety check: Avoid multiple initializations if already fully connected
    if (sock) return;

    try {
        const { state, saveCreds } = await useMongoDBAuthState('patronum_wa_auth');

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: Browsers.macOS('Desktop'), // Mimic a standard browser
            syncFullHistory: false // Keep it light
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('WhatsApp QR Code Received');
                status = 'qr_ready';
                // Convert to data URL for frontend
                try {
                    qrCodeData = await qrcode.toDataURL(qr);
                } catch (err) {
                    console.error('Error generating QR', err);
                }
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
                status = 'disconnected';
                qrCodeData = null;
                connectionUser = null;
                sock = null; // Clear socket instance
                if (shouldReconnect) {
                    initialize(); // Reconnect automatically
                } else {
                    console.log('Connection closed. You are logged out.');
                    // Clear auth logic handled by mongoAuth adapter mostly, but we can clean up if needed
                }
            } else if (connection === 'open') {
                console.log('WhatsApp Client is Ready! (Baileys)');
                status = 'ready';
                qrCodeData = null;
                readyTimestamp = Date.now();

                // Get user info
                const rawId = sock.user?.id || '';
                connectionUser = rawId.split(':')[0]; // Extract phone number part
                console.log('Connected User:', connectionUser);
            }
        });

    } catch (err) {
        console.error("Failed to initialize WhatsApp Client (Baileys):", err);
    }
};

const getStatus = () => {
    return {
        status,
        qrCode: qrCodeData,
        readyTimestamp,
        user: connectionUser
    };
};

const sendMessage = async (to, text) => {
    if (status !== 'ready' || !sock) {
        console.error('SendMessage called but client not ready');
        throw new Error('WhatsApp client is not ready');
    }

    try {
        const inputNumber = String(to);
        const cleanNumber = inputNumber.replace(/\D/g, '');
        let formattedNumber = cleanNumber;
        if (cleanNumber.length === 11 && cleanNumber.startsWith('0')) {
            formattedNumber = '92' + cleanNumber.substring(1);
        }

        // Baileys uses @s.whatsapp.net for individuals
        const jid = `${formattedNumber}@s.whatsapp.net`;
        console.log(`[WhatsApp] Sending to JID: ${jid}`);

        // Sending text message
        const response = await sock.sendMessage(jid, { text: text });
        console.log('[WhatsApp] Message sent successfully');

        return { success: true, response };
    } catch (error) {
        console.error('WhatsApp Send Error Details:', error);
        throw error;
    }
};

const logout = async () => {
    if (sock) {
        try {
            await sock.logout();
            sock = null;
            status = 'disconnected';
            qrCodeData = null;
            connectionUser = null;
            console.log('Logged out.');
            // Note: If you want to clear DB auth data on logout, call a helper in mongoAuth
            // For now, logout just kills session.
        } catch (e) {
            console.error('Logout failed:', e);
        }
    }
};

module.exports = { initialize, getStatus, sendMessage, logout };
