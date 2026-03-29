import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  MousePointerClick,
  Globe
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('annual');

  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "For individuals just getting organized.",
      features: ["50 active tasks", "5 project categories", "Basic analytics", "Community forum access"],
      cta: "Get Started",
      link: "/register",
      highlight: false
    },
    {
      name: "Pro",
      price: billingCycle === 'annual' ? "9" : "12",
      description: "Advanced tools for high-performance creators.",
      features: ["Unlimited tasks", "Unlimited categories", "Priority support", "Advanced statistics", "50MB attachments", "Custom tags"],
      cta: "Go Pro",
      link: "/register",
      highlight: true
    },
    {
      name: "Enterprise",
      price: billingCycle === 'annual' ? "29" : "35",
      description: "Total control for scaling organizations.",
      features: ["Everything in Pro", "Up to 20 seats", "Admin dashboard", "SSO/SAML", "Dedicated manager"],
      cta: "Contact Sales",
      link: "/contact",
      highlight: false
    }
  ];

  return (
      <div className="min-h-screen bg-[#030712] text-white selection:bg-purple-500/30 font-sans">
        <PublicNavbar />

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          {/* Background Glows - matching landing page */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge - matching landing page style */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-slate-300">Simple. Transparent. Pricing.</span>
              </div>
            </div>

            {/* Heading - matching landing page style */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Choose Your Plan
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
                Scale with Ease
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Start free, upgrade when you need. No hidden fees, no surprises.
              Cancel anytime.
            </p>

            {/* Billing Switcher */}
            <div className="flex items-center justify-center gap-4 bg-slate-900/50 w-fit mx-auto p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                      billingCycle === 'monthly'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                          : 'text-slate-400 hover:text-white'
                  }`}
              >
                Monthly
              </button>
              <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                      billingCycle === 'annual'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                          : 'text-slate-400 hover:text-white'
                  }`}
              >
                Annual
              </button>
            </div>

            {billingCycle === 'annual' && (
                <p className="mt-4 text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Save 20% with annual billing
                </p>
            )}
          </div>
        </section>

        {/* --- BENTO PRICING GRID --- */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
                <div
                    key={i}
                    className={`group relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col ${
                        plan.highlight
                            ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-500/50 shadow-[0_0_40px_rgba(79,70,229,0.2)]'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 backdrop-blur-sm'
                    }`}
                >
                  {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                        Most Popular
                      </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-bold text-white">${plan.price}</span>
                      <span className={`text-sm font-medium ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>/mo</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-12 flex-grow">
                    {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check
                              size={16}
                              className={plan.highlight ? 'text-blue-400' : 'text-slate-600'}
                              strokeWidth={3}
                          />
                          <span className={`text-sm font-medium ${plan.highlight ? 'text-slate-200' : 'text-slate-400'}`}>
                            {feature}
                          </span>
                        </div>
                    ))}
                  </div>

                  <Link
                      to={plan.link}
                      className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all ${
                          plan.highlight
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                              : 'bg-slate-900/50 border border-slate-700 text-white hover:bg-slate-800 transition'
                      }`}
                  >
                    {plan.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
            ))}
          </div>
        </section>

        {/* --- FEATURE HIGHLIGHTS (BENTO STYLE) --- */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 flex flex-col justify-between hover:border-slate-700 transition-all group backdrop-blur-sm">
              <div className="bg-blue-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-4">Enterprise Grade Security</h4>
                <p className="text-slate-500 leading-relaxed">
                  Your data is encrypted both at rest and in transit. We use bank-level 256-bit AES encryption to ensure your workflows remain private.
                </p>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 hover:border-slate-700 transition-all text-center flex flex-col items-center backdrop-blur-sm">
              <div className="mb-6 text-purple-500">
                <MousePointerClick size={40} />
              </div>
              <h4 className="text-xl font-bold mb-2">1-Click Import</h4>
              <p className="text-slate-500 text-sm">Move from Notion or Trello in seconds.</p>
            </div>

            {/* Small Card 2 */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 hover:border-slate-700 transition-all text-center flex flex-col items-center backdrop-blur-sm">
              <div className="mb-6 text-green-500">
                <Globe size={40} />
              </div>
              <h4 className="text-xl font-bold mb-2">Global Sync</h4>
              <p className="text-slate-500 text-sm">Real-time updates across all your devices.</p>
            </div>

            {/* Card: High Stats */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">99.9%</div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Uptime Guaranteed</div>
            </div>

            {/* Wide Feature Card */}
            <div className="md:col-span-3 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:border-slate-700 transition-all backdrop-blur-sm">
              <div className="max-w-md">
                <h4 className="text-2xl font-bold mb-4">Advanced Analytics</h4>
                <p className="text-slate-500 leading-relaxed">
                  Gain deep insights into your productivity patterns. Identify bottlenecks and optimize your schedule with our AI-driven reporting.
                </p>
              </div>
              <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 w-full max-w-sm">
                <div className="flex items-end gap-2 h-32">
                  <div className="flex-1 bg-blue-500/20 h-[40%] rounded-t-lg" />
                  <div className="flex-1 bg-blue-500/40 h-[60%] rounded-t-lg" />
                  <div className="flex-1 bg-blue-500/60 h-[90%] rounded-t-lg" />
                  <div className="flex-1 bg-blue-500/40 h-[70%] rounded-t-lg" />
                  <div className="flex-1 bg-blue-500 h-[100%] rounded-t-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="py-24 px-6 border-t border-slate-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Questions & Answers</h2>
            <div className="space-y-4">
              {[
                { q: "Can I upgrade at any time?", a: "Yes, you can change your plan at any point. Your billing will be adjusted automatically on a prorated basis." },
                { q: "Is there a student discount?", a: "We offer 50% off for verified students and non-profits. Contact our support team to apply." },
                { q: "How secure is my data?", a: "We use top-tier encryption and regular third-party audits to keep your data safe." }
              ].map((item, i) => (
                  <details key={i} className="group border border-slate-800 bg-slate-900/40 rounded-2xl p-6 cursor-pointer backdrop-blur-sm">
                    <summary className="flex items-center justify-between font-bold text-lg list-none group-open:text-blue-400 transition-colors">
                      {item.q}
                      <span className="text-2xl group-open:rotate-45 transition-transform inline-block">+</span>
                    </summary>
                    <p className="mt-4 text-slate-400 text-sm leading-relaxed">{item.a}</p>
                  </details>
              ))}
            </div>
          </div>
        </section>

        {/* --- FINAL CALL TO ACTION --- */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Ready to Get
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
                Organized?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Join 50,000+ professionals who have reclaimed their time with WorkFlow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                  to="/register"
                  className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-bold hover:opacity-90 transition shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                Start for free
              </Link>
              <Link
                  to="/contact"
                  className="px-12 py-5 bg-slate-900/50 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition border border-slate-700 backdrop-blur-sm"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
  );
}