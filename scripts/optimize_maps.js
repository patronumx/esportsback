import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAPS_DIR = path.join(__dirname, '../src/assets/maps');
const TARGET_SIZE = 4096;
const QUALITY = 80;

const processMaps = async () => {
    try {
        const files = fs.readdirSync(MAPS_DIR);

        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg)$/i)) {
                const filePath = path.join(MAPS_DIR, file);
                console.log(`Processing ${file}...`);

                const image = await Jimp.read(filePath);

                // Resize only if larger than target
                if (image.width > TARGET_SIZE || image.height > TARGET_SIZE) {
                    console.log(`Resizing ${file} from ${image.width}x${image.height} to ${TARGET_SIZE}x${TARGET_SIZE}...`);
                    image.resize({ w: TARGET_SIZE, h: TARGET_SIZE }); // exact resize to square as maps are usually square
                } else {
                    console.log(`${file} is already smaller or equal to target size.`);
                }

                // Write back to same path (overwrite)
                await image.write(filePath, { quality: QUALITY });
                console.log(`Saved optimized ${file}`);
            }
        }
        console.log('All maps processed.');
    } catch (error) {
        console.error('Error processing maps:', error);
    }
};

processMaps();
