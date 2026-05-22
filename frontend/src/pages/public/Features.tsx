import { motion } from "framer-motion"
import PublicNavbar from "../../components/PublicNavbar"
import PublicFooter from "../../components/PublicFooter"
import {
  CheckSquare, BarChart3, Users, Zap, Clock, Shield, Filter,
  Download, Bell, Calendar, FolderOpen, Tag, RefreshCw, Search,
  ArrowRight, Layers, Palette, Globe, Smartphone
} from "lucide-react"
import { Link } from "react-router-dom"

const categories = [
  {
    title: "Core Features",
    features: [
      { icon: CheckSquare, name: "Task Management", desc: "Create, organize, and track tasks with ease. Drag-and-drop interface for quick reordering." },
      { icon: FolderOpen, name: "Categories", desc: "Organize tasks into custom categories with color coding for visual clarity." },
      { icon: Tag, name: "Labels & Priorities", desc: "Tag tasks with priority levels and custom labels for better filtering." },
      { icon: Calendar, name: "Due Dates", desc: "Set deadlines, view calendar, and never miss a due date." },
    ],
  },
  {
    title: "Productivity",
    features: [
      { icon: BarChart3, name: "Analytics & Stats", desc: "Track completion rates, productivity trends, and team performance." },
      { icon: RefreshCw, name: "Streak Tracking", desc: "Build momentum with daily streak tracking and weekly goals." },
      { icon: Bell, name: "Smart Reminders", desc: "Get notified about upcoming deadlines and overdue tasks." },
      { icon: Search, name: "Full-Text Search", desc: "Find any task instantly with powerful search across your workspace." },
    ],
  },
  {
    title: "Collaboration",
    features: [
      { icon: Users, name: "Team Workspaces", desc: "Invite team members, assign tasks, and collaborate in real-time." },
      { icon: Filter, name: "Advanced Filtering", desc: "Filter tasks by status, priority, category, and more." },
      { icon: Download, name: "Export Options", desc: "Export your tasks to CSV or PDF for reporting and sharing." },
      { icon: Globe, name: "Cross-Platform", desc: "Access your tasks from any device with our responsive web app." },
    ],
  },
  {
    title: "Advanced",
    features: [
      { icon: Shield, name: "Role-Based Access", desc: "Admin and user roles with granular permission control." },
      { icon: Layers, name: "Task Templates", desc: "Save time with reusable task templates for common workflows." },
      { icon: Palette, name: "Customizable UI", desc: "Dark theme optimized for long working sessions." },
      { icon: Smartphone, name: "Mobile Optimized", desc: "Full-featured mobile experience with touch-friendly interface." },
    ],
  },
]

function Features() {
  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Zap size={12} className="text-primary-400" />
              <span className="text-xs text-primary-300 font-medium">Everything you need</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Powerful features for{" "}
              <span className="text-gradient">productive teams</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              From task management to team collaboration, WorkFlow has everything you need to stay organized.
            </p>
          </motion.div>

          {categories.map((category, ci) => (
            <div key={category.title} className="mb-16 last:mb-0">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl font-bold text-white mb-8 flex items-center gap-3"
              >
                <span className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">
                  {ci + 1}
                </span>
                {category.title}
              </motion.h2>
              <div className="grid sm:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
                {category.features.map((feature, fi) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fi * 0.05 }}
                    className="bg-black p-6 lg:p-8 group hover:bg-white/[0.02] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-all">
                        <feature.icon size={20} className="text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1.5">{feature.name}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
            >
              Start building <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default Features
