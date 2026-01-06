export const tournaments = {
  upcoming: [
    {
      name: 'PMGC 2025 Grand Finals',
      date: 'March 15-20, 2025',
      location: 'Istanbul, Turkey',
      prize: '$4,000,000',
      teams: 32,
      status: 'Qualified',
      format: 'Double Elimination',
      region: 'International'
    },
    {
      name: 'PDC Spring Championship',
      date: 'February 10-14, 2025',
      location: 'Online',
      prize: '$500,000',
      teams: 24,
      status: 'Registered',
      format: 'Round Robin + Playoffs',
      region: 'APAC'
    },
    {
      name: 'EWC 2025 Riyadh',
      date: 'July 5-12, 2025',
      location: 'Riyadh, Saudi Arabia',
      prize: '$5,000,000',
      teams: 40,
      status: 'In Qualifiers',
      format: 'Swiss System',
      region: 'International'
    }
  ],
  past: [
    {
      name: 'PDC 2025 Winter Regional',
      date: 'January 8-12, 2025',
      location: 'Online',
      prize: '$200,000',
      placement: '1st Place',
      earned: '$45,000',
      teams: 20,
      stats: {
        wins: 15,
        losses: 2,
        winRate: '88%',
        totalKills: 342
      }
    },
    {
      name: 'PMGC 2024 Grand Finals',
      date: 'December 10-15, 2024',
      location: 'Bangkok, Thailand',
      prize: '$3,000,000',
      placement: '3rd Place',
      earned: '$180,000',
      teams: 32,
      stats: {
        wins: 12,
        losses: 8,
        winRate: '60%',
        totalKills: 287
      }
    },
    {
      name: 'EWC 2024 Riyadh',
      date: 'November 5-10, 2024',
      location: 'Riyadh, Saudi Arabia',
      prize: '$4,500,000',
      placement: '5-8th Place',
      earned: '$95,000',
      teams: 40,
      stats: {
        wins: 8,
        losses: 6,
        winRate: '57%',
        totalKills: 218
      }
    },
    {
      name: 'Pakistan National Championship',
      date: 'October 20-25, 2024',
      location: 'Karachi, Pakistan',
      prize: '$50,000',
      placement: '1st Place',
      earned: '$25,000',
      teams: 16,
      stats: {
        wins: 12,
        losses: 0,
        winRate: '100%',
        totalKills: 198
      }
    }
  ],
  bracket: {
    rounds: [
      {
        name: 'Quarter Finals',
        date: 'Jan 15, 2025',
        matches: [
          {
            team1: { name: 'Patronum', seed: 1, score: 2 },
            team2: { name: 'Team Alpha', seed: 8, score: 0 },
            winner: 'Patronum',
            status: 'Completed'
          },
          {
            team1: { name: 'Team Beta', seed: 4, score: 1 },
            team2: { name: 'Team Gamma', seed: 5, score: 2 },
            winner: 'Team Gamma',
            status: 'Completed'
          }
        ]
      },
      {
        name: 'Semi Finals',
        date: 'Jan 18, 2025',
        matches: [
          {
            team1: { name: 'Patronum', seed: 1, score: 2 },
            team2: { name: 'Team Gamma', seed: 5, score: 1 },
            winner: 'Patronum',
            status: 'Completed'
          }
        ]
      },
      {
        name: 'Grand Finals',
        date: 'Jan 20, 2025',
        matches: [
          {
            team1: { name: 'Patronum', seed: 1, score: 3 },
            team2: { name: 'Team Omega', seed: 2, score: 1 },
            winner: 'Patronum',
            status: 'Completed'
          }
        ]
      }
    ]
  }
};
