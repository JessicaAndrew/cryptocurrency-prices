import axios, { AxiosInstance } from 'axios'

export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  ath: number
  atl: number
}

export interface PriceHistory {
  timestamp: number
  price: number
}

class CryptoService {
  private api: AxiosInstance
  private baseUrl = 'https://api.coingecko.com/api/v3'
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map()
  private cacheDuration = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    })
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.cacheDuration
  }

  private getFromCache<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data as T
    }
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getTopCryptocurrencies(
    limit: number = 10,
    currency: string = 'zar'
  ): Promise<CryptoData[]> {
    const cacheKey = `top-${limit}-${currency}`
    const cached = this.getFromCache<CryptoData[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.api.get('/coins/markets', {
        params: {
          vs_currency: currency.toLowerCase(),
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      })
      this.setCache(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching top cryptocurrencies:', error)
      throw new Error('Failed to fetch cryptocurrencies')
    }
  }

  async getCryptoDetails(
    id: string,
    currency: string = 'zar'
  ): Promise<CryptoData> {
    const cacheKey = `details-${id}-${currency}`
    const cached = this.getFromCache<CryptoData>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.api.get(`/coins/${id}`, {
        params: {
          vs_currency: currency.toLowerCase(),
          localization: false,
        },
      })
      const cryptoData: CryptoData = {
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
      }
      this.setCache(cacheKey, cryptoData)
      return cryptoData
    } catch (error) {
      console.error('Error fetching crypto details:', error)
      throw new Error(`Failed to fetch details for ${id}`)
    }
  }

  async getHistoricalPrices(
    id: string,
    days: number = 30,
    currency: string = 'zar'
  ): Promise<PriceHistory[]> {
    const cacheKey = `history-${id}-${days}-${currency}`
    const cached = this.getFromCache<PriceHistory[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.api.get(`/coins/${id}/market_chart`, {
        params: {
          vs_currency: currency.toLowerCase(),
          days,
          interval: 'daily',
        },
      })
      const priceHistory: PriceHistory[] = response.data.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        })
      )
      this.setCache(cacheKey, priceHistory)
      return priceHistory
    } catch (error) {
      console.error('Error fetching historical prices:', error)
      throw new Error(`Failed to fetch price history for ${id}`)
    }
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export default new CryptoService()
