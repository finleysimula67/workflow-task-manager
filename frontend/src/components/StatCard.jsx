import React from 'react';

function StatCard({ title, value, icon, color = 'blue' }) {
  // Mapping for the icon background and text colors
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
  };

  const textColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400'
  };

  return (
      <div className="bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/10 p-6 rounded-2xl shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            {/* TITLE: Small and gray to provide hierarchy */}
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              {title}
            </p>

            {/* VALUE: Large, bold, and high-contrast */}
            <p className={`text-3xl font-black ${textColors[color]}`}>
              {value || 0}
            </p>
          </div>

          {/* ICON CONTAINER: Tinted glass effect */}
          <div className={`p-3 rounded-xl transition-all shadow-inner ${colors[color]}`}>
            <div className="w-6 h-6 flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
      </div>
  );
}

export default StatCard;