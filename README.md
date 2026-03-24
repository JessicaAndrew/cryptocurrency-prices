# CryptoPrices - Live Cryptocurrency Tracker

A modern, responsive React + TypeScript application that displays live cryptocurrency prices using the CoinGecko API. Track the top cryptocurrencies by market cap, view detailed information, and analyze historical price trends.

## Features

### Core Features
- **Dashboard**: Display top cryptocurrencies by market cap with real-time prices
- **Cryptocurrency Details Page**: Comprehensive information about each cryptocurrency
- **Real-time Price Tracking**: Live prices updated from CoinGecko API
- **Price Charts**: Interactive Recharts visualization of historical price data
- **Multi-Currency Support**: View prices in ZAR, USD, EUR, GBP, or BTC
- **Responsive Design**: Fully responsive UI optimized for desktop, tablet, and mobile
- **Caching**: Redux-based caching to reduce API calls and improve performance
- **TypeScript**: Type-safe code with strict typing throughout

### Bonus Features
- Currency selection (ZAR, USD, EUR, GBP, BTC)
- Redux state management with caching
- Historical charts
- Chart granularity selection
- Progressive Web App (fully responsive)
- Production-ready with proper error handling

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios with built-in caching
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Build Tool**: Vite (lightning-fast builds)
- **API**: CoinGecko API (free tier)

## Project Structure

```
src/
├── components/              # Reusable React components
│   ├── CryptoCard.tsx       # Individual crypto card component
│   ├── Error.tsx            # Error message display
│   ├── Header.tsx           # Navigation header with currency selector
│   ├── Loading.tsx          # Loading spinner component
│   └── PriceChart.tsx       # Historical price chart
├── features/                # Redux features (slices)
│   └── crypto/
│       └── cryptoSlice.ts   # Crypto data state management
├── pages/                   # Page/route components
│   ├── Dashboard.tsx        # Home page with top cryptos
│   └── CryptoDetails.tsx    # Detailed view for single crypto
├── services/                # External service integrations
│   └── cryptoService.ts     # CoinGecko API service with caching
├── utils/                   # Utility functions
│   └── formatting.ts        # Formatting helpers (price, percent, etc)
├── hooks.ts                 # Custom Redux hooks (typed)
├── store.ts                 # Redux store configuration
├── App.tsx                  # Main app component with routing
├── main.tsx                 # React entry point
└── index.css                # Global styles with Tailwind

public/
└── index.html               # HTML entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

### Run tests
```bash
npm test
```

## Usage

### Dashboard
- Browse the top cryptocurrencies sorted by market cap
- Click any cryptocurrency card to view detailed information
- Select a preferred currency using the dropdown in the header

### Cryptocurrency Details Page
- View comprehensive information about selected cryptocurrency:
  - Current price with 24h change
  - Market cap rank and total volume
  - 24h price range (high/low)
  - All-time high and low
  - Circulating and total supply
- Interactive price history chart with selectable timeframes:
  - 24H (1 day)
  - 7D (7 days)
  - 30D (30 days)
  - 1Y (1 year)
- Return to dashboard with back button

## Error Handling

The application includes robust error handling:
- Network errors with retry functionality
- Missing data fallbacks
- User-friendly error messages
- Graceful degradation on API failures

## Caching Strategy

CryptoService implements a 5-minute cache for:
- Top cryptocurrencies list
- Individual cryptocurrency details
- Historical price data

This reduces API calls while keeping data relatively fresh.

## API Reference

### CoinGecko API Integration

**Base URL**

`https://api.coingecko.com/api/v3`

**Authentication**

CoinGecko API does not require authentication for the free tier. Rate limits apply.

**Rate Limits**

- Free tier: 10-50 calls/minute depending on endpoint
- This app uses 5-minute caching to minimize API calls

### Endpoints Used

#### 1) Get Top Cryptocurrencies

**Endpoint:** `GET /coins/markets`

**Parameters:**

- `vs_currency` (string): target currency (for example `zar`, `usd`)
- `order` (string): `market_cap_desc`
- `per_page` (number): number of results
- `page` (number): page number
- `sparkline` (boolean): include sparkline data


#### 2) Get Cryptocurrency Details

**Endpoint:** `GET /coins/{id}`

**Parameters:**

- `id` (string): coin id (for example `bitcoin`, `ethereum`)
- `vs_currency` (string): target currency
- `localization` (boolean): localized fields toggle


#### 3) Get Historical Price Data

**Endpoint:** `GET /coins/{id}/market_chart`

**Parameters:**

- `id` (string): coin id
- `vs_currency` (string): target currency
- `days` (number): 1, 7, 30, 365, or `max`
- `interval` (string): `daily`

### Caching Details

The service caches all API responses for 5 minutes to:

1. Reduce API usage and avoid rate limits
2. Improve UI responsiveness
3. Provide resilience during temporary network issues

**Invalidation:**

- Manual: `cryptoService.clearCache()`
- Automatic: cache expiry after 5 minutes
