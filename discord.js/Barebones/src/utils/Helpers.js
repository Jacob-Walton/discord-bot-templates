const { Collection } = require('discord.js');
const crypto = require('crypto');

class Helpers {
    static chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static generateId(length = 10) {
        return crypto.randomBytes(length).toString('hex');
    }

    static formatDuration(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));

        return {
            days,
            hours,
            minutes,
            seconds,
            toString() {
                const parts = [];
                if (days) parts.push(`${days}d`);
                if (hours) parts.push(`${hours}h`);
                if (minutes) parts.push(`${minutes}m`);
                if (seconds) parts.push(`${seconds}s`);
                return parts.join(' ') || '0s';
            }
        };
    }

    static paginate(items, page = 1, pageSize = 10) {
        const maxPage = Math.ceil(items.length / pageSize);
        if (page < 1) page = 1;
        if (page > maxPage) page = maxPage;

        const startIndex = (page - 1) * pageSize;

        return {
            currentPage: page,
            maxPage,
            pageSize,
            items: items.slice(startIndex, startIndex + pageSize)
        };
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}

module.exports = Helpers;