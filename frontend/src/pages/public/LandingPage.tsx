import { useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import PublicNavbar from "../../components/PublicNavbar"
import HeroSection from "../../components/landing/HeroSection"
import PublicFooter from "../../components/PublicFooter"
import { CheckSquare, BarChart3, Users, Zap, ArrowRight, Clock, Shield } from "lucide-react"

const highlights = [
  {
    icon: Zap,
    title: "Lightning fast",
    desc: "Built for speed. No bloat, no delays, just instant task management.",
  },
  {
    icon: CheckSquare,
    title: "Smart organization",
    desc: "Categories, priorities, and filters to keep everything in its place.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    desc: "Share tasks, assign work, and stay in sync with your team.",
  },
  {
    icon: BarChart3,
    title: "Rich analytics",
    desc: "Track productivity with beautiful charts and streak tracking.",
  },
  {
    icon: Clock,
    title: "Due date tracking",
    desc: "Never miss a deadline with smart reminders and calendar view.",
  },
  {
    icon: Shield,
    title: "Secure by design",
    desc: "Your data is encrypted and protected. Enterprise-grade security.",
  },
]

function LandingPage() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload()
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar />
      <HeroSection />

      {/* Features preview */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Powerful features that help you and your team get more done.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-black p-8 group hover:bg-white/[0.02] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 transition-all">
                  <item.icon size={22} className="text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-24 px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-panel p-12 lg:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Join thousands of teams already using WorkFlow to manage their tasks.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
            >
              Get started free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.section>

      <PublicFooter />
    </div>
  )
}

export default LandingPage
