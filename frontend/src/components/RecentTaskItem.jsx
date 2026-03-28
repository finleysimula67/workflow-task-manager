import React from 'react';

function RecentTaskItem({ task, onClick }) {
  if (!task) return null;

  return (
      <div
          onClick={onClick}
          className="group p-5 mb-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0f172a] hover:bg-gray-50 dark:hover:bg-white/[0.07] transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* TITLE: Pure white in dark mode is mandatory for clarity */}
            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
              {task.title}
            </h3>

            {/* DESCRIPTION: Slightly dimmed but high-contrast gray */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-1 italic">
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* STATUS BADGE: Using a glow effect for Dark Mode */}
            <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border shadow-sm ${
                task.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 dark:shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                    : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 dark:shadow-[0_0_10px_rgba(59,130,246,0.1)]'
            }`}>
            {task.status}
          </span>

            {/* PRIORITY BADGE */}
            <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border shadow-sm ${
                task.priority === 'HIGH'
                    ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                    : 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/30'
            }`}>
            {task.priority}
          </span>
          </div>
        </div>
      </div>
  );
}

export default RecentTaskItem;