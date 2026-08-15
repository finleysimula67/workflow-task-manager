import type { ReactElement } from 'react';
import type { Task } from '../types';
import { Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge, PriorityBadge } from './ui/Badge';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onUpdateStatus: (taskId: number, status: string) => void;
}

function TaskCard({ task, onEdit, onDelete, onUpdateStatus }: TaskCardProps): ReactElement {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel-hover p-5 group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-white flex-1">{task.title}</h3>
        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition">
            <Edit3 size={15} />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {task.categories && task.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.categories.map((cat: any) => (
            <span
              key={cat.id}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.overdue && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border bg-red-500/10 text-red-400 border-red-500/30">
            OVERDUE
          </span>
        )}
      </div>

      {task.dueDate && (
        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
          <span className="font-medium text-slate-400">Due:</span>
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      {task.attachments && task.attachments.length > 0 && (
        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          {task.attachments.length} file{task.attachments.length !== 1 ? 's' : ''}
        </p>
      )}

      <div className="flex gap-2 mt-auto">
        {task.status === 'TODO' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
            className="flex-1 px-3 py-2.5 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/30 hover:bg-primary-500/20 text-sm font-medium transition"
          >
            Start
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
            className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-sm font-medium transition"
          >
            Complete
          </button>
        )}
        {task.status === 'COMPLETED' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'ARCHIVED')}
            className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 text-sm font-medium transition"
          >
            Archive
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default TaskCard;
