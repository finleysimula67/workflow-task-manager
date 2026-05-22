import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { taskApi } from "../api/taskApi"
import { authApi } from "../api/authApi"
import StatCard from "../components/StatCard"
import RecentTaskItem from "../components/RecentTaskItem"
import RecentActivity from "../components/RecentActivity"
import EmailVerificationBanner from "../components/EmailVerificationBanner"
import type { TaskStats, Task } from "../types"
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plus, TrendingUp, Calendar, Flag, Flame, ListTodo } from "lucide-react"
import { motion } from "framer-motion"

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [productivity, setProductivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = authApi.getCurrentUser()

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const statsRes = await taskApi.getTaskStats()
      if (statsRes.success) setStats(statsRes.data)
      const tasksRes = await taskApi.getAllTasks()
      if (tasksRes.success && tasksRes.data) {
        const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : []
        setRecentTasks(tasks.slice(0, 5))
      }
      const prodRes = await taskApi.getProductivity()
      if (prodRes.success) setProductivity(prodRes.data)
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard")
    } finally { setLoading(false) }
  }

  useEffect(() => { loadDashboard() }, [])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Good Morning"
    if (h < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const completionRate = stats?.totalTasks ? Math.round(((stats.completedTasks || 0) / stats.totalTasks) * 100) : 0

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-slate-500 animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fadeIn">
      <EmailVerificationBanner />

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            {getGreeting()}{user?.username ? `, ${user.username.split(" ")[0]}` : ""}
            <span className="text-slate-500">.</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your tasks today</p>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.97]"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="frost p-4">
          <p className="text-sm text-red-400 flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon={<CheckSquare size={20} />} accent="primary" />
        <StatCard title="In Progress" value={stats?.inProgressTasks ?? 0} icon={<Clock size={20} />} accent="amber" />
        <StatCard title="Completed" value={stats?.completedTasks ?? 0} icon={<CheckCircle2 size={20} />} accent="emerald" />
        <StatCard title="Overdue" value={stats?.overdueTasks ?? 0} icon={<AlertTriangle size={20} />} accent="red" />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary-400" />
            <h3 className="font-semibold text-white">Completion Rate</h3>
          </div>
          <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
            />
          </div>
          <p className="text-sm text-slate-500 mt-3">{completionRate}% complete</p>
        </motion.div>

        {/* Due This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-amber-400" />
            <h3 className="font-semibold text-white">Due This Week</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats?.dueSoonTasks ?? stats?.dueSoon ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">tasks due in the next 7 days</p>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-400" />
            <h3 className="font-semibold text-white">Current Streak</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{productivity?.currentStreak || 0}</span>
            <span className="text-sm text-slate-500">days</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Best: {productivity?.longestStreak || 0} days
          </p>
        </motion.div>
      </div>

      {/* Bottom Grid: Recent Tasks + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-panel overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo size={18} className="text-slate-400" />
              <h3 className="font-semibold text-white">Recent Tasks</h3>
            </div>
            <button
              onClick={() => navigate("/tasks")}
              className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No tasks yet. Create your first task!
              </div>
            ) : (
              recentTasks.map((task) => (
                <RecentTaskItem
                  key={task.id}
                  task={task}
                  onClick={() => navigate("/tasks")}
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
