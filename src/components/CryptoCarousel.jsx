// Live cryptocurrency price carousel — fetches BTC, ETH and LTC prices from
// the CoinGecko free API on mount, then renders horizontally scrollable
// CryptoCard components with a scroll-triggered reveal animation.
import { useEffect, useRef, useState } from 'react';
import CryptoCard from './CryptoCard.jsx';

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd&include_24hr_change=true';

// Maps CoinGecko ids to the display metadata the cards expect.
const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
];

export default function CryptoCarousel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  // Fetch live prices once on mount.
  useEffect(() => {
    let isMounted = true;

    async function fetchPrices() {
      try {
        const response = await fetch(COINGECKO_URL);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();

        const mapped = COINS.map((coin) => ({
          ...coin,
          price: data[coin.id]?.usd,
          change24h: data[coin.id]?.usd_24h_change,
        }));

        if (isMounted) {
          setCryptoData(mapped);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            'Unable to load live cryptocurrency prices right now. Please try again later.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPrices();

    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll-triggered reveal via IntersectionObserver.
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
      aria-label="Live cryptocurrency prices"
      className={`max-w-6xl mx-auto px-6 py-12 transition-all duration-700 ease-out ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-white">
        Live Cryptocurrency Prices
      </h2>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-300"
        >
          {error}
        </div>
      ) : (
        <div
          aria-live="polite"
          aria-busy={loading}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
        >
          {loading
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="min-w-[240px] animate-pulse rounded-2xl border border-zinc-800 bg-zinc-800 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-700" />
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded bg-zinc-700" />
                      <div className="h-3 w-20 rounded bg-zinc-700" />
                    </div>
                  </div>
                  <div className="mt-6 h-6 w-32 rounded bg-zinc-700" />
                  <div className="mt-2 h-4 w-20 rounded bg-zinc-700" />
                </div>
              ))
            : cryptoData.map((coin) => (
                <div key={coin.id} className="snap-start">
                  <CryptoCard
                    symbol={coin.symbol}
                    name={coin.name}
                    price={coin.price}
                    change24h={coin.change24h}
                  />
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
