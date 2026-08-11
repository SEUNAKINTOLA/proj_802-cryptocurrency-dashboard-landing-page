// Footer section — page closure with social proof, a final CTA, and navigation.
// Four-column top grid (brand + three link columns), a centered "Start Trading
// Today" call-to-action, and a bottom bar with copyright and social icons.
// Dark background mirrors the rest of the Paronia landing page.

const NAV_COLUMNS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'API', 'Mobile App'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Blog', 'Press'],
  },
  {
    heading: 'Resources',
    links: ['Help Center', 'Community', 'Developers', 'Status'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top section: brand + navigation columns */}
        <div className="grid gap-8 lg:grid-cols-4 mb-8">
          {/* Column 1: brand, tagline, trust badges */}
          <div>
            <span className="text-2xl font-bold text-white">Paronia</span>
            <p className="mt-3 text-gray-400">Your Gateway into Blockchain</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.661 2.237a1 1 0 01.678 0l6 2.143A1 1 0 0117 5.32V10c0 3.517-2.163 6.71-5.66 8.14a1 1 0 01-.68 0C7.163 16.71 5 13.517 5 10V5.32a1 1 0 01.661-.94l4-1.429z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-300">Secure Platform</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 011.415-1.415l2.793 2.793 6.793-6.793a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-300">Licensed Exchange</span>
              </div>
            </div>
          </div>

          {/* Columns 2–4: navigation link groups */}
          {NAV_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Middle section: final call-to-action */}
        <div className="border-t border-zinc-800 py-10 text-center">
          <h2 className="text-2xl font-bold text-white">Start Trading Today</h2>
          <p className="mt-2 text-gray-400">Join 500K+ active traders</p>
          <button
            type="button"
            aria-label="Get started with Paronia"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Get Started
          </button>
        </div>

        {/* Bottom section: copyright + social icons */}
        <div className="flex flex-col gap-4 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            © 2024 Paronia. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Paronia on Twitter"
              className="text-gray-400 hover:text-accent transition-colors"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 001.96 9.824a4.647 4.647 0 01-2.11-.583v.06a4.66 4.66 0 003.737 4.568 4.692 4.692 0 01-2.104.08 4.661 4.661 0 004.352 3.234 9.348 9.348 0 01-5.786 1.995 9.5 9.5 0 01-1.112-.065 13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 002.323-2.41z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Paronia on Discord"
              className="text-gray-400 hover:text-accent transition-colors"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Paronia on Telegram"
              className="text-gray-400 hover:text-accent transition-colors"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
