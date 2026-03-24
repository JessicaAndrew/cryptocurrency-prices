import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setCurrency } from '../features/crypto/cryptoSlice'

const CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'BTC']

export const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const currency = useAppSelector((state) => state.crypto.currency)

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 no-underline">
            <div className="text-2xl">💰</div>
            <div>
              <h1 className="text-xl font-bold text-white">CryptoPrices</h1>
              <p className="text-xs text-gray-400">Live Tracker</p>
            </div>
          </Link>

          {/* Currency Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400 font-medium">Currency:</label>
            <select
              value={currency.toUpperCase()}
              onChange={(e) => dispatch(setCurrency(e.target.value.toLowerCase()))}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded font-medium cursor-pointer transition border border-gray-600"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}
