// Static market trend table — shows 6 major cryptocurrencies with their price,
// 24h change and a neon mini line chart. Renders as a table on desktop and a
// stack of cards on mobile, revealed with a scroll-triggered fade/slide.
import { useEffect, useRef, useState } from 'react';
import MiniChart from './MiniChart.jsx';
import { marketTrendData } from '../utils/mockData.js';

// USD formatter: always two decimal places, thousands separators.
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(price) {
  return Number.isFinite(price) ? priceFormatter.format(price) : '$—';
}

function formatChange(change24h) {
  const safe = Number.isFinite(change24h) ? change24h : 0;
  return `${safe >= 0 ? '+' : ''}${safe.toFixed(2)}%`;
}

export default function MarketTrendTable() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered reveal via IntersectionObserver, mirroring the carousel.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Cryptocurrency market trends"
      className={`max-w-6xl mx-auto px-6 py-12 transition-all duration-700 ease-out ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <h2 className="text-3xl font-bold mb-8 text-white">Market Trends</h2>

      {/* Desktop / tablet: semantic table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-sm uppercase tracking-wide text-zinc-400">
              <th scope="col" className="px-6 py-4 font-medium">
                Logo
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Symbol
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Price
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                24h Change
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {marketTrendData.map((coin) => {
              const isPositive =
                (Number.isFinite(coin.change24h) ? coin.change24h : 0) >= 0;
              const changeColor = isPositive
                ? 'text-green-400'
                : 'text-red-400';

              return (
                <tr
                  key={coin.symbol}
                  className="border-b border-zinc-800 last:border-b-0 transition-colors duration-200 hover:bg-zinc-800/50"
                >
                  <td className="px-6 py-4">
                    <div
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: coin.chartColor }}
                    >
                      {coin.symbol.charAt(0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold uppercase text-white">
                    {coin.symbol}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{coin.name}</td>
                  <td className="px-6 py-4 font-mono text-white">
                    {formatPrice(coin.price)}
                  </td>
                  <td className={`px-6 py-4 font-medium ${changeColor}`}>
                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
                      {formatChange(coin.change24h)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <MiniChart data={coin.chartData} color={coin.chartColor} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {marketTrendData.map((coin) => {
          const isPositive =
            (Number.isFinite(coin.change24h) ? coin.change24h : 0) >= 0;
          const changeColor = isPositive ? 'text-green-400' : 'text-red-400';

          return (
            <div
              key={coin.symbol}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{ backgroundColor: coin.chartColor }}
                >
                  {coin.symbol.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold uppercase text-white">
                    {coin.symbol}
                  </p>
                  <p className="text-sm text-gray-400">{coin.name}</p>
                </div>
                <div className="ml-auto">
                  <MiniChart data={coin.chartData} color={coin.chartColor} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-lg text-white">
                  {formatPrice(coin.price)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-medium ${changeColor}`}
                >
                  <span aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
                  {formatChange(coin.change24h)}
                  <span className="sr-only">24 hour change</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
