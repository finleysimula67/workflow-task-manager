import { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import toast from 'react-hot-toast';
import type { TaskStats as TaskStatsType } from '../types';
import { CheckSquare, Zap, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const statCards = [
  { key: 'totalTasks' as const, label: 'Total Tasks', icon: CheckSquare, color: 'text-primary-400', bar: 'bg-primary-500/60' },
  { key: 'inProgressTasks' as const, label: 'Active Tasks', icon: Zap, color: 'text-amber-400', bar: 'bg-amber-500/60' },
  { key: 'completedTasks' as const, label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', bar: 'bg-emerald-500/60' },
  { key: 'overdueTasks' as const, label: 'Overdue', icon: AlertTriangle, color: 'text-red-400', bar: 'bg-red-500/60' },
];

function TaskStats() {
  const [stats, setStats] = useState<TaskStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTaskStats();
      if (response.success) setStats(response.data);
    } catch { toast.error('Failed to load statistics'); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, bar }) => (
          <motion.div key={key} variants={item} className="glass-panel p-5 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stats[key]}</p>
              </div>
              <div className={`rounded-xl p-2.5 bg-white/5 border border-white/[0.04] ${color}`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${bar}`} style={{ width: `${Math.min((stats[key] / Math.max(stats.totalTasks, 1)) * 100, 100)}%` }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-panel p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-400" />
            Tasks by Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'To Do', value: stats.todoTasks, pct: stats.statusDistribution?.TODO, color: 'bg-primary-400' },
              { label: 'In Progress', value: stats.inProgressTasks, pct: stats.statusDistribution?.IN_PROGRESS, color: 'bg-amber-400' },
              { label: 'Completed', value: stats.completedTasks, pct: stats.statusDistribution?.COMPLETED, color: 'bg-emerald-400' },
              { label: 'Archived', value: stats.archivedTasks, pct: stats.statusDistribution?.ARCHIVED, color: 'bg-slate-500' },
            ].map(({ label, value, pct, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                <span className="text-sm text-slate-400 flex-1">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
                <span className="text-xs text-slate-500 w-12 text-right">{pct?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-panel p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-400" />
            Tasks by Priority
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Urgent', value: stats.urgentPriorityTasks, pct: stats.priorityDistribution?.URGENT, color: 'bg-red-400' },
              { label: 'High', value: stats.highPriorityTasks, pct: stats.priorityDistribution?.HIGH, color: 'bg-orange-400' },
              { label: 'Medium', value: stats.mediumPriorityTasks, pct: stats.priorityDistribution?.MEDIUM, color: 'bg-yellow-400' },
              { label: 'Low', value: stats.lowPriorityTasks, pct: stats.priorityDistribution?.LOW, color: 'bg-emerald-400' },
            ].map(({ label, value, pct, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                <span className="text-sm text-slate-400 flex-1">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
                <span className="text-xs text-slate-500 w-12 text-right">{pct?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="glass-panel p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            Overall Progress
          </h3>
          <span className="text-2xl font-bold text-primary-400">{stats.completionRate?.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
          />
        </div>
        <p className="text-sm text-slate-500 mt-3">{stats.completedTasks} of {stats.totalTasks} tasks completed</p>
      </motion.div>
    </motion.div>
  );
}

export default TaskStats;
