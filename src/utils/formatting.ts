export const formatPrice = (price: number, currency: string = 'ZAR'): string => {
  const currencySymbols: Record<string, string> = {
    'ZAR': 'R',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'BTC': '₿',
  }
  
  const symbol = currencySymbols[currency.toUpperCase()] || currency.toUpperCase()
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

  return `${symbol} ${formattedPrice}`
}

export const formatLargeNumber = (num: number, currency: string = 'ZAR'): string => {
  const currencySymbols: Record<string, string> = {
    'ZAR': 'R',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'BTC': '₿',
  }

  const symbol = currencySymbols[currency.toUpperCase()] || currency.toUpperCase()

  if (num >= 1e9) return `${symbol}${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${symbol}${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${symbol}${(num / 1e3).toFixed(2)}K`
  return `${symbol}${num.toFixed(2)}`
}

export const formatPercent = (percent: number): string => {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`
}

export const getPercentChangeColor = (change: number): string => {
  if (change > 0) return 'text-crypto-success'
  if (change < 0) return 'text-crypto-danger'
  return 'text-gray-400'
}

export const getPercentChangeBgColor = (change: number): string => {
  if (change > 0) return 'bg-crypto-success/10'
  if (change < 0) return 'bg-crypto-danger/10'
  return 'bg-gray-500/10'
}

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
