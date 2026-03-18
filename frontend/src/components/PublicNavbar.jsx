import { Link } from 'react-router-dom';
import { useState } from 'react';

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-blue-500">Work</span>
                <span className="text-gray-900">Flow</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Features
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              About
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="h-6 w-6 text-gray-700" 
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
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/features" 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t pt-3 mt-3">
                <Link 
                  to="/login" 
                  className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 mt-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;
