import type { Task } from '../types';
import { StatusBadge, PriorityBadge } from './ui/Badge';

interface RecentTaskItemProps {
  task: Task;
  onClick: () => void;
}

function RecentTaskItem({ task, onClick }: RecentTaskItemProps) {
  if (!task) return null;

  return (
    <div
      onClick={onClick}
      className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors truncate">
            {task.title}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
            {task.description || "No description"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
    </div>
  );
}

export default RecentTaskItem;
