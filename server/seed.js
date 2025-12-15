const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('./models/Player');
const Team = require('./models/Team');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Data to Seed
const playersData = [
    {
        id: 1,
        ign: 'ShadowStrike',
        name: 'Ahmed Khan',
        role: 'IGL / Entry Fragger',
        initials: 'SS',
        stats: { kd: '3.2', winRate: '68', matches: '247' },
        achievements: ['PMGC 2024 - 3rd Place', 'PDC 2025 - Regional Champion', 'MVP - EWC Riyadh Qualifiers'],
        socials: { twitter: '#', instagram: '#' },
        bio: 'Veteran player with 5+ years of competitive experience. Known for aggressive playstyle and strategic in-game leadership.',
        joinDate: '2023-01',
        country: 'Pakistan'
    },
    {
        id: 2,
        ign: 'VortexPrime',
        name: 'Hassan Ali',
        role: 'Fragger',
        initials: 'VP',
        stats: { kd: '4.1', winRate: '72', matches: '198' },
        achievements: ['PMGC 2024 - Top 5', 'Highest K/D in PDC 2025', 'All-Star Team Selection'],
        socials: { twitter: '#', instagram: '#' },
        bio: 'Rising star known for exceptional aim and clutch performances under pressure.',
        joinDate: '2023-06',
        country: 'Pakistan'
    },
    {
        id: 3,
        ign: 'PhantomEdge',
        name: 'Usman Shah',
        role: 'Support / Scout',
        initials: 'PE',
        stats: { kd: '2.8', winRate: '65', matches: '223' },
        achievements: ['Best Support Player - PMGC 2024', 'PDC 2025 - 2nd Place', 'Regional MVP x2'],
        socials: { twitter: '#', instagram: '#' },
        bio: 'Tactical genius who excels at information gathering and team coordination.',
        joinDate: '2023-03',
        country: 'Pakistan'
    },
    {
        id: 4,
        ign: 'NovaBlaze',
        name: 'Bilal Raza',
        role: 'Anchor',
        initials: 'NB',
        stats: { kd: '3.5', winRate: '70', matches: '215' },
        achievements: ['PMGC 2024 Finals Qualifier', 'Best Defensive Player', 'Tournament MVP - Winter Series'],
        socials: { twitter: '#', instagram: '#' },
        bio: 'Defensive specialist who can hold any position against overwhelming odds.',
        joinDate: '2023-04',
        country: 'Pakistan'
    },
    {
        id: 5,
        ign: 'CrimsonWave',
        name: 'Zain Malik',
        role: 'Flex / All-Rounder',
        initials: 'CW',
        stats: { kd: '3.0', winRate: '67', matches: '189' },
        achievements: ['PDC 2025 - Top Fragger', 'Rookie of the Year 2024', 'Most Improved Player'],
        socials: { twitter: '#', instagram: '#' },
        bio: 'Versatile player who can adapt to any role and situation with ease.',
        joinDate: '2023-09',
        country: 'Pakistan'
    }
];

const teamsData = [
    // Gauntlet Teams (Sample)
    {
        id: 'alpha-gaming',
        name: 'Alpha Gaming',
        logo: '/assets/GAUNTLET STAGE/Alpha Gaming/900px-Alpha_Gaming_2024_allmode.png',
        region: 'PMSL CSA',
        stage: 'gauntlet',
        players: [
            { name: 'TOP', image: '/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/TOP.png' },
            { name: 'BARON', image: '/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/BARON.png' },
            { name: 'DOK', image: '/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/DOK.png' },
            { name: 'REFUSS', image: '/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/REFUSS.png' },
            { name: 'ZYOLL', image: '/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/ZYOLL.png' },
            { name: 'EAST', image: '/assets/GAUNTLET STAGE/Alpha Gaming/PLAYERS/EAST.png' }
        ]
    },
    {
        id: 'dxavier',
        name: "D'Xavier",
        logo: "/assets/GAUNTLET STAGE/D'Xavier/900px-Dingoz_Xavier_2024_allmode.png",
        region: 'PMSL SEA',
        stage: 'gauntlet',
        players: [
            { name: 'SHIN', image: "/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/SHIN.png" },
            { name: 'NADETII', image: "/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/NADETII.png" },
            { name: 'PARAJIN', image: "/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/PARAJIN.png" },
            { name: 'LEVIS', image: "/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/LEVIS.png" },
            { name: 'LAMBORGHINI', image: "/assets/GAUNTLET STAGE/D'Xavier/PLAYERS/LAMBORGHINI.png" }
        ]
    },
    // Group Green (Sample)
    {
        id: 'alter-ego',
        name: 'Alter Ego Ares',
        logo: '/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/900px-Alter_Ego_2022_allmode.png',
        region: 'PMSL SEA',
        qualifiedFrom: 'Indonesia Points',
        stage: 'group_green',
        players: [
            { name: 'ALVA', image: '/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/ALVA.png' },
            { name: 'KRYPTON', image: '/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/KRYPTON.png' },
            { name: 'MOANA', image: '/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/MOANA.png' },
            { name: 'ROSEMARY', image: '/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/ROSEMARY.png' },
            { name: 'SNAPE', image: '/assets/GROUP STAGE/GROUP GREEN/Alter Ego Ares/PLAYERS/SNAPE.png' }
        ]
    }
];

const seedDB = async () => {
    try {
        await Player.deleteMany({});
        await Team.deleteMany({});
        await Admin.deleteMany({});

        await Player.insertMany(playersData);
        await Team.insertMany(teamsData);

        console.log('Database Seeded Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();
