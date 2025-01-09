---
layout: default
title: Development Guide
---

# Development Guide

This document covers everything you need to know about developing and contributing to the Discord bot.

## Project Structure

```
├── src/
│   ├── commands/          # Bot commands
│   ├── components/        # Discord UI components
│   ├── database/         # Database models
│   ├── events/           # Discord event handlers
│   ├── handlers/         # System handlers
│   ├── services/         # Core services
│   └── utils/            # Utility functions
├── tests/                # Test files
└── docs/                 # Documentation
```

## Core Components

### Command Handler
- Located in `src/handlers/CommandHandler.js`
- Automatically loads commands from the commands directory
- Handles command registration with Discord
- Manages command execution and error handling

### Event Handler
- Located in `src/handlers/EventHandler.js`
- Loads event handlers dynamically
- Manages Discord events like messages, interactions, etc.
- Provides logging for event execution

### Component Handler
- Located in `src/handlers/ComponentHandler.js`
- Manages Discord UI components (buttons, select menus, modals)
- Handles component interactions and state management

## Services

### Cache Service
```javascript
// Example usage
const cache = new CacheService({
    stdTTL: 300,  // 5 minutes
    checkperiod: 60
});

await cache.set('key', value, ttl);
const data = await cache.get('key');
```

### Database Service
```javascript
// Example usage
const db = new DatabaseService(cacheService);
await db.connect();

const document = await db.findById(Model, id);
const newDoc = await db.create(Model, data);
```

### API Service
```javascript
// Example usage
const response = await APIService.get(url);
await APIService.post(url, data);
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
- Uses Jest testing framework
- Mock utilities available in `tests/utils/testUtils.js`
- Tests are located next to the files they test
- Follows naming convention: `[filename].test.js`

### Example Test
```javascript
const { createMockInteraction } = require('../utils/testUtils');

describe('Command Name', () => {
    let interaction;

    beforeEach(() => {
        interaction = createMockInteraction();
    });

    it('should do something', async () => {
        // Test implementation
        expect(result).toBe(expectedValue);
    });
});
```

## Utility Functions

### Validators
```javascript
const { isValidUrl, isValidEmail } = require('./utils/Validators');

// Available validators
isValidUrl(string)
isValidEmail(email)
isValidHexColor(color)
isValidUsername(username)
isValidDiscordId(id)
isValidPermission(permission)
```

### Helpers
```javascript
const { chunk, delay, generateId } = require('./utils/Helpers');

// Available helpers
chunk(array, size)           // Split array into chunks
delay(ms)                    // Promise-based delay
generateId(length)          // Generate random ID
formatDuration(ms)          // Format milliseconds to duration
paginate(items, page, size) // Paginate array of items
```

## Error Handling

### Error Handler Class
```javascript
const ErrorHandler = require('./handlers/ErrorHandler');

// Handles:
// - Discord.js specific errors
// - Process-wide errors
// - Unhandled rejections
// - Graceful shutdown
```

### Logging
```javascript
const logger = require('./utils/Logger');

logger.info('Message');
logger.warn('Warning message');
logger.error('Error message', error);
logger.debug('Debug message');
```

## Development Workflow

1. Create Feature Branch
```bash
git checkout -b feature/feature-name
```

2. Make Changes
- Follow existing code style
- Add tests for new features
- Update documentation when needed

3. Run Tests
```bash
npm test
```

4. Commit Changes
```bash
git add .
git commit -m "Description of changes"
```

5. Submit Pull Request
- Provide clear description of changes
- Reference any related issues
- Ensure tests pass
- Wait for review

## Environment Setup

1. Development Environment
```env
NODE_ENV=development
BOT_TOKEN=your_bot_token
CLIENT_ID=your_client_id
MONGODB_URI=mongodb://localhost:27017/discord-bot
```

2. Testing Environment
```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/discord-bot-test
```

## Database Models

### RoleMenu Model
```javascript
{
    guildId: String,    // Required
    channelId: String,  // Required
    messageId: String,  // Required
    roles: [String]     // Required
}
```

### Feedback Model
```javascript
{
    userId: String,   // Required
    title: String,    // Required
    feedback: String  // Required
}
```

## Contributing Guidelines

1. Code Style
- Use consistent spacing (2 spaces)
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions

2. Testing Requirements
- Write tests for new features
- Maintain high test coverage
- Use appropriate mocks and fixtures

3. Documentation
- Update relevant documentation
- Add JSDoc comments
- Include code examples

4. Pull Request Process
- Create feature branch
- Write clear commit messages
- Add tests
- Update documentation
- Submit PR with description

## Performance Considerations

- Use caching appropriately
- Optimize database queries
- Handle rate limits properly
- Monitor memory usage
- Log performance metrics

## Security Best Practices

- Validate all inputs
- Use environment variables
- Implement rate limiting
- Follow principle of least privilege
- Keep dependencies updated