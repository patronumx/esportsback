const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function dropIndex() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('players');

        // List indexes before
        try {
            const indexes = await collection.indexes();
            console.log('Current indexes:', indexes);

            const indexName = 'id_1';
            const indexExists = indexes.some(idx => idx.name === indexName);

            if (indexExists) {
                await collection.dropIndex(indexName);
                console.log(`Dropped index: ${indexName}`);
            } else {
                console.log(`Index ${indexName} not found`);
            }
        } catch (err) {
            console.log('Error checking/dropping indexes (might not exist yet):', err.message);
        }

        // Verify removal
        try {
            const newIndexes = await collection.indexes();
            console.log('Indexes after drop:', newIndexes);
        } catch (err) {
            console.log('Error listing indexes:', err.message);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit();
    }
}

dropIndex();
