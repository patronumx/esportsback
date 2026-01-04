const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { checkAndSendNotifications } = require('./services/notificationScheduler');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// OR just assume it's in current dir if we run from server dir? 
// User ran "npm run dev" in "d:\...esports". Server is in "d:\...esports\server".
// We run "node server/debug..." from root.
// So path should be './server/.env'.
require('dotenv').config({ path: './server/.env' });

const run = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected. Running checkAndSendNotifications...');

        await checkAndSendNotifications(true); // Run in manual mode

        console.log('Done successfully.');
        process.exit(0);
    } catch (error) {
        console.error('CRASHED:', error);
        process.exit(1);
    }
};

run();
