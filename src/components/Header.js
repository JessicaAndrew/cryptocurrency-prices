import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setCurrency } from '../features/crypto/cryptoSlice';
const CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'BTC'];
export const Header = () => {
    const dispatch = useAppDispatch();
    const currency = useAppSelector((state) => state.crypto.currency);
    return (_jsx("header", { className: "bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2 no-underline", children: [_jsx("div", { className: "text-2xl", children: "\uD83D\uDCB0" }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-white", children: "CryptoPrices" }), _jsx("p", { className: "text-xs text-gray-400", children: "Live Tracker" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("label", { className: "text-sm text-gray-400 font-medium", children: "Currency:" }), _jsx("select", { value: currency.toUpperCase(), onChange: (e) => dispatch(setCurrency(e.target.value.toLowerCase())), className: "bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded font-medium cursor-pointer transition border border-gray-600", children: CURRENCIES.map((curr) => (_jsx("option", { value: curr, children: curr }, curr))) })] })] }) }) }));
};
