const generateDummyAnalytics = (teamId) => {
    return {
        followers: Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000,
        reach: Math.floor(Math.random() * (200000 - 1000 + 1)) + 1000,
        engagementRate: (Math.random() * (15 - 1) + 1).toFixed(2),
        impressions: Math.floor(Math.random() * (300000 - 5000 + 1)) + 5000,
        topPosts: [
            { title: 'Championship Win', likes: 1200, comments: 300, impressions: 5000 },
            { title: 'New Roster Announce', likes: 900, comments: 150, impressions: 3500 },
            { title: 'Scrim Highlights', likes: 600, comments: 80, impressions: 2000 }
        ]
    };
};

module.exports = { generateDummyAnalytics };
