const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Team = require('./models/Team');
const fs = require('fs');
const path = require('path');

dotenv.config();

const seedTeamsData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const credentialsPath = path.join(__dirname, '../dashboard-credentials.json');
        const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        const teams = data.credentials.filter(c => c.role === 'team-manager');

        console.log(`Found ${teams.length} teams to seed into Team collection...`);

        for (const t of teams) {
            // Create a slug-like ID
            const teamId = t.teamName.toLowerCase().replace(/[^a-z0-9]/g, '-');

            await Team.findOneAndUpdate(
                { name: t.teamName }, // Match by name
                {
                    id: teamId,
                    name: t.teamName,
                    logo: 'https://via.placeholder.com/150', // Placeholder logo
                    region: t.region,
                    stage: 'gauntlet', // Default stage
                    players: [] // Empty players list initially
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Seeded Team Data: ${t.teamName}`);
        }

        console.log('All team data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedTeamsData();
