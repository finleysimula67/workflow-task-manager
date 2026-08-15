import { useState, useEffect } from 'react';
import { activityApi, type Activity } from '../api/activityApi';
import { Pagination } from '../components/common';
import { Activity as ActivityIcon, Loader2, Plus, Pencil, ArrowRightLeft, Trash2, LogIn, UserPlus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;

const actionConfig: Record<string, { icon: typeof Plus; color: string }> = {
  CREATED: { icon: Plus, color: 'text-emerald-400' },
  UPDATED: { icon: Pencil, color: 'text-primary-400' },
  STATUS_CHANGED: { icon: ArrowRightLeft, color: 'text-sky-400' },
  DELETED: { icon: Trash2, color: 'text-red-400' },
  LOGIN: { icon: LogIn, color: 'text-blue-400' },
  REGISTERED: { icon: UserPlus, color: 'text-emerald-400' },
};

function ActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => { loadActivities(currentPage); }, [currentPage]);

  const loadActivities = async (page = 1) => {
    try {
      setLoading(true);
      const res = await activityApi.getAll(page - 1, PAGE_SIZE);
      if (res.success) {
        setActivities(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalElements || 0);
      }
    } catch { toast.error('Failed to load activity log'); }
    finally { setLoading(false); }
  };

  const getActionConfig = (action: string) =>
    actionConfig[action] || { icon: ActivityIcon, color: 'text-slate-400' };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {totalItems > 0 ? `${totalItems} activit${totalItems !== 1 ? 'ies' : 'y'} recorded` : 'Your recent actions'}
          </p>
        </div>
        <Clock size={18} className="text-slate-500" />
      </div>

      {loading ? (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="glass-panel p-6">
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center mb-6">
              <ActivityIcon className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No activity yet</h3>
            <p className="text-slate-400 max-w-sm">
              Actions you take across the app will show up here
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="glass-panel overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-2">
              <ActivityIcon size={18} className="text-slate-400" />
              <h3 className="font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {activities.map((activity) => {
                const cfg = getActionConfig(activity.action);
                const Icon = cfg.icon;
                return (
                  <div key={activity.id} className="px-6 py-4 flex items-start gap-3 hover:bg-white/[0.02] transition">
                    <div className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] mt-0.5 shrink-0">
                      <Icon size={14} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300">{activity.summary}</p>
                      {activity.details && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{activity.details}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-1">{formatTime(activity.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={PAGE_SIZE}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ActivityLog;
