const winston = require('winston');
const path = require('path');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        this.safeStringify = (obj) => {
            const cache = new Set();
            return JSON.stringify(obj, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) {
                        return '[Circular Reference]';
                    }
                    cache.add(value);
                }
                if (value instanceof Error) {
                    return {
                        message: value.message,
                        stack: value.stack
                    };
                }
                return value;
            }, 2);
        };

        // Create logs directory if it doesn't exist
        const logsDir = path.join(process.cwd(), 'logs');
        if (!require('fs').existsSync(logsDir)) {
            require('fs').mkdirSync(logsDir);
        }

        // Track recent errors to prevent duplicates
        this.recentErrors = new Map();
        this.cleanupInterval = setInterval(() => this.cleanupOldErrors(), 60000);

        const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
            let output = `${timestamp} [${level}]: ${message}`;
            
            if (metadata.error) {
                output += `\nError: ${metadata.error.message}`;
                if (metadata.error.stack) {
                    output += `\nStack: ${metadata.error.stack}`;
                }
                delete metadata.error;
            }

            const metadataStr = this.safeStringify(metadata);
            if (metadataStr !== '{}') {
                output += `\nMetadata: ${metadataStr}`;
            }
            
            return output;
        });

        // Create logger instance
        this.logger = createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: combine(
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                errors({ stack: true })
            ),
            transports: [
                // Console transport
                new transports.Console({
                    format: combine(
                        colorize(),
                        customFormat
                    )
                }),
                // Combined log file
                new transports.File({
                    filename: path.join(logsDir, 'combined.log'),
                    format: customFormat,
                    maxsize: 10485760, // 10MB
                    maxFiles: 5
                }),
                // Error log file
                new transports.File({
                    filename: path.join(logsDir, 'error.log'),
                    format: customFormat,
                    level: 'error',
                    maxsize: 10485760,
                    maxFiles: 5
                }),
                // Exceptions log file
                new transports.File({
                    filename: path.join(logsDir, 'exceptions.log'),
                    format: customFormat,
                    handleExceptions: true,
                    handleRejections: true,
                    maxsize: 10485760,
                    maxFiles: 5
                })
            ]
        });

        Logger.instance = this;
    }

    cleanupOldErrors() {
        const now = Date.now();
        for (const [key, timestamp] of this.recentErrors.entries()) {
            if (now - timestamp > 300000) { // Remove errors older than 5 minutes
                this.recentErrors.delete(key);
            }
        }
    }

    isDuplicateError(error) {
        if (!error) return false;
        
        const errorKey = error.message + (error.stack?.split('\n')[1] || '');
        const lastOccurrence = this.recentErrors.get(errorKey);
        const now = Date.now();

        if (lastOccurrence && (now - lastOccurrence) < 300000) { // 5 minutes
            return true;
        }

        this.recentErrors.set(errorKey, now);
        return false;
    }

    info(message, meta = {}) {
        this.logger.info(message, meta);
    }

    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }

    error(message, error = null) {
        if (error instanceof Error) {
            if (this.isDuplicateError(error)) return;
            
            this.logger.error(message, {
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
        } else if (typeof error === 'object' && error !== null) {
            this.logger.error(message, { error });
        } else {
            this.logger.error(message, { error: error || 'Unknown error' });
        }
    }

    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }

    logCommand(command, user, guild, success = true) {
        this.logger.info('Command Executed', {
            command: command.name,
            user: {
                id: user.id,
                tag: user.tag
            },
            guild: {
                id: guild?.id,
                name: guild?.name
            },
            success
        });
    }

    logEvent(eventName, eventData = {}) {
        this.logger.debug('Event Triggered', {
            event: eventName,
            data: eventData
        });
    }
}

module.exports = new Logger();