// Helper to load from local storage
const loadEvents = () => {
    try {
        const stored = localStorage.getItem('pmgc_events_v3');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Quick fix to update title if it's the old one
            if (parsed[0].title !== 'Pro Teams Drop Spots') {
                parsed[0].title = 'Pro Teams Drop Spots';
                parsed[0].subtitle = '';
            }
            return parsed;
        }
    } catch (e) {
        console.error("Failed to load drops from storage", e);
    }

    return [
        {
            id: 'pmgc-2025',
            title: 'Pro Teams Drop Spots',
            subtitle: '',
            teams: DEFAULT_PMGC_TEAMS
        }
    ];
};

export const DEFAULT_PMGC_TEAMS = [
    { id: 'vpe', name: 'Vampire Esports', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/VPE.png', erangel: 'Prismorsk', miramar: 'Pecado', rondo: 'Tin Long Garden' },
    { id: 'dx', name: "D'Xavier", logo: '/src/assets/teamlogo/PMGC 2025/FINALS/DX.png', erangel: 'Pochinki', miramar: 'El Pozo', rondo: 'Hung Shan' },
    { id: 'ea', name: 'eArena', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/EA.png', erangel: 'Hospital', miramar: 'San Martin', rondo: 'Tin Long Garden' },
    { id: 'vp', name: 'Virtus.pro', logo: '/src/assets/teamlogo/PMGC 2025/GAUNTLET/VP.png', erangel: 'Lipovka', miramar: 'Puerto Paraiso', rondo: 'Stadium' },
    { id: 'apg', name: 'Alpha Gaming', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/APG.png', erangel: 'Military Base', miramar: 'Chumacera', rondo: 'Yu Lin' },
    { id: 'mad', name: 'MadBulls', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/MAD.png', erangel: 'Boatyard', miramar: 'La Cobreria', rondo: 'Nan Chuan' },
    { id: 'reg', name: 'Regnum Carya', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/REG.png', erangel: 'Rozhok', miramar: 'Pecado', rondo: 'Test Track' },
    { id: 'ulf', name: 'ULF Esports', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/ULF.png', erangel: 'School', miramar: 'Power Grid', rondo: 'Stadium' },
    { id: 'kara', name: 'Kara Esports', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/KARA.png', erangel: 'Farm', miramar: 'Hacienda Del Patron', rondo: 'Dan Ching' },
    { id: 'gs', name: 'GS Team', logo: '/src/assets/teamlogo/PMGC 2025/GAUNTLET/GS.png', erangel: 'Novo, Military Base', miramar: 'San Martin', rondo: 'Jadena City' },
    { id: 'r8', name: 'R8 Esports', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/R8.png', erangel: 'Hospital', miramar: 'San Martin', rondo: 'Rin Jiang' },
    { id: 'geekay', name: 'Geekay Esports', logo: '/src/assets/teamlogo/PMGC 2025/GAUNTLET/GEEKAY.png', erangel: 'Novorepnoye', miramar: 'El Azahar', rondo: 'Jadena City' },
    { id: 'wol', name: 'Wolves Esports', logo: '/src/assets/teamlogo/PMGC 2025/GAUNTLET/WOL.png', erangel: 'Gatka', miramar: 'Brick Yard', rondo: 'Jao Tin' },
    { id: 'a7', name: 'Alpha 7 esports', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/A7.png', erangel: 'Georgopol', miramar: 'El Pozo', rondo: 'Jao Tin' },
    { id: 'tt', name: 'Thundertalk Gaming', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/TT.png', erangel: 'Mylta', miramar: 'Minas Generales', rondo: 'Mey Ran' },
    { id: 'og', name: 'Orangutan', logo: '/src/assets/teamlogo/PMGC 2025/GAUNTLET/OG.png', erangel: 'Shelter', miramar: 'San Martin', rondo: 'Dan Ching' },
    { id: 'drx', name: 'DRX', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/DRX.png', erangel: 'Gatka', miramar: 'Los Leones', rondo: 'Bamboo' },
    { id: 'ae', name: 'Alter Ego Ares', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/AE.png', erangel: 'Lipovka, Mansion', miramar: 'El Azahar', rondo: 'Test Track' },
    { id: 'all', name: 'Alliance MY', logo: '/src/assets/teamlogo/PMGC 2025/RED/ALL.png', erangel: 'Farm', miramar: 'Cruz Del Valle', rondo: 'Long Ho' },
    { id: 'tf', name: 'Team Flash', logo: 'https://ui-avatars.com/api/?name=Team+Flash&background=random', erangel: 'Yasnaya Polyana', miramar: 'Los Leones', rondo: 'Joa Tin' },
    { id: 'ts', name: 'Team Secret', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/TS.png', erangel: 'Georgopol City', miramar: 'Minas Generales', rondo: 'Mey Ran' },
    { id: 'ic', name: 'Inner Circle Esports', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/IC.png', erangel: 'Ferry Pier', miramar: 'Pecado', rondo: 'Test Track' },
    { id: 'arc', name: 'Arcred', logo: '/src/assets/teamlogo/PMGC 2025/RED/ARC.png', erangel: 'School', miramar: 'Impala', rondo: 'Long Ho' },
    { id: 'goat', name: 'GOAT Team', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/GOAT.png', erangel: 'Pochinki', miramar: 'Hacienda Del Patron', rondo: 'Hung Shan' },
    { id: 'psm', name: 'Papara SuperMassive', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/PSM.png', erangel: 'Shelter, Prison', miramar: 'Truck Shop', rondo: 'Hung Shan' },
    { id: 'fl', name: 'Team Falcons', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/FL.png', erangel: 'Pochinki', miramar: 'El Pozo', rondo: 'Test Track' },
    { id: 'boars', name: 'Boars Gaming', logo: '/src/assets/teamlogo/PMGC 2025/RED/BOARS.png', erangel: 'Ferry Pier', miramar: 'Chumacera', rondo: 'Stadium' },
    { id: 'tm', name: 'Twisted Minds', logo: '/src/assets/teamlogo/PMGC 2025/RED/TM.png', erangel: 'Pochinki', miramar: 'El Pozo', rondo: 'Jao Tin' },
    { id: 'nz', name: 'Nuclear Zone', logo: '/src/assets/teamlogo/PMGC 2025/RED/NZ.png', erangel: 'Mylta Power', miramar: 'Impala', rondo: 'Rin Jiang' },
    { id: 'geng', name: 'Gen.G Esports', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/GENG.png', erangel: 'Ferry Pier', miramar: 'Hacienda Del Patron', rondo: 'Hemay Town' },
    { id: '9z', name: '9z Team', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/9Z.png', erangel: 'Yasnaya Polyana', miramar: 'Valle Del Mar', rondo: 'Tin Long Garden' },
    { id: 'inf', name: 'INFLUENCE Rage', logo: '/src/assets/teamlogo/PMGC 2025/RED/INF.png', erangel: 'Prismorsk', miramar: 'Hacienda Del Patron', rondo: 'Mey Ran' },
    { id: 'loops', name: 'Loops Esports', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/LOOPS.png', erangel: 'Georgopol', miramar: 'Power Grid', rondo: 'Yun Gu' },
    { id: 'etsh', name: 'ETSH Esports', logo: '/src/assets/teamlogo/PMGC 2025/RED/ETSH.png', erangel: 'Shelter, Prison', miramar: 'La Cobreria', rondo: 'Fong Tun' },
    { id: 'bg', name: 'Burmese Ghouls', logo: '/src/assets/teamlogo/PMGC 2025/RED/BG.png', erangel: 'Military Base', miramar: 'San Martin', rondo: 'Hung Shan' },
    { id: 'wbg', name: 'Weibo Gaming', logo: '/src/assets/teamlogo/PMGC 2025/RED/WBG.png', erangel: 'Severny', miramar: 'Monte Nuevo', rondo: 'Yu Lin' },
    { id: 'tia', name: 'Tianba', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/TIA.png', erangel: 'Mylta', miramar: 'La Cobreria', rondo: 'Dan Ching' },
    { id: 'dplus', name: 'Dplus', logo: '/src/assets/teamlogo/PMGC 2025/FINALS/DPLUS.png', erangel: 'School', miramar: 'Impala', rondo: 'Stadium' },
    { id: 'rc', name: 'Reject', logo: '/src/assets/teamlogo/PMGC 2025/GREEN/RC.png', erangel: 'Farm', miramar: 'Los Leones', rondo: 'Long Ho, Rin Jiang' },
    { id: 'tr', name: 'True Rippers', logo: '/src/assets/teamlogo/PMGC 2025/RED/TR.png', erangel: 'Mylta', miramar: 'Minas Generales', rondo: 'Tin Long Garden' }
];


export const EVENTS = loadEvents();

export const saveEvents = (events) => {
    localStorage.setItem('pmgc_events_v3', JSON.stringify(events));
    window.dispatchEvent(new Event('storage'));
};
