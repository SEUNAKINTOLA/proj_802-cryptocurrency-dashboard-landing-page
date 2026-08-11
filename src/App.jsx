// Root application component — foundation for the Paronia landing page.
// This is intentionally minimal and will be expanded in subsequent tasks with
// the hero section, cryptocurrency carousel, and market trend sections.
export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
          Paronia
        </h1>
        <p className="mt-4 text-lg text-zinc-300 md:text-2xl">
          Your Gateway into Blockchain
        </p>
      </header>
    </div>
  );
}
