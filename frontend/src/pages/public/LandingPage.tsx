import type { ReactElement } from 'react';
import { useEffect } from 'react'; // Added useEffect
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

function LandingPage() {
  /**
   * FIX FOR THE WHITE SCREEN:
   * This effect detects if the user navigated "Back" to this page.
   * If the browser tries to serve a "frozen" cached version (BFCache),
   * we force a reload to ensure the UI paints correctly.
   */
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
      <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-purple-500/30">
        {/* Navigation */}
        <PublicNavbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Background Glows to match the image */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-300">Stay organized. Stay consistent.</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                Manage Your Tasks
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
                  Like a Pro
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                Simple, powerful task management for teams and individuals.
                Stay organized, boost productivity, and achieve your goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/register"
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                >
                  Get Started Free
                </Link>
                <Link
                    to="/features"
                    className="px-10 py-4 bg-slate-900/50 text-white rounded-xl text-lg font-semibold hover:bg-slate-800 transition border border-slate-700 backdrop-blur-sm"
                >
                  See Features
                </Link>
              </div>
            </div>

            {/* Stats Section with Dark Cards */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition duration-300">
                <div className="text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-slate-400 font-medium">Active Users</div>
              </div>
              <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-purple-500/50 transition duration-300">
                <div className="text-5xl font-bold text-white mb-2">10,000+</div>
                <div className="text-slate-400 font-medium">Tasks Completed</div>
              </div>
              <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition duration-300">
                <div className="text-5xl font-bold text-white mb-2">99.9%</div>
                <div className="text-slate-400 font-medium">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 bg-[#030712] relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Everything You Need to Stay Organized
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful features designed to help you work smarter, not harder
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition duration-300">
                  <svg className="w-7 h-7 text-blue-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Task Management</h3>
                <p className="text-slate-400 leading-relaxed">
                  Create, organize, and track tasks effortlessly with our intuitive interface
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition duration-300">
                  <svg className="w-7 h-7 text-purple-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Categories & Tags</h3>
                <p className="text-slate-400 leading-relaxed">
                  Organize tasks with custom categories and color-coded labels
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition group">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition duration-300">
                  <svg className="w-7 h-7 text-emerald-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">File Attachments</h3>
                <p className="text-slate-400 leading-relaxed">
                  Attach files up to 50MB to any task for easy reference
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition group">
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition duration-300">
                  <svg className="w-7 h-7 text-amber-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Search & Filter</h3>
                <p className="text-slate-400 leading-relaxed">
                  Find any task instantly with powerful search and filter options
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition group">
                <div className="w-14 h-14 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600 transition duration-300">
                  <svg className="w-7 h-7 text-rose-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Statistics</h3>
                <p className="text-slate-400 leading-relaxed">
                  Track your progress with detailed statistics and insights
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition group">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition duration-300">
                  <svg className="w-7 h-7 text-indigo-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Secure & Private</h3>
                <p className="text-slate-400 leading-relaxed">
                  Your data is encrypted and secure with OAuth2 authentication
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Get Started in 3 Simple Steps
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-lg rotate-3">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Sign Up Free</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Create your account in seconds with email or Google
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-lg -rotate-3">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Create Tasks</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Add your tasks and organize them with categories
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-lg rotate-3">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Stay Organized</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Track progress and achieve your goals effortlessly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Get Organized?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Join hundreds of users who trust WorkFlow for their task management
            </p>
            <Link
                to="/register"
                className="inline-block px-12 py-5 bg-white text-slate-950 rounded-xl text-lg font-bold hover:bg-slate-100 transition shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <PublicFooter />
      </div>
  );
}

export default LandingPage;