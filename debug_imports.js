console.log('1. Loading dotenv');
require('dotenv').config();

console.log('2. Loading mongoose');
require('mongoose');

console.log('3. Loading Event Model');
try {
    require('./models/Event');
    console.log('   Success');
} catch (e) {
    console.error('   Failed:', e);
}

console.log('4. Loading Whatsapp Service');
try {
    require('./services/whatsappService');
    console.log('   Success');
} catch (e) {
    console.error('   Failed:', e);
}

console.log('5. Loading Notification Scheduler');
try {
    require('./services/notificationScheduler');
    console.log('   Success');
} catch (e) {
    console.error('   Failed:', e);
}

console.log('Done.');
