// Root application component — foundation for the Paronia landing page.
// Renders the hero section; additional sections (cryptocurrency carousel,
// market trends) will be composed here in subsequent tasks.
import HeroSection from './components/HeroSection.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <HeroSection />
    </div>
  );
}
