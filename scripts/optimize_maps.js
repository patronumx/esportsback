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
            // Only process PNGs
            if (file.match(/\.png$/i)) {
                const filePath = path.join(MAPS_DIR, file);
                const rawName = path.parse(file).name; // e.g. "ERANGEL"
                const newPath = path.join(MAPS_DIR, `${rawName}.jpg`);

                console.log(`Processing ${file}...`);

                const image = await Jimp.read(filePath);

                // Resize if huge, otherwise just convert
                // 3072px is a good balance for map details
                if (image.width > 3072 || image.height > 3072) {
                    console.log(`Resizing ${file} to 3072px...`);
                    image.resize({ w: 3072, h: 3072 }); // Aspect ratio? Maps usually sq.
                    // Use scaleToFit if not square? But user code assumes sq.
                }

                // Write as JPEG
                await image.write(newPath, { quality: 75 });
                console.log(`Saved optimized ${newPath}`);

                // Delete original PNG to save space and avoid confusion
                fs.unlinkSync(filePath);
                console.log(`Deleted original ${file}`);
            }
        }
        console.log('All maps processed and converted to JPEG.');
    } catch (error) {
        console.error('Error processing maps:', error);
    }
};

processMaps();
