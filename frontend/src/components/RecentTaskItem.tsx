import type { Task } from '../types';

interface RecentTaskItemProps {
  task: Task;
  onClick: () => void;
}

function RecentTaskItem({ task, onClick }: RecentTaskItemProps) {
  if (!task) return null;

  const isCompleted = task.status === 'COMPLETED';
  const isInProgress = task.status === 'IN_PROGRESS';
  const isUrgent = task.priority === 'URGENT';
  const isHigh = task.priority === 'HIGH';
  const isLow = task.priority === 'LOW';

  const statusClasses = isCompleted
    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
    : isInProgress
    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';

  const priorityClasses = isUrgent
    ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
    : isHigh
    ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
    : isLow
    ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
    : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30';

  const formatStatus = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <div
      onClick={onClick}
      className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
            {task.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1 italic">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border shadow-sm ${statusClasses}`}>
            {formatStatus(task.status)}
          </span>

          <span className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border shadow-sm ${priorityClasses}`}>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RecentTaskItem;
