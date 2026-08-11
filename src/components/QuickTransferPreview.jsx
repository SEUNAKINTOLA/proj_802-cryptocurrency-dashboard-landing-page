// Quick Transfer preview section — a two-column showcase pairing marketing copy
// and a social-proof badge with the static TransferWidget. Revealed with a
// scroll-triggered fade/slide, mirroring the other sections on the page.
import { useEffect, useRef, useState } from 'react';
import TransferWidget from './TransferWidget.jsx';

export default function QuickTransferPreview() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered reveal via IntersectionObserver, mirroring MarketTrendTable.
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
      aria-label="Quick transfer preview"
      className={`max-w-6xl mx-auto px-6 py-12 transition-all duration-700 ease-out ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="grid gap-12 items-center lg:grid-cols-2">
        {/* Left column: copy + social proof */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-white">Quick Transfer</h2>
          <p className="text-lg text-gray-400 mb-6">
            Send cryptocurrency to your contacts instantly. Save your favorite
            wallets and transfer with one click.
          </p>
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 011.415-1.415l2.793 2.793 6.793-6.793a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-300">
              1M+ transactions processed
            </span>
          </div>
        </div>

        {/* Right column: transfer widget */}
        <div>
          <TransferWidget />
        </div>
      </div>
    </section>
  );
}
