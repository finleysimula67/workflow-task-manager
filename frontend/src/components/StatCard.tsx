import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  accent?: string;
}

function StatCard({ title, value, icon, accent = 'primary' }: StatCardProps) {
  const accentMap: Record<string, string> = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-panel p-5"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value ?? 0}</p>
        </div>
        <div className={`p-3 rounded-xl border ${accentMap[accent] || accentMap.primary}`}>
          <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
