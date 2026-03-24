import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cryptoService from '../../services/cryptoService';
const initialState = {
    topCryptos: [],
    selectedCrypto: null,
    historicalPrices: [],
    loading: false,
    error: null,
    currency: 'zar',
    selectedTimeframe: 30,
};
export const fetchTopCryptos = createAsyncThunk('crypto/fetchTopCryptos', async ({ limit, currency }) => {
    return await cryptoService.getTopCryptocurrencies(limit, currency);
});
export const fetchCryptoDetails = createAsyncThunk('crypto/fetchCryptoDetails', async ({ id, currency }) => {
    return await cryptoService.getCryptoDetails(id, currency);
});
export const fetchHistoricalPrices = createAsyncThunk('crypto/fetchHistoricalPrices', async ({ id, days, currency }) => {
    return await cryptoService.getHistoricalPrices(id, days, currency);
});
const cryptoSlice = createSlice({
    name: 'crypto',
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            state.currency = action.payload;
        },
        setSelectedTimeframe: (state, action) => {
            state.selectedTimeframe = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchTopCryptos
        builder
            .addCase(fetchTopCryptos.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchTopCryptos.fulfilled, (state, action) => {
            state.topCryptos = action.payload;
            state.loading = false;
        })
            .addCase(fetchTopCryptos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch cryptocurrencies';
        });
        // fetchCryptoDetails
        builder
            .addCase(fetchCryptoDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
            state.selectedCrypto = action.payload;
            state.loading = false;
        })
            .addCase(fetchCryptoDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch crypto details';
        });
        // fetchHistoricalPrices
        builder
            .addCase(fetchHistoricalPrices.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchHistoricalPrices.fulfilled, (state, action) => {
            state.historicalPrices = action.payload;
            state.loading = false;
        })
            .addCase(fetchHistoricalPrices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch price history';
        });
    },
});
export const { setCurrency, setSelectedTimeframe, clearError } = cryptoSlice.actions;
export default cryptoSlice.reducer;
