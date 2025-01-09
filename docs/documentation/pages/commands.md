---
layout: default
title: Bot Commands
---

# Bot Commands

This page lists all available commands for the bot. Each command is prefixed with `/` as they are slash commands.

## General Commands

### `/ping`
Checks the bot's latency and API response time.
- No additional parameters required
- Shows both bot latency and Discord API latency
- Example response:

    ```
    Bot latency: 10ms
    API latency: 20ms
    ```

### `/feedback`
Submit feedback about the bot.
- Opens a modal dialog with two fields:
- Title: Brief description of your feedback
- Description: Detailed feedback message
- Requirements:
- Title must be between 3-100 characters
- Description must be between 10-1000 characters

## Role Management

### `/roles setup`
Sets up a role selection menu in a specified channel.
- Required Permissions: Manage Roles
- Parameters:
- `channel`: The channel where the role menu will be posted
- Process:
1. Select the roles you want to include in the menu
2. Click Confirm to create the menu
3. Users can then select/deselect roles from the created menu
- Notes:
- The bot's highest role must be above the roles it's managing
- Cannot manage roles that are higher than the bot's highest role
- Maximum of 25 roles can be added to a single menu

### `/roles cancel`
Cancels the current role menu setup process.
- Required Permissions: Manage Roles
- No additional parameters required
- Useful if you need to abort the setup process

## Role Menu Features

Once a role menu is set up, users can:
- Select multiple roles at once
- Remove roles by deselecting them
- See clear feedback about which roles were added/removed
- Get error messages if role changes fail

## Error Handling

All commands include built-in error handling that will:
- Notify users if they lack required permissions
- Provide feedback if an operation fails
- Give clear instructions on how to resolve common issues
- Maintain audit logs for server administrators

## Technical Notes

- All commands use Discord's slash command system
- Commands are automatically registered globally
- Response times are optimized through caching
- Error logs are maintained for troubleshooting

## Support

If you encounter any issues with these commands:
1. Check that the bot has the required permissions
2. Verify that role hierarchies are correctly set up
3. Use the `/feedback` command to report problems
4. Ensure you're using the latest version of Discord