import { useState } from 'react';
import { Plus, X, Calendar, Flag, FolderOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface QuickAddTaskProps {
  onAdd: (title: string, data?: { dueDate?: string; priority?: string; categoryIds?: number[] }) => void;
  categories?: { id: number; name: string; color: string }[];
}

export default function QuickAddTask({ onAdd, categories = [] }: QuickAddTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title.trim(), {
      dueDate: dueDate || undefined,
      priority,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    });

    setTitle('');
    setDueDate('');
    setPriority('MEDIUM');
    setSelectedCategories([]);
    setShowOptions(false);
    setIsOpen(false);
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-xl shadow-blue-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 z-40 active:scale-95"
        title="Quick Add Task (Ctrl+N)"
      >
        <Plus size={24} className="md:w-7 md:h-7" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-lg ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Quick Add Task
          </h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition`}
          >
            <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            } focus:ring-2 focus:ring-blue-500 outline-none transition`}
          />

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-2 text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            } hover:text-blue-500 transition`}
          >
            <Plus size={16} />
            Add Options
          </button>

          {showOptions && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`flex items-center gap-2 text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Calendar size={16} />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    } focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Flag size={16} />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof priority)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    } focus:ring-2 focus:ring-blue-500 outline-none`}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className={`flex items-center gap-2 text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <FolderOpen size={16} />
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          selectedCategories.includes(cat.id)
                            ? 'ring-2 ring-blue-500'
                            : ''
                        }`}
                        style={{ backgroundColor: cat.color + '20', color: cat.color }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 flex gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`flex-1 py-3 rounded-xl font-medium ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            } transition`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
