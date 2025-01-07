const mongoose = require('mongoose');
const logger = require('../utils/Logger');
const config = require('../../config');

const models = {
    Guild: require('./models/Guild'),
    User: require('./models/User'),
    Setting: require('./models/Setting'),
};

// Export models and connection handling
module.exports = {
    models,
    async connect() {
        try {
            await mongoose.connect(config.database.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            logger.info('MongoDB connected successfully');
        } catch (error) {
            logger.error('MongoDB connection error:', error);
            throw error;
        }
    }
};