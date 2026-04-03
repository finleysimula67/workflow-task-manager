import TaskStats from '../components/TaskStats';
import { BarChart3 } from 'lucide-react';

function Statistics() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Task Statistics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your task performance</p>
        </div>

        <TaskStats />
      </div>
  );
}

export default Statistics;
