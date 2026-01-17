const WhatsAppSession = require('../models/WhatsAppSession');
const { initAuthCreds, BufferJSON, proto } = require('@whiskeysockets/baileys');

const useMongoDBAuthState = async (collectionName) => {
    // Helper to read data (handles BufferJSON parsing)
    const readData = async (name) => {
        try {
            const doc = await WhatsAppSession.findById(`${collectionName}-${name}`);
            if (doc && doc.data) {
                return JSON.parse(JSON.stringify(doc.data), BufferJSON.reviver);
            }
            return null;
        } catch (error) {
            console.error('Error reading auth state from DB:', error);
            return null;
        }
    };

    // Helper to write data
    const writeData = async (data, name) => {
        try {
            await WhatsAppSession.findByIdAndUpdate(
                `${collectionName}-${name}`,
                { data: JSON.parse(JSON.stringify(data, BufferJSON.replacer)) },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error writing auth state to DB:', error);
        }
    };

    // Helper to remove data
    const removeData = async (name) => {
        try {
            await WhatsAppSession.findByIdAndDelete(`${collectionName}-${name}`);
        } catch (error) {
            console.error('Error removing auth state from DB:', error);
        }
    };

    const creds = (await readData('creds')) || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);
                            if (type === 'app-state-sync-key' && value) {
                                value = proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            if (value) {
                                tasks.push(writeData(value, key));
                            } else {
                                tasks.push(removeData(key));
                            }
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => {
            return writeData(creds, 'creds');
        }
    };
};

module.exports = useMongoDBAuthState;
