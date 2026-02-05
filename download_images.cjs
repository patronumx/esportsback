const fs = require('fs');
const https = require('https');
const path = require('path');

const downloadFile = (url, dest) => {
    const file = fs.createWriteStream(dest);
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    };

    https.get(url, options, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            downloadFile(response.headers.location, dest);
            return;
        }
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${dest}`);
        });
    }).on('error', (err) => {
        fs.unlink(dest, () => { });
        console.error(`Error downloading ${url}: ${err.message}`);
    });
};

downloadFile('https://c4.wallpaperflare.com/wallpaper/246/739/689/pubg-playerunknown-s-battlegrounds-battle-royale-video-game-wallpaper-preview.jpg', 'd:\\PATRONUM X\\Esports\\WEB\\esports\\esports\\src\\assets\\pubgm_team.jpg');
downloadFile('https://c4.wallpaperflare.com/wallpaper/787/754/339/pubg-playerunknown-s-battlegrounds-battle-royale-video-game-wallpaper-preview.jpg', 'd:\\PATRONUM X\\Esports\\WEB\\esports\\esports\\src\\assets\\pubgm_player.jpg');
