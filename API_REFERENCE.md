# API Reference

## CoinGecko API Integration

This document describes how the application integrates with the CoinGecko API.

### Base URL
```
https://api.coingecko.com/api/v3
```

### Authentication
CoinGecko API does not require authentication for free tier. Rate limits apply.

### Rate Limits
- Free tier: 10-50 calls/minute depending on endpoint
- The application implements 5-minute caching to minimize API calls

## Endpoints Used

### 1. Get Top Cryptocurrencies

Fetches the top cryptocurrencies by market capitalization.

**Endpoint:** `GET /coins/markets`

**Parameters:**
- `vs_currency` (string): Target currency (e.g., "zar", "usd")
- `order` (string): Sort order, use "market_cap_desc"
- `per_page` (number): Number of results (1-250)
- `page` (number): Page number
- `sparkline` (boolean): Include sparkline data

**Response:**
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://...",
    "current_price": 45000.50,
    "market_cap": 880000000000,
    "market_cap_rank": 1,
    "total_volume": 25000000000,
    "high_24h": 45500,
    "low_24h": 44000,
    "price_change_24h": -150.25,
    "price_change_percentage_24h": -0.33,
    "circulating_supply": 21000000,
    "total_supply": 21000000,
    "ath": 69000,
    "atl": 100
  }
]
```

**Usage in App:**
```typescript
const cryptos = await cryptoService.getTopCryptocurrencies(10, 'zar')
```

### 2. Get Cryptocurrency Details

Fetches detailed information for a specific cryptocurrency.

**Endpoint:** `GET /coins/{id}`

**Parameters:**
- `id` (string): Cryptocurrency ID (e.g., "bitcoin", "ethereum")
- `vs_currency` (string): Target currency
- `localization` (boolean): Include localized data

**Response:**
```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "description": {
    "en": "Bitcoin is a cryptocurrency..."
  },
  "image": {
    "large": "https://..."
  },
  "market_data": {
    "current_price": {
      "zar": 45000.50
    },
    "market_cap": {
      "zar": 880000000000
    },
    "market_cap_rank": 1,
    "total_volume": {
      "zar": 25000000000
    },
    "high_24h": {
      "zar": 45500
    },
    "low_24h": {
      "zar": 44000
    },
    "price_change_24h": {
      "zar": -150.25
    },
    "price_change_percentage_24h": -0.33,
    "circulating_supply": 21000000,
    "total_supply": 21000000,
    "ath": {
      "zar": 69000
    },
    "atl": {
      "zar": 100
    }
  }
}
```

**Usage in App:**
```typescript
const details = await cryptoService.getCryptoDetails('bitcoin', 'zar')
```

### 3. Get Historical Price Data

Fetches historical price data for charting.

**Endpoint:** `GET /coins/{id}/market_chart`

**Parameters:**
- `id` (string): Cryptocurrency ID
- `vs_currency` (string): Target currency
- `days` (number): Number of days (1, 7, 30, 365, or "max")
- `interval` (string): Data interval ("daily" for precision)

**Response:**
```json
{
  "prices": [
    [1234567890000, 45000.50],
    [1234567976000, 45100.25],
    ...
  ],
  "market_caps": [...],
  "volumes": [...]
}
```

**Usage in App:**
```typescript
const history = await cryptoService.getHistoricalPrices('bitcoin', 30, 'zar')
```

## Caching Strategy

The application implements a 5-minute cache for all API responses to:
1. Reduce API calls and stay within rate limits
2. Improve application performance
3. Provide offline resilience

### Cache Keys Format
- `top-{limit}-{currency}` - Top cryptocurrencies
- `details-{id}-{currency}` - Cryptocurrency details
- `history-{id}-{days}-{currency}` - Price history

### Cache Invalidation
- Manual: Call `cryptoService.clearCache()`
- Automatic: Cache expires after 5 minutes

## Error Handling

All API calls include error handling:

```typescript
try {
  const data = await cryptoService.getTopCryptocurrencies(10, 'zar')
} catch (error) {
  console.error(error)
  // Fallback to cached data or show error to user
}
```

## Rate Limiting

If rate limited (HTTP 429):
1. Application will throw an error
2. Redux will dispatch error action
3. User sees error message with retry button
4. Wait 1-2 minutes before retrying

## Testing API Integration

### Manual Testing
```bash
# In browser console
import cryptoService from './services/cryptoService'
const data = await cryptoService.getTopCryptocurrencies(10, 'zar')
console.log(data)
```

### Using Curl
```bash
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&order=market_cap_desc&per_page=10&page=1"
```

## Best Practices

1. **Always use caching** - Reduces API load
2. **Check cache before API** - CryptoService does this automatically
3. **Clear cache when needed** - For fresh data
4. **Handle errors gracefully** - Show user feedback
5. **Use appropriate timeframes** - 1, 7, 30, 365 days for charts

## Future Enhancements

- WebSocket support for real-time prices
- Advanced analytics endpoints
- Custom API key support
- Batch API calls for multiple cryptocurrencies
- GraphQL alternative endpoint

## References

- [CoinGecko API Documentation](https://docs.coingecko.com/reference/introduction)
- [CoinGecko Free API Plan](https://www.coingecko.com/en/api)
- [API Status Page](https://status.coingecko.com/)
