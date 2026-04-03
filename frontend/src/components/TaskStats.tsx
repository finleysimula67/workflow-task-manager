import { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import toast from 'react-hot-toast';
import type { TaskStats as TaskStatsType } from '../types';
import { CheckSquare, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

function TaskStats() {
  const [stats, setStats] = useState<TaskStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTaskStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalTasks}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-500/20 rounded-full p-3">
              <CheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Active Tasks</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.inProgressTasks}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-500/20 rounded-full p-3">
              <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedTasks}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {stats.completionRate?.toFixed(1)}% completion rate
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-500/20 rounded-full p-3">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.overdueTasks}</p>
              {(stats.dueSoonTasks ?? 0) > 0 && (
                <p className="text-sm text-orange-500 mt-1">
                  {stats.dueSoonTasks} due soon
                </p>
              )}
            </div>
            <div className="bg-red-100 dark:bg-red-500/20 rounded-full p-3">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tasks by Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">To Do</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.todoTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.statusDistribution?.TODO?.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">In Progress</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.inProgressTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.statusDistribution?.IN_PROGRESS?.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">Completed</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.completedTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.statusDistribution?.COMPLETED?.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">Archived</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.archivedTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.statusDistribution?.ARCHIVED?.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tasks by Priority</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">Urgent</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.urgentPriorityTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.priorityDistribution?.URGENT?.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">High</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.highPriorityTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.priorityDistribution?.HIGH?.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">Medium</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.mediumPriorityTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.priorityDistribution?.MEDIUM?.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">Low</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900 dark:text-white">{stats.lowPriorityTasks}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  ({stats.priorityDistribution?.LOW?.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Overall Progress</h3>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.completionRate?.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
          <div
            className="bg-green-600 dark:bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {stats.completedTasks} of {stats.totalTasks} tasks completed
        </p>
      </div>
    </div>
  );
}

export default TaskStats;
