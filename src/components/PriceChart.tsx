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
import { formatDate, formatDateTime, formatLargeNumber, formatPrice } from '../utils/formatting'

type ChartMetric = 'price' | 'marketCap' | 'totalVolume'

interface PriceChartProps {
  data: PriceHistory[]
  currency: string
  metric: ChartMetric
  title: string
  timeframeDays: number
  isLoading?: boolean
}

interface ChartDataPoint {
  timestamp: number
  price: number
  marketCap: number
  totalVolume: number
}

const METRIC_COLORS: Record<ChartMetric, string> = {
  price: '#0066cc',
  marketCap: '#00cc66',
  totalVolume: '#f59e0b',
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  currency,
  metric,
  title,
  timeframeDays,
  isLoading = false,
}) => {
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
    marketCap: item.marketCap,
    totalVolume: item.totalVolume,
  }))

  const values = chartData.map((d) => d[metric])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  const formatValue = (value: number): string => {
    if (metric === 'price') return formatPrice(value, currency)
    return formatLargeNumber(value, currency)
  }

  const formatYAxisTick = (value: number): string => {
    return formatLargeNumber(value, currency)
  }

  const yAxisDomain: [number, number] = [minValue, maxValue]

  const formatXAxisLabel = (timestamp: number): string => {
    const date = new Date(timestamp)

    if (timeframeDays <= 1) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    if (timeframeDays <= 7) {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      })
    }

    return formatDate(timestamp)
  }

  return (
    <div className="w-full h-80 bg-gray-800/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="timestamp"
            stroke="#999"
            tick={{ fontSize: 12 }}
            minTickGap={24}
            tickFormatter={(value) => formatXAxisLabel(value as number)}
          />
          <YAxis
            stroke="#999"
            tick={{ fontSize: 12 }}
            domain={yAxisDomain}
            tickFormatter={(value) => formatYAxisTick(value as number)}
            allowDecimals={metric !== 'price'}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1f33',
              border: '1px solid #444',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => formatValue(value)}
            labelFormatter={(label) => `Date: ${formatDateTime(label as number)}`}
          />
          <Line
            type="linear"
            dataKey={metric}
            stroke={METRIC_COLORS[metric]}
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
