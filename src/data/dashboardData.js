import { pmgcTeams } from './pmgcTeams';

// Helper function to generate team email from team name
const generateTeamEmail = (teamName) => {
    return teamName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/\s+/g, '') + '@patronum.com';
};

// Generate dashboard users from all teams
export const dashboardUsers = [];

// Add teams from gauntlet stage
pmgcTeams.gauntlet.forEach(team => {
    dashboardUsers.push({
        email: generateTeamEmail(team.name),
        password: 'patronum2025',
        teamName: team.name,
        teamId: team.id,
        teamLogo: team.logo,
        region: team.region,
        role: 'team-manager'
    });
});

// Add teams from group stage green
pmgcTeams.groupStage.green.forEach(team => {
    if (!team.isPlaceholder) {
        dashboardUsers.push({
            email: generateTeamEmail(team.name),
            password: 'patronum2025',
            teamName: team.name,
            teamId: team.id,
            teamLogo: team.logo,
            region: team.region,
            role: 'team-manager'
        });
    }
});

// Add teams from group stage red
pmgcTeams.groupStage.red.forEach(team => {
    if (!team.isPlaceholder) {
        dashboardUsers.push({
            email: generateTeamEmail(team.name),
            password: 'patronum2025',
            teamName: team.name,
            teamId: team.id,
            teamLogo: team.logo,
            region: team.region,
            role: 'team-manager'
        });
    }
});

// Add admin user
dashboardUsers.push({
    email: 'admin@patronum.com',
    password: 'admin2025',
    teamName: 'Patronum Admin',
    teamId: 'admin',
    teamLogo: null,
    region: 'Global',
    role: 'admin'
});

// Helper to generate random numbers within a range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate team-specific dashboard stats
export const generateTeamDashboardStats = (teamId, teamData) => {
    const players = teamData?.players || [];





    // Real tournament data (PMGC 2024 & PMSL 2024)
    const recentTournaments = [
        {
            id: 'pmgc-2024',
            name: 'PMGC 2024 Grand Finals',
            date: '2024-12-08',
            placement: teamData?.name === 'Dplus' ? '1st' :
                teamData?.name === 'Regnum Carya Esports' ? '2nd' :
                    teamData?.name === 'Alpha7 Esports' ? '11th' :
                        teamData?.name === 'Vampire Esports' ? '17th' : // Did not make finals, placed in league
                            teamData?.name === 'Stalwart Esports' ? '18th' : // Did not make finals
                                'Qualified',
            prize: teamData?.name === 'Dplus' ? '$426,000' :
                teamData?.name === 'Regnum Carya Esports' ? '$240,250' :
                    teamData?.name === 'Alpha7 Esports' ? '$75,500' :
                        '-',
            points: teamData?.name === 'Dplus' ? 153 :
                teamData?.name === 'Regnum Carya Esports' ? 152 :
                    teamData?.name === 'Alpha7 Esports' ? 95 :
                        0
        },
        {
            id: 'pmsl-sea-fall-2024',
            name: 'PMSL SEA Fall 2024',
            date: '2024-09-08',
            placement: teamData?.name === 'Vampire Esports' ? '1st' :
                teamData?.name === 'D\'Xavier' ? '2nd' :
                    teamData?.name === 'Alter Ego Ares' ? '15th' :
                        teamData?.name === 'Team Secret' ? '4th' :
                            'Participated',
            prize: teamData?.name === 'Vampire Esports' ? '$46,000' :
                teamData?.name === 'D\'Xavier' ? '$28,000' :
                    '-',
            points: teamData?.name === 'Vampire Esports' ? 179 :
                teamData?.name === 'D\'Xavier' ? 145 :
                    0
        },
        {
            id: 'pmsl-csa-fall-2024',
            name: 'PMSL CSA Fall 2024',
            date: '2024-09-14',
            placement: teamData?.name === '4Merical Vibes' ? '1st' :
                teamData?.name === 'Falcons Force' ? '2nd' :
                    teamData?.name === 'Stalwart Esports' ? '3rd' :
                        'Participated',
            prize: teamData?.name === '4Merical Vibes' ? '$35,000' :
                '-',
            points: teamData?.name === '4Merical Vibes' ? 173 :
                teamData?.name === 'Falcons Force' ? 164 :
                    0
        }
    ];

    // PMGC 2024 Final Standings (Top 5)
    const tournamentStandings = [
        { rank: 1, team: 'Dplus KIA', points: 153, wwcd: 2, prize: '$426,000' },
        { rank: 2, team: 'Regnum Carya', points: 152, wwcd: 3, prize: '$240,250' },
        { rank: 3, team: 'Nigma Galaxy', points: 137, wwcd: 2, prize: '$168,000' },
        { rank: 4, team: 'Influence Rage', points: 117, wwcd: 1, prize: '$129,000' },
        { rank: 5, team: 'VOIN Donkey ID', points: 112, wwcd: 1, prize: '$102,750' },
    ];

    return {
        home: {
            reels: randomInt(80, 200),
            photos: randomInt(400, 1200),
            interviews: randomInt(15, 40),
            sponsorClips: randomInt(30, 80),
        },
        contentLog: [
            {
                id: 1,
                title: `${teamData?.name || 'Team'} - PMGC 2024 Highlights`,
                status: 'posted',
                link: '#',
                date: '2024-12-10'
            },
            {
                id: 2,
                title: 'Winner Interview - Grand Finals',
                status: 'delivered',
                link: '#',
                date: '2024-12-09'
            },
            {
                id: 3,
                title: 'Sponsor Spotlight - Red Bull',
                status: 'in-edit',
                link: '#',
                date: '2024-12-08'
            },
            {
                id: 4,
                title: 'Behind The Scenes - London Finals',
                status: 'raw',
                link: '#',
                date: '2024-12-07'
            },
            {
                id: 5,
                title: 'Player Profile Series - 2025 Season Prep',
                status: 'in-edit',
                link: '#',
                date: '2025-01-15'
            },
            {
                id: 6,
                title: 'Thumb Video',
                status: 'raw',
                link: '#',
                date: '2025-01-20'
            },
            {
                id: 7,
                title: 'Media 1',
                status: 'delivered',
                link: '#',
                date: '2025-01-21'
            },
            {
                id: 8,
                title: 'Media 2',
                status: 'posted',
                link: '#',
                date: '2025-01-22'
            },
        ],
        sponsorExposure: [
            {
                brand: 'Red Bull',
                appearances: randomInt(80, 150),
                type: 'Jersey Logo',
                screenshots: randomInt(20, 40)
            },
            {
                brand: 'Logitech',
                appearances: randomInt(60, 120),
                type: 'Peripherals',
                screenshots: randomInt(15, 30)
            },
            {
                brand: 'Samsung',
                appearances: randomInt(40, 100),
                type: 'Device Usage',
                screenshots: randomInt(10, 25)
            },
            {
                brand: 'HyperX',
                appearances: randomInt(30, 80),
                type: 'Audio Equipment',
                screenshots: randomInt(8, 20)
            },
        ],
        socialInsights: {
            totalEngagement: `${(randomInt(15, 35) / 10).toFixed(1)}M`,
            bestPerformingClip: players[0]?.name
                ? `${players[0].name} Clutch - PMGC Finals`
                : 'Top Performance Highlight',
            growth: `+${randomInt(10, 25)}%`,
            avgViewsPerPost: `${randomInt(150, 450)}K`,
            topPlatform: ['Instagram', 'TikTok', 'YouTube'][randomInt(0, 2)]
        },
        playerVisibility: players.slice(0, 5).map((player, idx) => ({
            name: player.name,
            views: `${(randomInt(500, 1500) / 1000).toFixed(1)}M`,
            match: ['High', 'Medium', 'High', 'Medium', 'Low'][idx % 5],
            sponsorMatches: randomInt(3, 8),
            profileImage: player.image
        })),
        sponsorROI: {
            totalValue: `$${randomInt(50, 200)}K`,
            impressions: `${randomInt(5, 15)}M`,
            engagementRate: `${(randomInt(25, 65) / 10).toFixed(1)}%`,
            reportAvailable: true,
            lastUpdated: '2025-01-20'
        },
        recentTournaments,
        tournamentStandings,
        teamRoster: players
    };
};

// Get dashboard data for a specific team
export const getDashboardDataForTeam = (teamId) => {
    let teamData = null;
    teamData = pmgcTeams.gauntlet.find(t => t.id === teamId);
    if (!teamData) {
        teamData = pmgcTeams.groupStage.green.find(t => t.id === teamId);
    }
    if (!teamData) {
        teamData = pmgcTeams.groupStage.red.find(t => t.id === teamId);
    }
    return generateTeamDashboardStats(teamId, teamData);
};

// Admin dashboard stats
export const adminDashboardStats = {
    home: {
        reels: 3542,
        photos: 18650,
        interviews: 487,
        sponsorClips: 1234,
    },
    contentLog: [
        { id: 1, title: 'PMGC 2025 - Day 1 Recap', status: 'posted', link: '#' },
        { id: 2, title: 'All Teams Arrival Montage', status: 'delivered', link: '#' },
        { id: 3, title: 'Venue Setup Timelapse', status: 'in-edit', link: '#' },
        { id: 4, title: 'Opening Ceremony BTS', status: 'raw', link: '#' },
    ],
    sponsorExposure: [
        { brand: 'Red Bull', appearances: 2850, type: 'Global Partner' },
        { brand: 'Samsung', appearances: 2100, type: 'Official Mobile' },
        { brand: 'Logitech', appearances: 1750, type: 'Gaming Gear' },
    ],
    socialInsights: {
        totalEngagement: '45.8M',
        bestPerformingClip: 'PMGC 2025 Announcement Trailer',
        growth: '+32%',
    },
    playerVisibility: [
        { name: 'Top Players Aggregate', views: '25M', match: 'High' },
    ],
};
