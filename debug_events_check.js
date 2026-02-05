require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const now = new Date();
        console.log('Current Server Time (UTC):', now.toISOString());

        // 1. Fetch ALL events
        const allEvents = await Event.find({}).sort({ startTime: -1 }).limit(10);

        console.log('\n--- Recent 10 Events ---');
        allEvents.forEach(e => {
            console.log(`ID: ${e._id}`);
            console.log(`Title: ${e.title}`);
            console.log(`Start: ${e.startTime ? e.startTime.toISOString() : 'N/A'} (${e.startTime < now ? 'PAST' : 'FUTURE'})`);
            console.log(`Status: ${e.status}`);
            console.log(`Confirm: ${e.confirmationStatus}`);
            console.log(`Notified: ${e.notificationSent}`);
            console.log('------------------------');
        });

        // 2. Specific check for upcoming
        const upcoming = await Event.find({ startTime: { $gte: now } });
        console.log(`\nEvents in future (> ${now.toISOString()}): ${upcoming.length}`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
