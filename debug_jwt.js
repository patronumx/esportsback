const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // The user ID from the previous message
        const userId = '692b4013a996eb93e55529aa';

        console.log(`Checking for user with ID: ${userId}`);
        const user = await User.findById(userId);

        if (user) {
            console.log('User found:', user.email, user.role);

            // Simulate token generation
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
                teamId: user.teamId
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
            console.log('Generated Token:', token);

            // Simulate verification
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('Decoded successfully:', decoded);

                const foundUser = await User.findById(decoded.id);
                console.log('User found via token ID:', foundUser ? 'Yes' : 'No');
            } catch (e) {
                console.error('Verification failed:', e.message);
            }

        } else {
            console.log('User NOT found in DB');
            // List all users to see what's there
            const allUsers = await User.find({});
            console.log('All Users:', allUsers.map(u => ({ id: u._id.toString(), email: u.email })));
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debug();
