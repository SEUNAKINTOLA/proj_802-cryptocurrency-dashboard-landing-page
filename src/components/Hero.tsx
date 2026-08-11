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
//
// Interaction polish: on mount the headline, subheadline, and CTA play a
// staggered fade-in-up entrance (0ms / 150ms / 300ms) via the utilities in
// `animations.css`. Elements render fully visible by default and only take on
// the animation classes once JS has mounted, so content is never hidden if
// scripts fail to load. Motion is disabled automatically for users who prefer
// reduced motion (handled in the stylesheet).
import { useEffect, useState } from 'react';
import '../styles/animations.css';
import '../styles/hero.css';

// Join truthy class names, dropping the empty strings produced before mount.
function cx(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

export default function Hero() {
  // `isVisible` gates the entrance animation. It starts false so the initial
  // render carries no animation classes (content visible, no-JS safe), then
  // flips to true on mount to trigger the staggered reveal.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Defer one frame so the browser commits the un-animated initial state
    // before the animation classes are applied on the next paint.
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Compose the reveal classes only after mount. `delay` maps to the staggered
  // animation-delay utilities from animations.css.
  const reveal = (delay?: string): string =>
    isVisible ? cx('animate-fade-in-up', delay) : '';

  return (
    <section
      className={cx('hero', isVisible && 'is-visible')}
      data-animate={isVisible ? 'in' : 'idle'}
      aria-labelledby="hero-headline"
    >
      <header className="hero__content">
        <p className={cx('hero__eyebrow', reveal())}>Ethereum 2.0</p>

        <h1
          id="hero-headline"
          className={cx('hero__headline', reveal())}
        >
          Your Gateway into Blockchain
        </h1>

        <p className={cx('hero__subheadline', reveal('animation-delay-150'))}>
          Paronia is a blockchain platform. We make blockchain accessible —
          trade, transfer, and track digital assets with confidence.
        </p>

        <button
          type="button"
          className={cx('hero__cta', reveal('animation-delay-300'))}
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
