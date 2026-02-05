const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const fs = require('fs');
const path = require('path');

dotenv.config();

const seedTeams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const credentialsPath = path.join(__dirname, '../dashboard-credentials.json');
        const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        const teams = data.credentials;

        console.log(`Found ${teams.length} teams to seed...`);

        for (const team of teams) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(team.password, salt);

            await Admin.findOneAndUpdate(
                { email: team.email },
                {
                    email: team.email,
                    password: hashedPassword,
                    role: team.role,
                    teamName: team.teamName,
                    region: team.region,
                    // Remove username if it exists to avoid unique constraint issues if we are switching to email
                    // or set it to email if we want to keep it populated
                    username: team.email
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Seeded: ${team.teamName}`);
        }

        console.log('All teams seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedTeams();
