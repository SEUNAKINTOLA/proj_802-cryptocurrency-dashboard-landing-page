// Individual cryptocurrency price card — shows the coin's symbol, an icon
// placeholder, its current USD price and 24h percentage change with
// color-coded (green up / red down) indicators.

// Per-symbol accent colors for the icon placeholder circle.
const ICON_COLORS = {
  BTC: 'bg-orange-500',
  ETH: 'bg-blue-500',
  LTC: 'bg-zinc-500',
};

// USD formatter: always two decimal places, thousands separators.
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function CryptoCard({ symbol, name, price, change24h }) {
  const upperSymbol = (symbol || '').toUpperCase();
  const iconColor = ICON_COLORS[upperSymbol] || 'bg-zinc-600';

  // Treat missing/NaN change as flat (non-negative) so the UI stays neutral.
  const safeChange = Number.isFinite(change24h) ? change24h : 0;
  const isPositive = safeChange >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';

  const formattedPrice = Number.isFinite(price)
    ? priceFormatter.format(price)
    : '$—';
  const formattedChange = `${isPositive ? '+' : ''}${safeChange.toFixed(2)}%`;

  return (
    <div className="min-w-[240px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors duration-300 hover:border-accent">
      {/* Icon placeholder + symbol/name */}
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white ${iconColor}`}
        >
          {upperSymbol.charAt(0)}
        </div>
        <div>
          <p className="text-lg font-semibold uppercase text-white">
            {upperSymbol}
          </p>
          {name && <p className="text-sm text-zinc-400">{name}</p>}
        </div>
      </div>

      {/* Current price */}
      <p className="mt-6 font-mono text-2xl font-semibold text-white">
        {formattedPrice}
      </p>

      {/* 24h change with directional arrow */}
      <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${changeColor}`}>
        <span aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
        <span>{formattedChange}</span>
        <span className="sr-only">24 hour change</span>
      </div>
    </div>
  );
}
