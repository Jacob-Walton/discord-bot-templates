---
layout: default
title: Configuration
---

# Bot Configuration

This guide explains how to configure the bot for your server. The bot uses environment variables and MongoDB for configuration management.

## Environment Variables

Create a `.env` file in your bot's root directory with the following variables:

```env
# Required Variables
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id

# Optional Variables
PREFIX=your_preferred_prefix
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_SSL_CA=path_to_ssl_ca_file
MONGODB_SSL_CERT=path_to_ssl_cert_file
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `BOT_TOKEN` | Your Discord bot token from the Discord Developer Portal |
| `CLIENT_ID` | Your bot's application ID from the Discord Developer Portal |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PREFIX` | Command prefix for the bot | "" |
| `NODE_ENV` | Environment setting (development/production) | "development" |

### Database Configuration

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string | 
| `MONGODB_SSL_CA` | Path to SSL CA file (if using SSL) |
| `MONGODB_SSL_CERT` | Path to SSL certificate file (if using SSL) |

## Database Models

### Role Menu Configuration

The bot stores role menu configurations in MongoDB with the following schema:

```javascript
{
    guildId: String,     // Discord server ID
    channelId: String,   // Channel where menu is posted
    messageId: String,   // Message ID of the menu
    roles: [String]      // Array of role IDs
}
```

### Feedback Storage

Feedback submissions are stored with the following schema:

```javascript
{
    userId: String,      // User who submitted feedback
    title: String,       // Feedback title
    feedback: String,    // Feedback content
    createdAt: Date,     // Submission timestamp
    updatedAt: Date      // Last update timestamp
}
```

## Cache Configuration

The bot uses an in-memory cache system with the following default settings:

- Default TTL: 300 seconds (5 minutes)
- Check period: 60 seconds
- No cloning of stored objects

Cache settings can be modified in `src/services/CacheService.js`.

## Logging Configuration

The bot uses Winston for logging with the following configurations:

### Log Levels

- Production: `info` and above
- Development: `debug` and above

### Log Files

Logs are stored in the `logs` directory:
- `combined.log`: All logs
- `error.log`: Error-level logs only
- `exceptions.log`: Unhandled exceptions

Each log file has:
- Maximum size: 10MB
- Maximum files: 5 (rotation)

## Security Considerations

1. Keep your `.env` file secure and never commit it to version control
2. Use strong MongoDB credentials
3. Enable SSL for database connections in production
4. Set appropriate file permissions for log files
5. Regularly rotate log files and monitor disk usage

## Development Configuration

When running in development mode:
- More verbose logging is enabled
- Cache duration may be reduced
- Additional debugging information is available

## Production Configuration

For production deployments:
1. Set `NODE_ENV=production`
2. Enable SSL for MongoDB connection
3. Configure proper log rotation
4. Use a process manager like PM2
5. Set up monitoring and alerting

## Troubleshooting

Common configuration issues and solutions:

1. **Bot Won't Start**
   - Verify all required environment variables are set
   - Check MongoDB connection string
   - Ensure bot token is valid

2. **Database Connection Issues**
   - Verify MongoDB is running
   - Check network connectivity
   - Validate SSL certificates if using SSL

3. **Logging Issues**
   - Ensure write permissions for logs directory
   - Check available disk space
   - Verify log rotation settings

## Update Configuration

To update the bot's configuration:
1. Stop the bot
2. Modify environment variables or database settings
3. Restart the bot to apply changes

Configuration changes requiring a restart:
- Environment variables
- Database connection settings
- Logging configuration