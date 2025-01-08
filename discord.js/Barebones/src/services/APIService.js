const axios = require('axios');
const logger = require('../utils/Logger');
const CacheService = require('../services/CacheService');

class APIService {
    constructor() {
        this.axios = axios.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': `${process.env.npm_package_name}/${process.env.npm_package_version}`
            }
        });

        this.cache = new CacheService();

        // Response interceptor for logging
        this.axios.interceptors.response.use(
            this.handleSuccess.bind(this),
            this.handleError.bind(this)
        );
    }

    handleSuccess(response) {
        logger.debug('API Request Success', {
            url: response.config.url,
            method: response.config.method,
            status: response.status
        });
        return response;
    }

    handleError(error) {
        logger.error('API Request Error', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            error: error.message
        });
        throw error;
    }

    async get(url, options = {}) {
        const cacheKey = url;
        const cached = await this.cache.get(cacheKey, 'api');
        
        if (cached && !options.bypass) {
            return cached;
        }

        const response = await this.axios.get(url, options);
        
        if (options.cache !== false) {
            await this.cache.set(cacheKey, response.data, options.ttl, 'api');
        }

        return response.data;
    }

    async post(url, data, options = {}) {
        const response = await this.axios.post(url, data, options);
        return response.data;
    }

    async put(url, data, options = {}) {
        const response = await this.axios.put(url, data, options);
        return response.data;
    }

    async delete(url, options = {}) {
        const response = await this.axios.delete(url, options);
        return response.data;
    }

    async getRaw(url, options = {}) {
        const response = await this.axios.get(url, options);
        return response;
    }

    async postRaw(url, data, options = {}) {
        const response = await this.axios.post(url, data, options);
        return response;
    }

    async putRaw(url, data, options = {}) {
        const response = await this.axios.put(url, data, options);
        return response;
    }

    async deleteRaw(url, options = {}) {
        const response = await this.axios.delete(url, options);
        return response;
    }
}

module.exports = new APIService();