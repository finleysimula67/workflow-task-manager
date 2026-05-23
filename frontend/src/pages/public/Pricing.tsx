import { motion } from "framer-motion"
import PublicNavbar from "../../components/PublicNavbar"
import PublicFooter from "../../components/PublicFooter"
import { Check, Zap, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for getting started with personal task management.",
    features: ["Up to 10 tasks", "Basic categories", "Due dates", "Priority levels", "Single user"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    desc: "For professionals who need more power and flexibility.",
    features: [
      "Unlimited tasks",
      "Advanced categories",
      "Team collaboration (up to 5)",
      "Analytics & charts",
      "Export to CSV/PDF",
      "Task templates",
      "Priority support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "/month",
    desc: "For teams that need full control and dedicated support.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Admin controls",
      "Activity audit log",
      "Custom fields",
      "API access",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

function Pricing() {
  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Zap size={12} className="text-primary-400" />
              <span className="text-xs text-primary-300 font-medium">Simple pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Plans for every{" "}
              <span className="text-gradient">workflow</span>
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-black p-8 lg:p-10 flex flex-col ${
                  plan.popular ? "ring-2 ring-primary-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold shadow-lg">
                    Most popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-400">
                      <Check size={16} className="text-primary-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                    plan.popular
                      ? "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default Pricing
