import Link from "next/link";
import SimpleCarousel from '../components/SimpleCarousel';

export default function Page() {
  // Carousel slides with image + description
  const carouselSlides = [
    { img: '/images/slide1.jpg', text: 'Track Your Expenses Easily' },
    { img: '/images/slide2.jpg', text: 'Analyze Spending Habits' },
    { img: '/images/slide3.jpg', text: 'Save Smarter with Insights' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Take Control of Your <span className="tracking-wide bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent transition-shadow duration-300 hover:drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)]">Expenses</span>
          </h1>
          <p className="text-lg text-gray-300">
            PocketGuard helps you track, analyze, and save money effortlessly.
            Manage your budget and achieve financial freedom.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link href="/signup" className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg shadow-lg transition">Get Started</Link>
            <Link href="/login" className="bg-white text-blue-800 hover:bg-gray-200 px-6 py-3 rounded-lg shadow-lg transition">Login</Link>
          </div>
        </div>
        <div className="flex-1 mt-10 md:mt-0 flex justify-center">
          <img src="/images/hero.svg" alt="Finance Management" className="rounded-2xl w-96" />
        </div>
      </section>
      {/* Carousel Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">See PocketGuard in Action</h2>
        <div className="h-80 md:h-96">
          {/* SimpleCarousel is a custom client component for Next.js */}
          <SimpleCarousel slides={carouselSlides} />
        </div>
      </section>
      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose PocketGuard?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Simple & Intuitive</h3>
            <p className="text-gray-300">Track expenses with ease using a clean, modern interface.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Secure & Reliable</h3>
            <p className="text-gray-300">Your data is protected with industry-standard encryption.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">Built to Save</h3>
            <p className="text-gray-300">Identify spending habits and grow your savings over time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
