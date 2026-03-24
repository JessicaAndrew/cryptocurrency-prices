import axios from 'axios';
class CryptoService {
    constructor() {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'https://api.coingecko.com/api/v3'
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "cacheDuration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 * 60 * 1000
        }); // 5 minutes
        this.api = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        });
    }
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return false;
        return Date.now() - cached.timestamp < this.cacheDuration;
    }
    getFromCache(key) {
        if (this.isCacheValid(key)) {
            return this.cache.get(key)?.data;
        }
        this.cache.delete(key);
        return null;
    }
    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
    async getTopCryptocurrencies(limit = 10, currency = 'zar') {
        const cacheKey = `top-${limit}-${currency}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.api.get('/coins/markets', {
                params: {
                    vs_currency: currency.toLowerCase(),
                    order: 'market_cap_desc',
                    per_page: limit,
                    page: 1,
                    sparkline: false,
                },
            });
            this.setCache(cacheKey, response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching top cryptocurrencies:', error);
            throw new Error('Failed to fetch cryptocurrencies');
        }
    }
    async getCryptoDetails(id, currency = 'zar') {
        const cacheKey = `details-${id}-${currency}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.api.get(`/coins/${id}`, {
                params: {
                    vs_currency: currency.toLowerCase(),
                    localization: false,
                },
            });
            const cryptoData = {
                id: response.data.id,
                symbol: response.data.symbol.toUpperCase(),
                name: response.data.name,
                image: response.data.image.large,
                current_price: response.data.market_data?.current_price?.[currency.toLowerCase()] || 0,
                market_cap: response.data.market_data?.market_cap?.[currency.toLowerCase()] || 0,
                market_cap_rank: response.data.market_cap_rank,
                total_volume: response.data.market_data?.total_volume?.[currency.toLowerCase()] || 0,
                high_24h: response.data.market_data?.high_24h?.[currency.toLowerCase()] || 0,
                low_24h: response.data.market_data?.low_24h?.[currency.toLowerCase()] || 0,
                price_change_24h: response.data.market_data?.price_change_24h?.[currency.toLowerCase()] || 0,
                price_change_percentage_24h: response.data.market_data?.price_change_percentage_24h || 0,
                circulating_supply: response.data.market_data?.circulating_supply || 0,
                total_supply: response.data.market_data?.total_supply || 0,
                ath: response.data.market_data?.ath?.[currency.toLowerCase()] || 0,
                atl: response.data.market_data?.atl?.[currency.toLowerCase()] || 0,
            };
            this.setCache(cacheKey, cryptoData);
            return cryptoData;
        }
        catch (error) {
            console.error('Error fetching crypto details:', error);
            throw new Error(`Failed to fetch details for ${id}`);
        }
    }
    async getHistoricalPrices(id, days = 30, currency = 'zar') {
        const cacheKey = `history-${id}-${days}-${currency}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.api.get(`/coins/${id}/market_chart`, {
                params: {
                    vs_currency: currency.toLowerCase(),
                    days,
                    interval: 'daily',
                },
            });
            const priceHistory = response.data.prices.map(([timestamp, price]) => ({
                timestamp,
                price,
            }));
            this.setCache(cacheKey, priceHistory);
            return priceHistory;
        }
        catch (error) {
            console.error('Error fetching historical prices:', error);
            throw new Error(`Failed to fetch price history for ${id}`);
        }
    }
    clearCache() {
        this.cache.clear();
    }
}
export default new CryptoService();
