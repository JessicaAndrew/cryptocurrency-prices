import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchTopCryptos, clearError } from '../features/crypto/cryptoSlice'
import { CryptoCard } from '../components/CryptoCard'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { topCryptos, loading, error, currency } = useAppSelector((state) => state.crypto)

  useEffect(() => {
    dispatch(fetchTopCryptos({ limit: 10, currency }))
  }, [currency, dispatch])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchTopCryptos({ limit: 10, currency }))
  }

  return (
    <div className="min-h-screen bg-crypto-darker">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-crypto-dark via-gray-900 to-crypto-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">Top 10 Cryptocurrencies</h2>
          <p className="text-gray-400 text-lg">
            Real-time prices powered by CoinGecko API | All prices in {currency.toUpperCase()}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && <Error message={error} onRetry={handleRetry} />}

        {loading && !topCryptos.length ? (
          <Loading message="Fetching top cryptocurrencies..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCryptos.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} currency={currency} />
            ))}
          </div>
        )}

        {!loading && topCryptos.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No cryptocurrencies found</p>
          </div>
        )}
      </section>
    </div>
  )
}
