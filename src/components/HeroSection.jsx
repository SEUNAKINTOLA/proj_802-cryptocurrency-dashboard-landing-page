// Hero section — primary conversion element of the Paronia landing page.
// Split-screen layout: gradient-lit content on the left, 3D geometric
// illustration on the right, with animated gradient blobs for depth.
export default function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2"
    >
      {/* Left: branding, headline, tagline, CTA */}
      <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-gradient-start to-gradient-end px-6 py-20 sm:px-12 lg:px-16">
        {/* Animated gradient blobs for organic visual interest */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-purple-400/30 mix-blend-multiply blur-3xl animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-pink-400/30 mix-blend-multiply blur-3xl animate-blob animation-delay-2000"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 rounded-full bg-fuchsia-400/30 mix-blend-multiply blur-3xl animate-blob animation-delay-4000"
        />

        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent sm:text-base">
            Ethereum 2.0
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white lg:text-6xl">
            Your Gateway into Blockchain
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Paronia is a blockchain platform. We make blockchain accessible.
          </p>

          <button
            type="button"
            aria-label="Learn more about Paronia"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gradient-start"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right: 3D geometric illustration. A gradient placeholder fills the
          frame while the Unsplash image lazy-loads, preventing a flash of
          empty space and layout shift. */}
      <div className="relative min-h-[50vh] overflow-hidden bg-gradient-to-br from-gradient-start to-gradient-end lg:min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=800"
          alt="3D geometric blockchain illustration"
          width="800"
          height="800"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
