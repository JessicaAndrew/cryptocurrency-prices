import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PriceHistory } from '../services/cryptoService'
import { formatDate, formatPrice } from '../utils/formatting'

interface PriceChartProps {
  data: PriceHistory[]
  currency: string
  isLoading?: boolean
}

interface ChartDataPoint {
  timestamp: number
  price: number
  date: string
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, currency, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-800 rounded-lg">
        <p className="text-gray-400">Loading chart...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-800 rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  const chartData: ChartDataPoint[] = data.map((item) => ({
    timestamp: item.timestamp,
    price: item.price,
    date: formatDate(item.timestamp),
  }))

  const minPrice = Math.min(...chartData.map((d) => d.price))
  const maxPrice = Math.max(...chartData.map((d) => d.price))

  return (
    <div className="w-full h-80 bg-gray-800/50 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            stroke="#999"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#999"
            tick={{ fontSize: 12 }}
            domain={[minPrice * 0.99, maxPrice * 1.01]}
            tickFormatter={(value) => `${currency} ${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1f33',
              border: '1px solid #444',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => formatPrice(value, currency)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0066cc"
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
