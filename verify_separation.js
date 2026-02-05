async function verifySeparation() {
    const baseUrl = 'http://localhost:5000/api/moba';

    try {
        // 1. Register HOK Team
        console.log('--- Registering HOK Team ---');
        const hokRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamName: 'HOK Test Team',
                country: 'China',
                game: 'HOK',
                players: Array(5).fill().map((_, i) => ({ name: `HOK P${i}`, ign: `HOK${i}`, phone: '123', serverId: 'S1', deviceName: 'D1' })),
                substitutes: []
            })
        });
        console.log('HOK Register Status:', hokRes.status);
        if (hokRes.status !== 201) console.log(await hokRes.text());

        // 2. Register MLBB Team
        console.log('--- Registering MLBB Team ---');
        const mlbbRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamName: 'MLBB Test Team',
                country: 'Philippines',
                game: 'MLBB',
                players: Array(5).fill().map((_, i) => ({ name: `MLBB P${i}`, ign: `MLBB${i}`, phone: '123', serverId: 'S1', deviceName: 'D1' })),
                substitutes: []
            })
        });
        console.log('MLBB Register Status:', mlbbRes.status);

        // 3. Verify HOK Endpoint
        console.log('--- Verifying GET /hok/registrations ---');
        const getHok = await fetch(`${baseUrl}/hok/registrations`);
        const hokData = await getHok.json();
        const hokTeamFound = hokData.find(r => r.teamName === 'HOK Test Team');
        console.log('HOK Endpoint Count:', hokData.length);
        console.log('HOK Team Found in HOK Endpoint:', !!hokTeamFound);

        // 4. Verify MLBB Endpoint
        console.log('--- Verifying GET /mlbb/registrations ---');
        const getMlbb = await fetch(`${baseUrl}/mlbb/registrations`);
        const mlbbData = await getMlbb.json();
        const mlbbTeamFound = mlbbData.find(r => r.teamName === 'MLBB Test Team');
        console.log('MLBB Endpoint Count:', mlbbData.length);
        console.log('MLBB Team Found in MLBB Endpoint:', !!mlbbTeamFound);

        // 5. Cross Verification (Ensure strict separation)
        const hokInMlbb = mlbbData.find(r => r.teamName === 'HOK Test Team');
        const mlbbInHok = hokData.find(r => r.teamName === 'MLBB Test Team');
        console.log('HOK Team leaked to MLBB Endpoint:', !!hokInMlbb);
        console.log('MLBB Team leaked to HOK Endpoint:', !!mlbbInHok);

    } catch (error) {
        console.error('Verification Failed:', error);
    }
}

verifySeparation();
