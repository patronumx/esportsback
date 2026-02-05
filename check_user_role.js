import mongoose from 'mongoose';
import Admin from './server/models/Admin.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await Admin.findOne({ email: 'truerippers@patronum.com' });
        if (user) {
            console.log('User found:', user);
            console.log('Role:', user.role);
        } else {
            console.log('User not found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
