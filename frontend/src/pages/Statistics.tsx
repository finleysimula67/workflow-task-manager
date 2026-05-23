import TaskStats from '../components/TaskStats';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

function Statistics() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Task Statistics</h1>
          <p className="text-slate-500 mt-1 text-sm">Overview of your task performance</p>
        </div>
        <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <BarChart3 size={20} className="text-primary-400" />
        </div>
      </div>
      <TaskStats />
    </motion.div>
  );
}

export default Statistics;
