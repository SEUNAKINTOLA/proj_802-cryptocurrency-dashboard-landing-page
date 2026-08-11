// Static cryptocurrency data for the market trends table. This is a UI preview
// with realistic-looking values (no live API), used to demonstrate the
// dashboard's data-visualization capabilities. Each chartColor maps to one of
// the project's neon accents: purple #A855F7, cyan #06B6D4, magenta #EC4899.

export const marketTrendData = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43521.32,
    change24h: 2.45,
    chartData: [40, 42, 41, 43, 44, 43, 45],
    chartColor: '#A855F7',
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 312.87,
    change24h: -1.12,
    chartData: [34, 33, 35, 32, 31, 32, 30],
    chartColor: '#06B6D4',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2298.64,
    change24h: 3.78,
    chartData: [20, 22, 21, 24, 23, 25, 27],
    chartColor: '#EC4899',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 72.19,
    change24h: -0.86,
    chartData: [18, 17, 18, 16, 17, 15, 16],
    chartColor: '#A855F7',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.5924,
    change24h: 4.21,
    chartData: [10, 11, 10, 12, 13, 14, 15],
    chartColor: '#06B6D4',
  },
  {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    price: 2.34,
    change24h: 1.67,
    chartData: [12, 13, 12, 14, 13, 15, 16],
    chartColor: '#EC4899',
  },
];
