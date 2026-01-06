const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' }); // Adjust path if needed

const MapDropSchema = new mongoose.Schema({
    mapName: String,
    objects: Array,
    title: String,
    stage: String,
    day: String,
    matchNumber: String,
    updatedAt: Date
});
const MapDrop = mongoose.model('MapDrop', MapDropSchema, 'mapdrops'); // Explicit collection name if needed, usually plural of model

const RotationSchema = new mongoose.Schema({
    teamId: String,
    mapId: String,
    objects: Array
});
const Rotation = mongoose.model('Rotation', RotationSchema);

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esports-db'); // Default if env missing
        console.log("Connected to DB");

        console.log("--- MapDrops (Grand Finals / Finals) ---");
        // Regex to match "Finals" (case insensitive)
        const drops = await MapDrop.find({
            $or: [
                { stage: { $regex: /Finals/i } },
                { title: { $regex: /Finals/i } }
            ]
        }).sort({ stage: 1, day: 1, matchNumber: 1 });

        drops.forEach(d => {
            console.log(`ID: ${d._id} | Title: ${d.title} | Stage: ${d.stage} | Day: ${d.day} | Match: ${d.matchNumber} | Map: ${d.mapName} | Objects: ${d.objects ? d.objects.length : 0}`);
        });

        console.log("\n--- Rotations (Saved Strategies) ---");
        // Check for rotations linked to these events
        for (let d of drops) {
            const teamId = `event_${d._id}`;
            const rot = await Rotation.findOne({ teamId: teamId });
            if (rot) {
                console.log(`Found Strategy for ${d.stage} ${d.day} Match ${d.matchNumber} (ID: ${d._id}) -> RotObjects: ${rot.objects.length}`);
            } else {
                // console.log(`No Strategy for ${d.stage} ${d.day} Match ${d.matchNumber}`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
