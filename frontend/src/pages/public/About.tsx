import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import nabinphoto from "../../assets/finley.jpg";

function About() {
  return (
      <div className="min-h-screen bg-[#030712] text-white">
        {/* Navigation */}
        <PublicNavbar />

        {/* Hero - REDUCED ONLY THIS TEXT SIZE */}
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-900/10 blur-[120px] rounded-full" />
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Reduced from text-7xl to text-5xl */}
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
              About <span className="text-[#89CFF0]">WorkFlow.</span>
            </h1>
            {/* Reduced from text-2xl to text-lg */}
            <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
              We believe productivity should be simple, not complicated.
            </p>
          </div>
        </section>

        {/* Our Story - Kept Original */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 border-b border-slate-800 pb-4">Our Story</h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                WorkFlow was born from a simple frustration: existing task management tools
                were either too basic or overwhelmingly complex. We needed something in between
                – powerful enough to handle real work, yet simple enough to use every day.
              </p>
              <p>
                In 2026, we set out to build the task management tool we wished existed.
                The result is WorkFlow – a platform that combines simplicity with the features
                teams actually need.
              </p>
            </div>
          </div>
        </section>

        {/* Founder Team Card - Kept Original */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#030712] border border-slate-800 p-10 rounded-3xl shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-[#89CFF0]/20 blur-2xl rounded-full" />
                  <img
                      src={nabinphoto}
                      alt="Nabin Oli"
                      className="w-40 h-40 rounded-full mx-auto object-cover border-2 border-slate-700 relative z-10 shadow-2xl transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-3xl font-bold mb-2">Nabin Oli</h3>
                <p className="text-[#89CFF0] font-mono tracking-widest uppercase text-sm mb-6">Founder & Developer</p>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                  Full-stack developer passionate about building tools that make people more productive.
                  Specialized in creating simple, powerful applications that solve real problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values - Kept Original */}
        <section className="py-24 px-4 bg-slate-900/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
                <h3 className="text-xl font-semibold mb-3 text-white">Transparency</h3>
                <p className="text-slate-400 leading-relaxed">
                  We believe in being open and honest with our users about our product,
                  pricing, and policies.
                </p>
              </div>
              <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
                <h3 className="text-xl font-semibold mb-3 text-white">Privacy First</h3>
                <p className="text-slate-400 leading-relaxed">
                  Your data is yours. We never sell your information and we protect
                  it with industry-standard encryption.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Kept Original */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Join Us?
            </h2>
            <Link
                to="/register"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-105 transition-all"
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

export default About;