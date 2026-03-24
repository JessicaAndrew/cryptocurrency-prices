import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  fetchCryptoDetails,
  fetchHistoricalPrices,
  setSelectedTimeframe,
  clearError,
} from '../features/crypto/cryptoSlice'
import { PriceChart } from '../components/PriceChart'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import {
  formatPrice,
  formatLargeNumber,
  formatPercent,
  getPercentChangeColor,
} from '../utils/formatting'

const TIMEFRAMES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
]

export const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { selectedCrypto, historicalPrices, loading, error, currency, selectedTimeframe } =
    useAppSelector((state) => state.crypto)
  const [activeTimeframe, setActiveTimeframe] = useState(selectedTimeframe)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    dispatch(fetchCryptoDetails({ id, currency }))
    dispatch(fetchHistoricalPrices({ id, days: activeTimeframe, currency }))
  }, [id, currency, dispatch, navigate, activeTimeframe])

  const handleTimeframeChange = (days: number) => {
    setActiveTimeframe(days)
    dispatch(setSelectedTimeframe(days))
  }

  const handleRetry = () => {
    dispatch(clearError())
    if (id) {
      dispatch(fetchCryptoDetails({ id, currency }))
      dispatch(fetchHistoricalPrices({ id, days: activeTimeframe, currency }))
    }
  }

  if (loading && !selectedCrypto) {
    return <Loading message="Loading cryptocurrency details..." />
  }

  if (error && !selectedCrypto) {
    return <Error message={error} onRetry={handleRetry} />
  }

  if (!selectedCrypto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Cryptocurrency not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-crypto-primary hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isPositive = selectedCrypto.price_change_percentage_24h >= 0

  return (
    <div className="min-h-screen bg-crypto-darker">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-crypto-dark via-gray-900 to-crypto-dark py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-crypto-primary hover:text-blue-400 font-medium transition"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={selectedCrypto.image}
                alt={selectedCrypto.name}
                className="w-16 h-16 rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-bold">{selectedCrypto.name}</h1>
                <p className="text-gray-400 text-lg">{selectedCrypto.symbol}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold text-white mb-2">
                {formatPrice(selectedCrypto.current_price, currency)}
              </p>
              <p
                className={`text-xl font-bold ${getPercentChangeColor(
                  selectedCrypto.price_change_percentage_24h
                )}`}
              >
                {isPositive ? '▲' : '▼'} {formatPercent(selectedCrypto.price_change_percentage_24h)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && <Error message={error} onRetry={handleRetry} />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm font-medium mb-2">Market Cap Rank</p>
            <p className="text-3xl font-bold text-crypto-primary">
              #{selectedCrypto.market_cap_rank}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm font-medium mb-2">Market Cap</p>
            <p className="text-2xl font-bold">
              {formatLargeNumber(selectedCrypto.market_cap, currency)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm font-medium mb-2">24h Trading Volume</p>
            <p className="text-2xl font-bold">
              {formatLargeNumber(selectedCrypto.total_volume, currency)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm font-medium mb-2">Circulating Supply</p>
            <p className="text-2xl font-bold">
              {selectedCrypto.circulating_supply.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        {/* Price Range and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">24h Price Range</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm mb-1">High</p>
                <p className="text-xl font-semibold text-crypto-success">
                  {formatPrice(selectedCrypto.high_24h, currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Low</p>
                <p className="text-xl font-semibold text-crypto-danger">
                  {formatPrice(selectedCrypto.low_24h, currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">All-Time Statistics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm mb-1">All-Time High</p>
                <p className="text-xl font-semibold">{formatPrice(selectedCrypto.ath, currency)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">All-Time Low</p>
                <p className="text-xl font-semibold">{formatPrice(selectedCrypto.atl, currency)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Price History</h2>

          {/* Timeframe Selector */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {TIMEFRAMES.map((timeframe) => (
              <button
                key={timeframe.days}
                onClick={() => handleTimeframeChange(timeframe.days)}
                className={`px-4 py-2 rounded font-medium transition ${
                  activeTimeframe === timeframe.days
                    ? 'bg-crypto-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <PriceChart data={historicalPrices} currency={currency} isLoading={loading} />
        </div>
      </section>
    </div>
  )
}
