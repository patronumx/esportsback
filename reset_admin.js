const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        let admin = await User.findOne({ email: 'admin@patronum.gg' });

        if (!admin) {
            console.log('Admin user not found. Creating new admin...');
            admin = new User({
                name: 'Super Admin',
                email: 'admin@patronum.gg',
                role: 'admin',
                password: 'supersecretadmin' // Will be hashed by pre-save hook
            });
        } else {
            console.log('Admin user found. Resetting password...');
            admin.password = 'supersecretadmin'; // Will be hashed by pre-save hook
        }

        await admin.save();
        console.log('SUCCESS: Admin credential reset complete.');
        console.log('Email: admin@patronum.gg');
        console.log('Password: supersecretadmin');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
