import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCryptoDetails, fetchHistoricalPrices, setSelectedTimeframe, clearError, } from '../features/crypto/cryptoSlice';
import { PriceChart } from '../components/PriceChart';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { formatPrice, formatLargeNumber, formatPercent, getPercentChangeColor, } from '../utils/formatting';
const TIMEFRAMES = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '1Y', days: 365 },
];
export const CryptoDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedCrypto, historicalPrices, loading, error, currency, selectedTimeframe } = useAppSelector((state) => state.crypto);
    const [activeTimeframe, setActiveTimeframe] = useState(selectedTimeframe);
    useEffect(() => {
        if (!id) {
            navigate('/');
            return;
        }
        dispatch(fetchCryptoDetails({ id, currency }));
        dispatch(fetchHistoricalPrices({ id, days: activeTimeframe, currency }));
    }, [id, currency, dispatch, navigate, activeTimeframe]);
    const handleTimeframeChange = (days) => {
        setActiveTimeframe(days);
        dispatch(setSelectedTimeframe(days));
    };
    const handleRetry = () => {
        dispatch(clearError());
        if (id) {
            dispatch(fetchCryptoDetails({ id, currency }));
            dispatch(fetchHistoricalPrices({ id, days: activeTimeframe, currency }));
        }
    };
    if (loading && !selectedCrypto) {
        return _jsx(Loading, { message: "Loading cryptocurrency details..." });
    }
    if (error && !selectedCrypto) {
        return _jsx(Error, { message: error, onRetry: handleRetry });
    }
    if (!selectedCrypto) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-lg", children: "Cryptocurrency not found" }), _jsx("button", { onClick: () => navigate('/'), className: "mt-4 bg-crypto-primary hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition", children: "Back to Dashboard" })] }) }));
    }
    const isPositive = selectedCrypto.price_change_percentage_24h >= 0;
    return (_jsxs("div", { className: "min-h-screen bg-crypto-darker", children: [_jsx("section", { className: "bg-gradient-to-r from-crypto-dark via-gray-900 to-crypto-dark py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("button", { onClick: () => navigate('/'), className: "mb-6 text-crypto-primary hover:text-blue-400 font-medium transition", children: "\u2190 Back to Dashboard" }), _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("img", { src: selectedCrypto.image, alt: selectedCrypto.name, className: "w-16 h-16 rounded-full shadow-lg" }), _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold", children: selectedCrypto.name }), _jsx("p", { className: "text-gray-400 text-lg", children: selectedCrypto.symbol })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-4xl font-bold text-white mb-2", children: formatPrice(selectedCrypto.current_price, currency) }), _jsxs("p", { className: `text-xl font-bold ${getPercentChangeColor(selectedCrypto.price_change_percentage_24h)}`, children: [isPositive ? '▲' : '▼', " ", formatPercent(selectedCrypto.price_change_percentage_24h)] })] })] })] }) }), _jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [error && _jsx(Error, { message: error, onRetry: handleRetry }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12", children: [_jsxs("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700", children: [_jsx("p", { className: "text-gray-400 text-sm font-medium mb-2", children: "Market Cap Rank" }), _jsxs("p", { className: "text-3xl font-bold text-crypto-primary", children: ["#", selectedCrypto.market_cap_rank] })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700", children: [_jsx("p", { className: "text-gray-400 text-sm font-medium mb-2", children: "Market Cap" }), _jsx("p", { className: "text-2xl font-bold", children: formatLargeNumber(selectedCrypto.market_cap) })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700", children: [_jsx("p", { className: "text-gray-400 text-sm font-medium mb-2", children: "24h Trading Volume" }), _jsx("p", { className: "text-2xl font-bold", children: formatLargeNumber(selectedCrypto.total_volume) })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700", children: [_jsx("p", { className: "text-gray-400 text-sm font-medium mb-2", children: "Circulating Supply" }), _jsx("p", { className: "text-2xl font-bold", children: selectedCrypto.circulating_supply.toLocaleString('en-US', {
                                            maximumFractionDigits: 0,
                                        }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12", children: [_jsxs("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "24h Price Range" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "High" }), _jsx("p", { className: "text-xl font-semibold text-crypto-success", children: formatPrice(selectedCrypto.high_24h, currency) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "Low" }), _jsx("p", { className: "text-xl font-semibold text-crypto-danger", children: formatPrice(selectedCrypto.low_24h, currency) })] })] })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg p-6 border border-gray-700", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "All-Time Statistics" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "All-Time High" }), _jsx("p", { className: "text-xl font-semibold", children: formatPrice(selectedCrypto.ath, currency) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "All-Time Low" }), _jsx("p", { className: "text-xl font-semibold", children: formatPrice(selectedCrypto.atl, currency) })] })] })] })] }), _jsxs("div", { className: "mb-12", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Price History" }), _jsx("div", { className: "flex gap-3 mb-6 flex-wrap", children: TIMEFRAMES.map((timeframe) => (_jsx("button", { onClick: () => handleTimeframeChange(timeframe.days), className: `px-4 py-2 rounded font-medium transition ${activeTimeframe === timeframe.days
                                        ? 'bg-crypto-primary text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`, children: timeframe.label }, timeframe.days))) }), _jsx(PriceChart, { data: historicalPrices, currency: currency, isLoading: loading })] })] })] }));
};
