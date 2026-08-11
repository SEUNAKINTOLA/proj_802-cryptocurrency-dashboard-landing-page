// Root application component — foundation for the Paronia landing page.
// HeroSection and CryptoCarousel are above the fold and stay eager so the
// initial paint is fast. Below-the-fold sections (MarketTrendTable,
// QuickTransferPreview, Footer) are code-split via React.lazy and streamed in
// with Suspense fallbacks, guarded by an ErrorBoundary so a failed chunk load
// degrades gracefully instead of blanking the page.
import { lazy, Suspense } from 'react';
import HeroSection from './components/HeroSection.jsx';
import CryptoCarousel from './components/CryptoCarousel.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const MarketTrendTable = lazy(() => import('./components/MarketTrendTable.jsx'));
const QuickTransferPreview = lazy(() =>
  import('./components/QuickTransferPreview.jsx')
);
const Footer = lazy(() => import('./components/Footer.jsx'));

// Skeleton placeholder shown while a lazy chunk is being fetched.
function SectionFallback() {
  return (
    <div className="mx-auto my-8 h-64 max-w-6xl animate-pulse rounded-2xl bg-zinc-900" />
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <HeroSection />
      <CryptoCarousel />
      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <MarketTrendTable />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <QuickTransferPreview />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
