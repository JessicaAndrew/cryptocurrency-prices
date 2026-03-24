import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchTopCryptos, clearError } from '../features/crypto/cryptoSlice'
import { CryptoCard } from '../components/CryptoCard'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'

const INITIAL_PAGE_SIZE = 10

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { topCryptos, topCryptosHasMore, loading, error, currency } = useAppSelector(
    (state) => state.crypto
  )
  const [currentPage, setCurrentPage] = useState(1)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [currency])

  useEffect(() => {
    dispatch(
      fetchTopCryptos({
        limit: INITIAL_PAGE_SIZE,
        currency,
        page: currentPage,
        append: currentPage > 1,
      })
    )
  }, [currency, currentPage, dispatch])

  const handleLoadMore = useCallback(() => {
    if (loading || !topCryptosHasMore) {
      return
    }

    setCurrentPage((prevPage) => prevPage + 1)
  }, [loading, topCryptosHasMore])

  useEffect(() => {
    if (!loadMoreRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)

    return () => {
      observer.disconnect()
    }
  }, [handleLoadMore])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(
      fetchTopCryptos({
        limit: INITIAL_PAGE_SIZE,
        currency,
        page: currentPage,
        append: currentPage > 1,
      })
    )
  }

  return (
    <div className="min-h-screen bg-crypto-darker">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-crypto-dark via-gray-900 to-crypto-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">Top Cryptocurrencies by Market Cap</h2>
          <p className="text-gray-400 text-lg">
            Showing top {topCryptos.length} | Starts at top 10 and loads more as you scroll | All prices in{' '}
            {currency.toUpperCase()}
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

        <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-8">
          {loading && topCryptos.length > 0 && (
            <p className="text-gray-400 text-sm">Loading more cryptocurrencies...</p>
          )}
          {!topCryptosHasMore && topCryptos.length > 0 && (
            <p className="text-gray-500 text-sm">All available cryptocurrencies loaded</p>
          )}
        </div>
      </section>
    </div>
  )
}
