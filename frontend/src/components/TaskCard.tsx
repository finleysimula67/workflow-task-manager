import type { Task } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onUpdateStatus: (taskId: number, status: string) => void;
}

function TaskCard({ task, onEdit, onDelete, onUpdateStatus }: TaskCardProps) {
  const getStatusColor = (status: string): string => {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string): string => {
    return PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>}

      {task.categories && task.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.categories.map((cat) => (
            <span key={cat.id} className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: cat.color }}>
              {cat.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.overdue && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">OVERDUE</span>}
      </div>

      {task.dueDate && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {task.attachments && task.attachments.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span>{task.attachments.length} file{task.attachments.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex gap-2">
        {task.status === 'TODO' && (
          <button onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')} className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium transition">
            Start
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button onClick={() => onUpdateStatus(task.id, 'COMPLETED')} className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium transition">
            Complete
          </button>
        )}
        {task.status === 'COMPLETED' && (
          <button onClick={() => onUpdateStatus(task.id, 'ARCHIVED')} className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition">
            Archive
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
