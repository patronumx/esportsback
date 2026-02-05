const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Event = require('../models/Event');
const Media = require('../models/Media');
const Performance = require('../models/Performance');
const RevisionRequest = require('../models/RevisionRequest');
const Notification = require('../models/Notification');
const SocialProfile = require('../models/SocialProfile');
const SocialAnalyticsSnapshot = require('../models/SocialAnalyticsSnapshot');

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear all data
        console.log('Clearing database...');
        await User.deleteMany({});
        await Team.deleteMany({});
        await Player.deleteMany({});
        await Event.deleteMany({});
        await Media.deleteMany({});
        await Performance.deleteMany({});
        await RevisionRequest.deleteMany({});
        await Notification.deleteMany({});
        await SocialProfile.deleteMany({});
        await SocialAnalyticsSnapshot.deleteMany({});
        console.log('Database cleared.');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
