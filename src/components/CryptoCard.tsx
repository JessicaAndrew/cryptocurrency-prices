import { Link } from 'react-router-dom'
import { CryptoData } from '../services/cryptoService'
import { formatPrice, formatPercent, getPercentChangeColor } from '../utils/formatting'

interface CryptoCardProps {
  crypto: CryptoData
  currency: string
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, currency }) => {
  const isPositive = crypto.price_change_percentage_24h >= 0

  return (
    <Link
      to={`/crypto/${crypto.id}`}
      className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg p-4 transition transform hover:scale-105 cursor-pointer shadow-lg border border-gray-700 hover:border-crypto-primary"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-10 h-10 rounded-full"
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{crypto.name}</h3>
            <p className="text-sm text-gray-400">{crypto.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">{formatPrice(crypto.current_price, currency)}</p>
          <p
            className={`text-sm font-medium ${getPercentChangeColor(
              crypto.price_change_percentage_24h
            )}`}
          >
            {isPositive ? '▲' : '▼'} {formatPercent(crypto.price_change_percentage_24h)}
          </p>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded p-2 mt-3">
        <div className="text-xs text-gray-400 mb-1">Market Cap Rank</div>
        <div className="text-sm font-semibold text-white">#{crypto.market_cap_rank}</div>
      </div>
    </Link>
  )
}
