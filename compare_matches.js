const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const MapDropSchema = new mongoose.Schema({
    mapName: String,
    objects: Array,
    title: String,
    stage: String,
    day: String,
    matchNumber: String,
    updatedAt: Date
});
const MapDrop = mongoose.model('MapDrop', MapDropSchema, 'mapdrops');

const RotationSchema = new mongoose.Schema({
    teamId: String,
    mapId: String,
    objects: Array
});
const Rotation = mongoose.model('Rotation', RotationSchema, 'rotations');

async function compareData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esports-db');

        // IDs from previous dump
        const idDay1Match6 = "694fa1c3bd786ba9f60c1c55";
        const idDay3Match6 = "694fd766858e84ebf5bf7eab";

        const drop1 = await MapDrop.findById(idDay1Match6);
        const drop3 = await MapDrop.findById(idDay3Match6);
        const rot1 = await Rotation.findOne({ teamId: `event_${idDay1Match6}` });

        console.log("--- Comparison ---");
        console.log(`Day 1 Match 6 (Raw): Objects ${drop1.objects.length}`);
        console.log(`Day 3 Match 6 (Raw): Objects ${drop3.objects.length}`);
        console.log(`Day 1 Match 6 (Strategy): Objects ${rot1 ? rot1.objects.length : 'NONE'}`);

        if (rot1) {
            // Compare Rot1 vs Drop3
            const rotSig = JSON.stringify(rot1.objects.map(o => ({ tool: o.tool, x: o.x, y: o.y })));
            const drop3Sig = JSON.stringify(drop3.objects.map(o => ({ tool: o.tool, x: o.x, y: o.y })));
            const drop1Sig = JSON.stringify(drop1.objects.map(o => ({ tool: o.tool, x: o.x, y: o.y })));

            if (rotSig === drop3Sig) {
                console.log("!!! MATCH DETECTED !!!");
                console.log("The Saved Strategy for Day 1 Match 6 is IDENTICAL to Day 3 Match 6 Raw Data.");
                console.log("Diagnosis: User likely accidentally saved Day 3 data over Day 1 Strategy.");
            } else if (rotSig === drop1Sig) {
                console.log("Info: Saved Strategy is identical to its own Raw Data (Redundant but correct).");
            } else {
                console.log("Strategy is unique. Diff sample:");
                console.log("Rot1[0]:", JSON.stringify(rot1.objects[0]));
                console.log("Drop3[0]:", JSON.stringify(drop3.objects[0]));
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

compareData();
