import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

function Features() {
  return (
      <div className="min-h-screen bg-[#030712] text-white">
        {/* Navigation */}
        <PublicNavbar />

        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Background Glow Accents */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage tasks efficiently without the clutter.
            </p>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto space-y-32">

            {/* Feature 1 - Task Management */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative z-10">
                <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-[#89CFF0] rounded-full text-sm font-bold mb-6">
                  Core Engine
                </div>
                <h2 className="text-4xl font-bold mb-6 text-white">Task Management</h2>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                  Create, edit, and organize your tasks with ease. Set priorities, due dates,
                  and track progress all in one place with a professional interface.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-blue-500/20 rounded-full">
                      <svg className="w-4 h-4 text-[#89CFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Quick task creation with keyboard shortcuts</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-blue-500/20 rounded-full">
                      <svg className="w-4 h-4 text-[#89CFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Priority levels (Low, Medium, High)</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-blue-500/20 rounded-full">
                      <svg className="w-4 h-4 text-[#89CFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Status tracking (Todo, In Progress, Done)</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-blue-500/20 rounded-full">
                      <svg className="w-4 h-4 text-[#89CFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Due date reminders and notifications</span>
                  </li>
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full transition group-hover:bg-blue-500/30" />
                <div className="relative bg-slate-900/50 border border-slate-800 h-80 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
                  <span className="text-slate-500 font-mono text-sm tracking-widest uppercase">Task Interface Preview</span>
                </div>
              </div>
            </div>

            {/* Feature 2 - Categories */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative group">
                <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full transition group-hover:bg-purple-500/30" />
                <div className="relative bg-slate-900/50 border border-slate-800 h-80 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
                  <span className="text-slate-500 font-mono text-sm tracking-widest uppercase">Organization Preview</span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-bold mb-6">
                  Organization
                </div>
                <h2 className="text-4xl font-bold mb-6 text-white">Smart Categories</h2>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                  Organize your tasks with custom categories. Use colors to visually
                  distinguish between different types of work and stay focused.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-purple-500/20 rounded-full">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Create unlimited custom categories</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-purple-500/20 rounded-full">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Color-coded labels for quick identification</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-purple-500/20 rounded-full">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Filter and sort tasks by category</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 - Statistics */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-bold mb-6">
                  Insights
                </div>
                <h2 className="text-4xl font-bold mb-6 text-white">Insightful Statistics</h2>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                  Track your productivity with detailed statistics. See what you've
                  accomplished and identify areas for improvement.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-green-500/20 rounded-full">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Task completion rates over time</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="mr-3 p-1 bg-green-500/20 rounded-full">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Visual charts and progress tracking</span>
                  </li>
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500/20 blur-[80px] rounded-full transition group-hover:bg-green-500/30" />
                <div className="relative bg-slate-900/50 border border-slate-800 h-80 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
                  <span className="text-slate-500 font-mono text-sm tracking-widest uppercase">Statistics Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-slate-900 to-[#030712] border border-slate-800 p-16 rounded-[2rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to Try These Features?
            </h2>
            <p className="text-xl text-slate-400 mb-10 relative z-10">
              Get started with WorkFlow today and boost your productivity.
            </p>
            <Link
                to="/register"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-105 transition-all relative z-10"
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

export default Features;