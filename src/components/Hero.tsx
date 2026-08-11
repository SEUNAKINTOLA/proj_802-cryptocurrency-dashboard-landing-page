// Hero — primary conversion element of the landing page.
//
// Redesigned for a clear three-tier visual hierarchy:
//   1. Headline    (h1, --font-size-hero-h1)
//   2. Subheadline (p,  --font-size-hero-subtitle)
//   3. CTA button  (--font-size-cta)
//
// Structure uses semantic HTML5 (<section> landmark > <header> > <h1>/<p>)
// and a CSS Grid layout. All color, typography, and spacing come from the
// shared design tokens via `hero.css`, keeping the component free of
// hard-coded style literals.
import '../styles/hero.css';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-headline">
      <header className="hero__content">
        <p className="hero__eyebrow">Ethereum 2.0</p>

        <h1 id="hero-headline" className="hero__headline">
          Your Gateway into Blockchain
        </h1>

        <p className="hero__subheadline">
          Paronia is a blockchain platform. We make blockchain accessible —
          trade, transfer, and track digital assets with confidence.
        </p>

        <button
          type="button"
          className="hero__cta"
          aria-label="Learn more about Paronia"
        >
          Learn More
        </button>
      </header>

      <div
        className="hero__media"
        role="img"
        aria-label="3D geometric blockchain illustration"
      >
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=800"
          alt=""
          width="800"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
