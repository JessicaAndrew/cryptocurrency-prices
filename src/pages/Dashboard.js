import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTopCryptos, clearError } from '../features/crypto/cryptoSlice';
import { CryptoCard } from '../components/CryptoCard';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
export const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { topCryptos, loading, error, currency } = useAppSelector((state) => state.crypto);
    useEffect(() => {
        dispatch(fetchTopCryptos({ limit: 10, currency }));
    }, [currency, dispatch]);
    const handleRetry = () => {
        dispatch(clearError());
        dispatch(fetchTopCryptos({ limit: 10, currency }));
    };
    return (_jsxs("div", { className: "min-h-screen bg-crypto-darker", children: [_jsx("section", { className: "bg-gradient-to-r from-crypto-dark via-gray-900 to-crypto-dark py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h2", { className: "text-4xl font-bold mb-2", children: "Top 10 Cryptocurrencies" }), _jsxs("p", { className: "text-gray-400 text-lg", children: ["Real-time prices powered by CoinGecko API | All prices in ", currency.toUpperCase()] })] }) }), _jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [error && _jsx(Error, { message: error, onRetry: handleRetry }), loading && !topCryptos.length ? (_jsx(Loading, { message: "Fetching top cryptocurrencies..." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: topCryptos.map((crypto) => (_jsx(CryptoCard, { crypto: crypto, currency: currency }, crypto.id))) })), !loading && topCryptos.length === 0 && !error && (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-400 text-lg", children: "No cryptocurrencies found" }) }))] })] }));
};
