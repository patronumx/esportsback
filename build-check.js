import { execSync } from 'child_process';

console.log('Checking build environment...');

// Vercel sets VERCEL=1.
// Heroku sets DYNO (and others).
// We want to build on Vercel AND Local, but SKIP on Heroku.

const isVercel = process.env.VERCEL === '1';
const isHeroku = !!process.env.DYNO;

if (isVercel || !isHeroku) {
    console.log('Environment is Vercel or Local. Starting Frontend Build...');
    try {
        execSync('npx vite build', { stdio: 'inherit' });
        console.log('Frontend Build Complete.');
    } catch (error) {
        console.error('Frontend Build Failed:', error);
        process.exit(1);
    }
} else {
    console.log('Environment is Heroku. Skipping Frontend Build to save slug size.');
}
