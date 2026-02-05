const API_URL = 'http://localhost:5000/api';
let adminToken = '';
let teamToken = '';
let teamId = '';
let feedbackId = '';

const loginAdmin = async () => {
    try {
        const res = await fetch(`${API_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (res.ok) {
                adminToken = data.token;
                console.log('Admin Login: SUCCESS');
            } else {
                console.error('Admin Login: FAILED', data);
            }
        } catch (e) {
            console.error('Admin Login: ERROR (Non-JSON response)', text.substring(0, 200));
        }
    } catch (err) {
        console.error('Admin Login: ERROR', err.message);
    }
};

const testSearch = async () => {
    try {
        console.log('\n--- Testing Search ---');

        // Search Teams
        const teamsRes = await fetch(`${API_URL}/admin/team?search=T`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const teams = await teamsRes.json();
        console.log(`Search Teams (query='T'): Found ${teams.length} teams`);

        // Search Events
        const eventsRes = await fetch(`${API_URL}/admin/event?search=P`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const events = await eventsRes.json();
        console.log(`Search Events (query='P'): Found ${events.length} events`);

        // Search Media
        const mediaRes = await fetch(`${API_URL}/admin/media?search=Thumb`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const media = await mediaRes.json();
        console.log(`Search Media (query='Thumb'): Found ${media.length} media items`);

        // Search Players
        const playersRes = await fetch(`${API_URL}/admin/team/players?search=a`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const players = await playersRes.json();
        console.log(`Search Players (query='a'): Found ${players.length} players`);

    } catch (err) {
        console.error('Search Test: FAILED', err.message);
    }
};

const testNotifications = async () => {
    try {
        console.log('\n--- Testing Notifications ---');

        // 1. Get Pending Feedback
        const feedbacksRes = await fetch(`${API_URL}/admin/feedback/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const feedbacks = await feedbacksRes.json();

        if (feedbacks.length > 0) {
            feedbackId = feedbacks[0]._id;
            console.log(`Found pending feedback: ${feedbackId}`);

            // Update Feedback Status -> Should trigger notification
            const updateRes = await fetch(`${API_URL}/admin/feedback/${feedbackId}/resolve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify({ status: 'In Progress' })
            });

            if (updateRes.ok) {
                console.log('Feedback status updated to In Progress');
                console.log('Notification triggered for Team. (Verification requires Team Login)');
            } else {
                console.log('Failed to update feedback');
            }
        } else {
            console.log('No pending feedback to update.');
        }

    } catch (err) {
        console.error('Notification Test: FAILED', err.message);
    }
};

const run = async () => {
    await loginAdmin();
    if (adminToken) {
        await testSearch();
        await testNotifications();
    }
};

run();
