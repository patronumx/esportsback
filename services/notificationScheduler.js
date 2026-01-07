const cron = require('node-cron');
const Event = require('../models/Event');
const whatsappService = require('./whatsappService');

// Check frequently (every 10m) to support dynamic intervals (3h normal, 20m panic)
const startScheduler = () => {
    console.log('Starting Notification Scheduler...');

    // Run every 1 minute
    cron.schedule('* * * * *', async () => {
        console.log('Running Scheduled Notification Check...');
        await checkAndSendNotifications();
    });
};

const checkAndSendNotifications = async (isManual = false) => {
    try {
        const now = new Date();

        // Window Logic Override: Always run to support night ops/international teams
        // const hour = now.getHours();
        // const inWindow = (hour >= 12) || (hour < 3);

        const inWindow = true; // FORCE ALWAYS ON

        if (!inWindow && !isManual) {
            // console.log(`[Scheduler] Outside active window (12 PM - 3 AM). Skipping.`);
            return;
        }

        // Manual: 30 days. Auto: 24 hours (look back is critical for Today/active events)
        const lookAheadTime = isManual ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const futureLimit = new Date(now.getTime() + lookAheadTime);

        // Look back 24h to ensure we catch events where 'date' is stored as midnight
        const startTimeLowerBound = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        console.log(`[Scheduler] Checking events. Manual: ${isManual}, Start: ${startTimeLowerBound.toISOString()}, End: ${futureLimit.toISOString()}`);

        const query = {
            status: 'Upcoming',
            confirmationStatus: 'Pending',
            $or: [
                { startTime: { $gte: startTimeLowerBound, $lte: futureLimit } },
                { 'schedule.date': { $gte: startTimeLowerBound, $lte: futureLimit } }
            ]
        };

        const events = await Event.find(query).populate('team');

        console.log(`[Scheduler] Found ${events.length} events pending check.`);

        for (const event of events) {
            if (!event.team) continue;

            // Determine content
            let targetDateObj = event.startTime;
            let dayInfo = "Match";
            let timeDisplay = "";
            let matchTimeObj = null;

            const matchingDay = event.schedule?.find(d => {
                if (!d.date) return false;
                const dDate = new Date(d.date);
                return dDate >= startTimeLowerBound && dDate <= futureLimit;
            });

            if (matchingDay) {
                targetDateObj = new Date(matchingDay.date);
                dayInfo = `Day ${matchingDay.day}`;

                if (matchingDay.matches && matchingDay.matches.length > 0) {
                    // Find first valid match time
                    const firstMatch = matchingDay.matches.find(m => m.time);
                    if (firstMatch) {
                        const [h, min] = firstMatch.time.split(':');
                        matchTimeObj = new Date(targetDateObj);
                        matchTimeObj.setHours(h, min);
                    }

                    // Format times
                    const times = matchingDay.matches
                        .filter(m => m.time)
                        .map(m => {
                            const [h, min] = m.time.split(':');
                            const d = new Date();
                            d.setHours(h, min);
                            return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                        });
                    if (times.length > 0) timeDisplay = times.join(', ');
                }
            }

            // Fallback
            if (!timeDisplay) {
                timeDisplay = targetDateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                if (!matchTimeObj) matchTimeObj = targetDateObj;
            }

            // LOGIC: Check Frequency and Constraints
            // Is it TODAY?
            const isToday = new Date().toDateString() === targetDateObj.toDateString();

            let shouldSend = false;

            if (isToday || isManual) {
                if (!matchTimeObj) {
                    // No specific match time defined? Default to 3 hour interval
                    shouldSend = checkInterval(event, 180, isManual);
                } else {
                    // We have a match time
                    if (now > matchTimeObj && !isManual) {
                        // Match started. Stop spamming?
                        console.log(`[Debug] ${event.title} - Match Started (Now: ${now.toLocaleTimeString()} > Match: ${matchTimeObj.toLocaleTimeString()}). Skipping.`);
                        continue;
                    }

                    const msUntilMatch = matchTimeObj - now;
                    const minsUntilMatch = msUntilMatch / (1000 * 60);

                    console.log(`[Debug] ${event.title} - MatchTime: ${matchTimeObj.toLocaleString()}, MinsLeft: ${minsUntilMatch.toFixed(1)}, LastSent: ${event.lastNotificationSentAt ? new Date(event.lastNotificationSentAt).toLocaleTimeString() : 'Never'}`);

                    // 1. Is it inside the 4-hour window?
                    // (e.g. 240 minutes).
                    // If < 60 mins left, interval = 20 mins. Else 3 hours (180 mins).
                    const interval = (minsUntilMatch <= 60) ? 20 : 180;

                    shouldSend = checkInterval(event, interval, isManual);
                }
            } else {
                // Future Event: Send ONCE
                if (!event.notificationSent || isManual) shouldSend = true;
            }

            if (!shouldSend) continue;

            const phone = event.team.notificationContact?.whatsapp || event.team.phoneNumber;
            if (!phone) continue;

            const dateString = targetDateObj.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });

            const message = `*Reminder*\nHello ${event.team.name}, you have *${event.title}* Matches - *${dayInfo}* coming up on *${dateString}*.\nTimings: *${timeDisplay}*.\nPlease log in to your dashboard to confirm your attendance.`;

            try {
                await whatsappService.sendMessage(phone, message);
                console.log(`Notification sent to ${event.team.name} for ${dayInfo}`);

                event.notificationSent = true;
                event.lastNotificationSentAt = new Date();
                await event.save();
            } catch (err) {
                console.error(`Failed to send to ${event.team.name}:`, err.message);
            }
        }
    } catch (error) {
        console.error('[Scheduler] Error:', error);
    }
};

// Helper to check if enough time passed since last notification
function checkInterval(event, intervalMins, isManual) {
    if (isManual) return true; // Always send on manual
    if (!event.lastNotificationSentAt) return true; // Never sent before

    const now = new Date();
    const msSinceLast = now - new Date(event.lastNotificationSentAt);
    const minsSinceLast = msSinceLast / (1000 * 60);

    return minsSinceLast >= intervalMins;
}

module.exports = {
    startScheduler,
    checkAndSendNotifications
};
