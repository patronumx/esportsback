const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const RotationSchema = new mongoose.Schema({
    teamId: String,
    mapId: String,
    objects: Array
});
const Rotation = mongoose.model('Rotation', RotationSchema, 'rotations');

async function fixData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esports-db');

        // Target: Day 1 Match 6 (ID 694fa1c3bd786ba9f60c1c55)
        const targetTeamId = "event_694fa1c3bd786ba9f60c1c55";

        console.log(`Deleting Strategy for TeamId: ${targetTeamId}`);
        const result = await Rotation.deleteOne({ teamId: targetTeamId });

        if (result.deletedCount === 1) {
            console.log("Success: Strategy deleted.");
        } else {
            console.log(`Warning: Deleted ${result.deletedCount} documents. (Maybe already deleted?)`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

fixData();
