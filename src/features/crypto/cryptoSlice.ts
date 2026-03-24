import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cryptoService, { CryptoData, PriceHistory } from '../../services/cryptoService'

export interface CryptoState {
  topCryptos: CryptoData[]
  selectedCrypto: CryptoData | null
  historicalPrices: PriceHistory[]
  loading: boolean
  error: string | null
  currency: string
  selectedTimeframe: number
  historyRequestId: string | null
}

const initialState: CryptoState = {
  topCryptos: [],
  selectedCrypto: null,
  historicalPrices: [],
  loading: false,
  error: null,
  currency: 'zar',
  selectedTimeframe: 30,
  historyRequestId: null,
}

export const fetchTopCryptos = createAsyncThunk(
  'crypto/fetchTopCryptos',
  async ({ limit, currency }: { limit: number; currency: string }) => {
    return await cryptoService.getTopCryptocurrencies(limit, currency)
  }
)

export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchCryptoDetails',
  async ({ id, currency }: { id: string; currency: string }) => {
    return await cryptoService.getCryptoDetails(id, currency)
  }
)

export const fetchHistoricalPrices = createAsyncThunk(
  'crypto/fetchHistoricalPrices',
  async ({ id, days, currency }: { id: string; days: number; currency: string }) => {
    return await cryptoService.getHistoricalPrices(id, days, currency)
  }
)

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload
    },
    setSelectedTimeframe: (state, action) => {
      state.selectedTimeframe = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // fetchTopCryptos
    builder
      .addCase(fetchTopCryptos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopCryptos.fulfilled, (state, action) => {
        state.topCryptos = action.payload
        state.loading = false
      })
      .addCase(fetchTopCryptos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch cryptocurrencies'
      })

    // fetchCryptoDetails
    builder
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.selectedCrypto = action.payload
        state.loading = false
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch crypto details'
      })

    // fetchHistoricalPrices
    builder
      .addCase(fetchHistoricalPrices.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.historyRequestId = action.meta.requestId
      })
      .addCase(fetchHistoricalPrices.fulfilled, (state, action) => {
        if (state.historyRequestId !== action.meta.requestId) {
          return
        }
        state.historicalPrices = action.payload
        state.loading = false
        state.historyRequestId = null
      })
      .addCase(fetchHistoricalPrices.rejected, (state, action) => {
        if (state.historyRequestId !== action.meta.requestId) {
          return
        }
        state.loading = false
        state.error = action.error.message || 'Failed to fetch price history'
        state.historyRequestId = null
      })
  },
})

export const { setCurrency, setSelectedTimeframe, clearError } = cryptoSlice.actions
export default cryptoSlice.reducer
