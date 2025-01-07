require('dotenv').config();

const config = {
    bot: {
        token: process.env.BOT_TOKEN,
        clientId: process.env.CLIENT_ID,
        prefix: process.env.PREFIX || '',
        devs: (process.env.DEV_IDS || '').split(',').filter(Boolean),
    },
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-bot'
    },
    env: process.env.NODE_ENV || 'development',
}

const required = ['BOT_TOKEN', 'CLIENT_ID'];
const missing = required.filter(key => !process.env[key]);

if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

module.exports = config;