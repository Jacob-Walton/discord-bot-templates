const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('../config');
const CommandHandler = require('./handlers/CommandHandler');
const EventHandler = require('./handlers/EventHandler');
const ComponentHandler = require('./handlers/ComponentHandler');
const ErrorHandler = require('./handlers/ErrorHandler');
const logger = require('./utils/Logger');
const DatabaseService = require('./services/DatabaseService');
const CacheService = require('./services/CacheService');

class Bot {
    constructor() {
        // Initialize services first
        this.services = {
            cache: new CacheService(),
            database: new DatabaseService(this.cache)
        };

        // Initialize Discord client
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction
            ]
        });

        // Attach essential properties to client
        this.client.logger = logger;
        this.client.config = config;
        this.client.services = this.services;

        // Initialize handlers after client is created
        this.handlers = {
            commands: new CommandHandler(this.client),
            events: new EventHandler(this.client),
            components: new ComponentHandler(this.client),
            errors: new ErrorHandler(this.client)
        };

        // Attach handlers to client after creation
        this.client.handlers = this.handlers;
    }

    async init() {
        try {
            logger.info('Initializing bot...');

            // Connect to database
            await this.services.database.connect();

            // Load all handlers
            await Promise.all([
                this.handlers.commands.loadCommands(),
                this.handlers.events.loadEvents(),
                this.handlers.components.loadComponents()
            ]);

            // Login to Discord
            await this.client.login(config.bot.token);

            logger.info('Bot initialization complete');
        } catch (error) {
            logger.error('Failed to initialize bot:', error);
            process.exit(1);
        }
    }

    async shutdown() {
        logger.info('Shutting down bot...');

        try {
            // Cleanup tasks
            if (this.client.isReady()) {
                await this.client.destroy();
            }

            await this.services.database.cleanup();
            
            logger.info('Bot shutdown complete');
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    }
}

// Create and start bot instance
const bot = new Bot();

// Handle process events
process.on('SIGINT', () => bot.shutdown());
process.on('SIGTERM', () => bot.shutdown());
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    bot.shutdown();
});

// Start the bot
bot.init().catch(error => {
    logger.error('Failed to start bot:', error);
    process.exit(1);
});