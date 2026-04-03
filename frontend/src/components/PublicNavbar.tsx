import type { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Reset menu state and ensure component "wakes up" on route change
  // This helps prevent the navbar from getting stuck in a hidden or
  // background state during back-button navigation.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
      <nav className="bg-[#030712]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#89CFF0] group-hover:text-white transition duration-300">
                  Work
                </span>
                <span className="text-white group-hover:text-[#89CFF0] transition duration-300">
                  Flow
                </span>
              </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                  to="/features"
                  className="text-slate-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                Features
              </Link>
              <Link
                  to="/about"
                  className="text-slate-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                About
              </Link>
              <Link
                  to="/pricing"
                  className="text-slate-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                Pricing
              </Link>
              <Link
                  to="/contact"
                  className="text-slate-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition font-medium text-sm"
              >
                Login
              </Link>
              <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(79,70,229,0.3)] font-semibold text-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
              <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
              <div className="md:hidden py-6 border-t border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="flex flex-col space-y-4">
                  <Link to="/features" className="text-slate-300 hover:text-white px-2 py-1 font-medium text-lg">Features</Link>
                  <Link to="/about" className="text-slate-300 hover:text-white px-2 py-1 font-medium text-lg">About</Link>
                  <Link to="/pricing" className="text-slate-300 hover:text-white px-2 py-1 font-medium text-lg">Pricing</Link>
                  <Link to="/contact" className="text-slate-300 hover:text-white px-2 py-1 font-medium text-lg">Contact</Link>
                  <div className="border-t border-slate-800 pt-6 mt-2 space-y-4">
                    <Link to="/login" className="block text-slate-300 hover:text-white px-2 py-1 font-medium text-lg">Login</Link>
                    <Link to="/register" className="block px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-center font-bold shadow-lg">Get Started</Link>
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>
  );
}

export default PublicNavbar;