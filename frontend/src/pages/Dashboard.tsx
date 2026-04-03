import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import { authApi } from '../api/authApi';
import StatCard from '../components/StatCard';
import RecentTaskItem from '../components/RecentTaskItem';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import type { TaskStats, Task } from '../types';
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plus, Shield } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await taskApi.getTaskStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      const tasksRes = await taskApi.getAllTasks();
      if (tasksRes.success && tasksRes.data) {
        const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
        const sortedTasks = [...tasks]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
        setRecentTasks(sortedTasks);
      }
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally { 
      setLoading(false); 
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completionRate = stats?.totalTasks ? Math.round(((stats.completedTasks || 0) / stats.totalTasks) * 100) : 0;

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <EmailVerificationBanner />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{getGreeting()}</h1>
            {authApi.isAdmin() && (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-500/30 transition"
              >
                <Shield size={14} />
                Admin Panel
              </button>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what is happening with your tasks today</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95">
          <Plus size={18} /> Create Task
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} color="blue" icon={<CheckSquare size={24} />} />
        <StatCard title="In Progress" value={stats?.inProgressTasks ?? 0} color="yellow" icon={<Clock size={24} />} />
        <StatCard title="Completed" value={stats?.completedTasks ?? 0} color="green" icon={<CheckCircle2 size={24} />} />
        <StatCard title="Overdue" value={stats?.overdueTasks ?? 0} color="red" icon={<AlertTriangle size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Completion Rate</h3>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" style={{ width: completionRate + '%' }} /></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{completionRate}% complete</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Due This Week</h3>
          <span className="text-4xl font-bold text-slate-900 dark:text-white">{stats?.dueSoonTasks ?? 0}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">High Priority</h3>
          <span className="text-4xl font-bold text-slate-900 dark:text-white">{(stats?.highPriorityTasks ?? 0) + (stats?.urgentPriorityTasks ?? 0)}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Tasks</h3>
          <button onClick={() => navigate('/tasks')} className="text-sm text-blue-600 dark:text-blue-400">View All <ArrowRight size={16} /></button>
        </div>
        <div className="p-6">
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No tasks yet</p>
              <button
                onClick={() => navigate('/tasks')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create your first task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map(task => <RecentTaskItem key={task.id} task={task} onClick={() => navigate('/tasks')} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
