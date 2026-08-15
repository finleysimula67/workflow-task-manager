import { motion } from "framer-motion"
import PublicNavbar from "../../components/PublicNavbar"
import PublicFooter from "../../components/PublicFooter"
import { Zap, Target, Heart, Shield } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    desc: "We believe great tools make great teams. Our mission is to build the best task management experience.",
  },
  {
    icon: Heart,
    title: "User First",
    desc: "Every feature we build starts with understanding what our users need to succeed.",
  },
  {
    icon: Zap,
    title: "Fast & Focused",
    desc: "Speed is a feature. We optimize every interaction to be instant and delightful.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    desc: "Your data is sacred. We maintain enterprise-grade security and privacy standards.",
  },
]

function About() {
  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <span className="text-xs text-primary-300 font-medium">About us</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Building the future of{" "}
              <span className="text-gradient">task management</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              WorkFlow was founded with a simple idea: task management should be powerful, beautiful, and effortless.
            </p>
          </motion.div>

          <div className="glass-panel p-8 lg:p-12 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                WorkFlow started as a side project by a small team of developers who were frustrated with the complexity
                of existing project management tools. We wanted something that was powerful enough for professional use,
                yet simple enough that anyone could pick it up in minutes.
              </p>
              <p>
                Today, WorkFlow is used by thousands of individuals and teams around the world. We continue to iterate
                based on user feedback, adding features that genuinely improve productivity without adding unnecessary
                complexity.
              </p>
              <p>
                We're bootstrapped, independent, and committed to building a sustainable product that puts users first.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden mb-16">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-black p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                  <value.icon size={22} className="text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default About
