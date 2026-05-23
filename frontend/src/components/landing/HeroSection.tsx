import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, CheckSquare, BarChart3, Users, Zap, Clock, Shield, Layers } from "lucide-react"

const features = [
  { icon: CheckSquare, label: "Task boards", desc: "Drag-and-drop organization" },
  { icon: BarChart3, label: "Analytics", desc: "Track your progress" },
  { icon: Users, label: "Teams", desc: "Collaborate in real-time" },
]

const stats = [
  { label: "Tasks completed", value: "10K+" },
  { label: "Active users", value: "5K+" },
  { label: "Teams using", value: "500+" },
  { label: "Uptime", value: "99.9%" },
]

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative mx-auto max-w-3xl"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/[0.04]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
            <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
            <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
          </div>
          <span className="ml-3 text-xs text-slate-600 font-mono tracking-wide">dashboard / workspace</span>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-400" />
              <span className="text-sm font-semibold text-white">Today's tasks</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">3 of 8 done</span>
          </div>
          {[
            { text: "Design system audit", tag: "Design", tagColor: "bg-primary-500/10 text-primary-400 border-primary-500/30", done: false },
            { text: "API integration review", tag: "Dev", tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", done: true },
            { text: "Team standup notes", tag: "Meeting", tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/30", done: false },
            { text: "Q2 roadmap planning", tag: "Planning", tagColor: "bg-sky-500/10 text-sky-400 border-sky-500/30", done: false },
            { text: "Deploy v2.1 to staging", tag: "DevOps", tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30", done: true },
          ].map((task, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all"
            >
              <div
                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                  task.done ? "bg-primary-500/20 border-primary-500/50" : "border-white/[0.12]"
                }`}
              >
                {task.done && <CheckSquare size={12} className="text-primary-400" />}
              </div>
              <span
                className={`flex-1 text-sm ${
                  task.done ? "text-slate-600 line-through" : "text-slate-200"
                }`}
              >
                {task.text}
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${task.tagColor}`}>
                {task.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function FloatingBadge({ icon: Icon, text, x, y, delay }: { icon: any; text: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/[0.08] shadow-xl"
      style={{ left: x, top: y }}
    >
      <Icon size={16} className="text-primary-400" />
      <span className="text-xs font-medium text-white whitespace-nowrap">{text}</span>
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
        >
          <Zap size={12} className="text-primary-400" />
          <span className="text-xs text-primary-300 font-medium tracking-wide">Task management, reimagined</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-gradient">Tasks, done right.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed"
        >
          A clean, fast workspace for managing tasks, tracking progress, and staying organized with your team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/features"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/10 transition-all"
          >
            <Layers size={16} />
            Explore features
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-5"
        >
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <f.icon size={18} className="text-primary-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{f.label}</div>
                <div className="text-xs text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-20">
        <FloatingBadge icon={Zap} text="Lightning fast" x="-5%" y="20%" delay={0.8} />
        <FloatingBadge icon={Shield} text="Secure & private" x="80%" y="15%" delay={1} />
        <FloatingBadge icon={Clock} text="Real-time sync" x="85%" y="55%" delay={1.2} />
        <DashboardPreview />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-20 mb-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-black py-8 px-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
