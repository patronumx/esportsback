const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '../.env' });

const createAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminEmail = 'admin@patronum.gg';
        const adminPassword = 'supersecretadmin'; // In production, this should be env var or random

        // Check if admin exists
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists. Updating password...');
            const salt = await bcrypt.genSalt(10);
            userExists.password = await bcrypt.hash(adminPassword, salt);
            userExists.role = 'admin'; // Ensure role is admin
            await userExists.save();
            console.log('Admin password updated.');
        } else {
            console.log('Creating new admin user...');
            const user = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        console.log('-----------------------------------');
        console.log('Email: ' + adminEmail);
        console.log('Password: ' + adminPassword);
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
