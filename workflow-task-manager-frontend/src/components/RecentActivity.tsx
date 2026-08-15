import { useState, useEffect } from 'react';
import { activityApi, type Activity } from '../api/activityApi';
import { Clock, Activity as ActivityIcon, Loader2, Plus, Pencil, ArrowRightLeft, Trash2, LogIn, UserPlus } from 'lucide-react';

const actionConfig: Record<string, { icon: typeof Plus; color: string }> = {
  CREATED: { icon: Plus, color: 'text-emerald-400' },
  UPDATED: { icon: Pencil, color: 'text-primary-400' },
  STATUS_CHANGED: { icon: ArrowRightLeft, color: 'text-sky-400' },
  DELETED: { icon: Trash2, color: 'text-red-400' },
  LOGIN: { icon: LogIn, color: 'text-blue-400' },
  REGISTERED: { icon: UserPlus, color: 'text-emerald-400' },
};

function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadActivities(); }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await activityApi.getRecent(10);
      if (res.success) setActivities(res.data);
    } catch {} finally { setLoading(false); }
  };

  const getActionConfig = (action: string) => {
    return actionConfig[action] || { icon: Plus };
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ActivityIcon size={18} className="text-slate-400" />
          <h3 className="font-semibold text-white">Recent Activity</h3>
        </div>
        <Clock size={16} className="text-slate-500" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500 text-sm">No recent activity</div>
        ) : (
          activities.map((activity) => {
            const cfg = getActionConfig(activity.action);
            const Icon = cfg.icon;
            return (
              <div key={activity.id} className="px-6 py-3.5 flex items-start gap-3 hover:bg-white/[0.02] transition">
                <div className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] mt-0.5">
                  <Icon size={14} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-400">{activity.summary}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{formatTime(activity.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentActivity;
