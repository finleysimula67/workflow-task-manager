import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: 'blue' | 'purple' | 'yellow' | 'green' | 'red';
}

function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className={`text-3xl font-bold ${
            color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
            color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
            color === 'green' ? 'text-green-600 dark:text-green-400' :
            color === 'red' ? 'text-red-600 dark:text-red-400' :
            'text-blue-600 dark:text-blue-400'
          }`}>
            {value ?? 0}
          </p>
        </div>
        <div className={`p-3 rounded-xl transition-all ${
          color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/20' :
          color === 'purple' ? 'bg-purple-100 dark:bg-purple-500/20' :
          color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
          color === 'green' ? 'bg-green-100 dark:bg-green-500/20' :
          color === 'red' ? 'bg-red-100 dark:bg-red-500/20' :
          'bg-blue-100 dark:bg-blue-500/20'
        }`}>
          <div className={`w-6 h-6 flex items-center justify-center ${
            color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
            color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
            color === 'green' ? 'text-green-600 dark:text-green-400' :
            color === 'red' ? 'text-red-600 dark:text-red-400' :
            'text-blue-600 dark:text-blue-400'
          }`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
