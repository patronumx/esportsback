const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const fs = require('fs');

let sock;
let qrCodeData = null;
let status = 'disconnected'; // disconnected, qr_ready, ready
let readyTimestamp = null;
let connectionUser = null;
let isInitializing = false; // Prevent double-init

const initialize = async () => {
    console.log('Initializing WhatsApp Client (Baileys)...');

    if (sock || isInitializing) {
        console.log('Skipping Init: Already connected or initializing.');
        return;
    }

    isInitializing = true;

    try {
        // AGGRESSIVE CLEANUP: If we are initializing, it means we want a fresh start.
        // On Heroku, a restart might leave garbage files if persistent storage was somehow active? 
        // Or if the previous socket didn't close cleanly.
        if (fs.existsSync('auth_info_baileys')) {
            console.log('Cleaning up old auth session...');
            fs.rmSync('auth_info_baileys', { recursive: true, force: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: Browsers.macOS('Desktop'),
            syncFullHistory: false,
            connectTimeoutMs: 120000,
            defaultQueryTimeoutMs: 120000,
            keepAliveIntervalMs: 10000,
            retryRequestDelayMs: 250,
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('WhatsApp QR Code Received');
                status = 'qr_ready';
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
                sock = null;
                isInitializing = false; // Reset lock
                if (shouldReconnect) {
                    // Don't recursive init here, risk of loop. 
                    // Let the scheduler or admin trigger it if needed, or simple retry.
                    // For now, retry ONCE after delay?
                    setTimeout(() => initialize(), 2000);
                } else {
                    console.log('Connection closed. You are logged out.');
                    if (fs.existsSync('auth_info_baileys')) {
                        fs.rmSync('auth_info_baileys', { recursive: true, force: true });
                    }
                }
            } else if (connection === 'open') {
                console.log('WhatsApp Client is Ready! (Baileys)');
                status = 'ready';
                qrCodeData = null;
                readyTimestamp = Date.now();
                isInitializing = false; // Unlock

                const rawId = sock.user?.id || '';
                connectionUser = rawId.split(':')[0];
                console.log('Connected User:', connectionUser);
            }
        });

    } catch (err) {
        console.error("Failed to initialize WhatsApp Client (Baileys):", err);
        isInitializing = false; // Unlock on error
    }
};

const getStatus = () => {
    return {
        status: isInitializing ? 'initializing' : status, // Report initializing state
        qrCode: qrCodeData,
        readyTimestamp,
        user: connectionUser
    };
};

const sendMessage = async (to, text) => {
    if (status !== 'ready' || !sock) {
        throw new Error('WhatsApp client is not ready');
    }

    try {
        const inputNumber = String(to).replace(/\D/g, '');
        let formattedNumber = inputNumber;
        if (inputNumber.length === 11 && inputNumber.startsWith('0')) {
            formattedNumber = '92' + inputNumber.substring(1);
        }
        const jid = `${formattedNumber}@s.whatsapp.net`;
        const response = await sock.sendMessage(jid, { text: text });
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
        } catch (e) {
            console.error('Logout failed:', e);
        }
    }
    // Always clean up local state
    sock = null;
    status = 'disconnected';
    qrCodeData = null;
    connectionUser = null;
    isInitializing = false;

    if (fs.existsSync('auth_info_baileys')) {
        fs.rmSync('auth_info_baileys', { recursive: true, force: true });
    }
    console.log('Logged out and cleared auth info.');
};

module.exports = { initialize, getStatus, sendMessage, logout };
