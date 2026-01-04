const mongoose = require('mongoose');
const fs = require('fs');
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

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esports-db');

        const drops = await MapDrop.find({}).sort({ updatedAt: -1 });

        const results = [];

        for (let d of drops) {
            const teamId = `event_${d._id}`;
            const rot = await Rotation.findOne({ teamId: teamId });

            if ((d.stage && d.stage.match(/Finals/i)) || (d.title && d.title.match(/Finals/i))) {
                results.push({
                    id: d._id,
                    title: d.title,
                    stage: d.stage,
                    day: d.day,
                    match: d.matchNumber,
                    objectsCount: d.objects ? d.objects.length : 0,
                    strategyFound: !!rot,
                    strategyObjectsCount: rot ? rot.objects.length : 0,
                    // contentSample: rot && rot.objects.length > 0 ? JSON.stringify(rot.objects[0]) : null
                });
            }
        }

        fs.writeFileSync('debug_matches.json', JSON.stringify(results, null, 2), 'utf8');
        console.log("Written to debug_matches.json");

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
