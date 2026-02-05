const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MatchPlan = require('../models/MatchPlan');
const path = require('path');

// Safe load env
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const fixIndex = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/esports';
        console.log('Connecting to DB with URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Mask auth if present

        await mongoose.connect(uri);
        console.log('Connected.');

        console.log('Dropping team_1 index...');
        const exists = await MatchPlan.collection.indexExists('team_1');
        if (exists) {
            await MatchPlan.collection.dropIndex('team_1');
            console.log('Index team_1 dropped successfully.');
        } else {
            console.log('Index team_1 does not exist.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        // If error is "index not found", that's success
        if (error.codeName === 'IndexNotFound') {
            console.log('Index not found (Success).');
            process.exit(0);
        }
        process.exit(1);
    }
};

fixIndex();
