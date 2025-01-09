---
layout: default
title: Setup Guide
---

# Setup Guide

This guide will walk you through setting up the Discord bot on your server.

## Prerequisites

- Node.js version 20.0.0 or higher
- MongoDB server
- npm or pnpm package manager
- A Discord account with server administrator permissions

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name your application and click "Create"
4. Go to the "Bot" section
5. Click "Add Bot"
6. Copy your bot token (you'll need this later)
7. Under "Privileged Gateway Intents", enable:
   - Server Members Intent
   - Message Content Intent
   - Presence Intent

## Step 2: Clone and Install

1. Clone the repository:
```bash
git clone https://github.com/Jacob-Walton/discord-bot-templates.git
cd discord-bot-templates
```

2. Install dependencies:
```bash
npm install
# or if using pnpm
pnpm install
```

## Step 3: Configuration

1. Create a `.env` file in the root directory:
```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
MONGODB_URI=your_mongodb_connection_string
```

2. Make sure MongoDB is running and accessible

## Step 4: Database Setup

1. Create a MongoDB database
2. The bot will automatically create necessary collections:
   - `rolemenus` - for role selection menus
   - `feedback` - for user feedback
   - `settings` - for bot settings

## Step 5: Start the Bot

1. Development mode:
```bash
npm run dev
# or
pnpm dev
```

2. Production mode:
```bash
npm start
# or
pnpm start
```

## Step 6: Invite the Bot

1. Go to OAuth2 → URL Generator in the Discord Developer Portal
2. Select the following scopes:
   - `bot`
   - `applications.commands`
3. Select required permissions:
   - Manage Roles
   - Send Messages
   - Read Messages/View Channels
   - Use Slash Commands
   - Add Reactions
4. Copy and visit the generated URL to invite the bot to your server

## Step 7: Verify Installation

1. Use the `/ping` command to verify the bot is responding
2. Check the console for successful connection messages
3. Verify MongoDB connection in logs

## Setting Up Features

### Role Menu Setup

1. Use `/roles setup` command
2. Select the channel for the role menu
3. Choose roles to include
4. Confirm the setup

### Testing Features

1. Try the basic commands:
   ```
   /ping - Check bot response
   /feedback - Test feedback system
   /roles setup - Configure role selection
   ```

2. Verify role selection menu functionality:
   - Users can select roles
   - Roles are properly assigned/removed
   - Error messages display when needed

## Troubleshooting

### Common Issues

1. **Bot Not Responding**
   - Check if bot is online
   - Verify token in .env file
   - Check console for errors

2. **Database Connection Failed**
   - Verify MongoDB is running
   - Check connection string
   - Check network connectivity

3. **Role Management Issues**
   - Ensure bot role is higher than managed roles
   - Verify bot has proper permissions
   - Check error logs for details

### Error Logs

- Check `logs/error.log` for detailed error messages
- Development logs are more verbose
- Production logs focus on critical issues

## Maintenance

### Regular Tasks

1. Monitor log files
2. Check for updates:
```bash
npm outdated
# or
pnpm outdated
```

3. Update dependencies:
```bash
npm update
# or
pnpm update
```

### Backup

1. Regularly backup your MongoDB database
2. Keep a copy of your .env file
3. Backup any custom configurations

## Docker Support

If using Docker:

1. Build the image:
```bash
docker build -t discord-bot .
```

2. Run with Docker:
```bash
docker run -d \
  --name discord-bot \
  --env-file .env \
  discord-bot
```

## Development Setup

For contributors:

1. Fork the repository
2. Install development dependencies:
```bash
npm install --save-dev
```

3. Run tests:
```bash
npm test
```

4. Create a branch for your changes
5. Submit pull requests to main repository

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs
3. Use the `/feedback` command
4. Create an issue on GitHub