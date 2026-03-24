import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { formatDate, formatPrice } from '../utils/formatting';
export const PriceChart = ({ data, currency, isLoading = false }) => {
    if (isLoading) {
        return (_jsx("div", { className: "h-80 flex items-center justify-center bg-gray-800 rounded-lg", children: _jsx("p", { className: "text-gray-400", children: "Loading chart..." }) }));
    }
    if (!data || data.length === 0) {
        return (_jsx("div", { className: "h-80 flex items-center justify-center bg-gray-800 rounded-lg", children: _jsx("p", { className: "text-gray-400", children: "No data available" }) }));
    }
    const chartData = data.map((item) => ({
        timestamp: item.timestamp,
        price: item.price,
        date: formatDate(item.timestamp),
    }));
    const minPrice = Math.min(...chartData.map((d) => d.price));
    const maxPrice = Math.max(...chartData.map((d) => d.price));
    return (_jsx("div", { className: "w-full h-80 bg-gray-800/50 rounded-lg p-4", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#444" }), _jsx(XAxis, { dataKey: "date", stroke: "#999", tick: { fontSize: 12 } }), _jsx(YAxis, { stroke: "#999", tick: { fontSize: 12 }, domain: [minPrice * 0.99, maxPrice * 1.01], tickFormatter: (value) => `${currency} ${value.toFixed(0)}` }), _jsx(Tooltip, { contentStyle: {
                            backgroundColor: '#1a1f33',
                            border: '1px solid #444',
                            borderRadius: '8px',
                        }, labelStyle: { color: '#fff' }, formatter: (value) => formatPrice(value, currency), labelFormatter: (label) => `Date: ${label}` }), _jsx(Line, { type: "monotone", dataKey: "price", stroke: "#0066cc", dot: false, strokeWidth: 2, isAnimationActive: true })] }) }) }));
};
