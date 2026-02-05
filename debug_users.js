const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/Admin');
const Team = require('./models/Team');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const admins = await Admin.find({});
        console.log('\n--- ADMINS ---');
        admins.forEach(a => {
            console.log(`Email: ${a.email}, Username: ${a.username}, Role: ${a.role}, Team: ${a.teamName}`);
        });

        const teams = await Team.find({});
        console.log('\n--- TEAMS ---');
        teams.forEach(t => {
            console.log(`Name: ${t.name}, Email: ${t.email}`); // Assuming Team model has email, or we check Users if separate
        });

        // If there is a separate User model, check that too.
        // Based on previous context, it seems Admin model handles auth for both? 
        // Or maybe there is a User model? Let's check if User model exists.
        try {
            const User = require('./models/User');
            const users = await User.find({});
            console.log('\n--- USERS ---');
            users.forEach(u => {
                console.log(`Email: ${u.email}, Role: ${u.role}`);
            });
        } catch (e) {
            console.log('\nNo User model found or error checking users.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
