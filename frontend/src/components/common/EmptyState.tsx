import { ClipboardList, FolderOpen, Plus, Search, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

type EmptyStateType = 'tasks' | 'categories' | 'search' | 'calendar' | 'statistics';

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  searchQuery?: string;
}

const config = {
  tasks: {
    icon: ClipboardList,
    title: 'No tasks yet',
    description: 'Create your first task to get started with WorkFlow',
    action: 'Create Task',
    link: '/tasks',
  },
  categories: {
    icon: FolderOpen,
    title: 'No categories yet',
    description: 'Organize your tasks by creating categories',
    action: 'Create Category',
    link: '/categories',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters',
    action: null,
    link: null,
  },
  calendar: {
    icon: Calendar,
    title: 'No tasks scheduled',
    description: 'Tasks with due dates will appear here',
    action: 'Add Task',
    link: '/tasks',
  },
  statistics: {
    icon: TrendingUp,
    title: 'No statistics yet',
    description: 'Complete some tasks to see your progress',
    action: 'Create Task',
    link: '/tasks',
  },
};

export default function EmptyState({ type, onAction, searchQuery }: EmptyStateProps) {
  const { icon: Icon, title, description, action, link } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        {searchQuery ? `No tasks found for "${searchQuery}"` : description}
      </p>
      {action && (
        <div className="flex gap-3">
          {link && !onAction && (
            <Link to={link} className="glass-button-primary">
              <Plus size={20} /> {action}
            </Link>
          )}
          {onAction && (
            <button onClick={onAction} className="glass-button-primary">
              <Plus size={20} /> {action}
            </button>
          )}
          {link && onAction && (
            <Link to={link} className="glass-button-secondary">
              View All
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
