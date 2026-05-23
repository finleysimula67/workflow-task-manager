import { useState } from 'react';
import { Plus, X, Calendar, Flag, FolderOpen } from 'lucide-react';

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
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-primary-500 text-white rounded-full shadow-xl border border-primary-400/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-40 active:scale-95"
        title="Quick Add Task (Ctrl+N)"
      >
        <Plus size={24} className="md:w-7 md:h-7" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/80">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-black border border-white/[0.08] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-semibold text-white">Quick Add Task</h3>
          <button type="button" onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/5 transition">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?" autoFocus
            className="w-full px-4 py-3 bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.08] transition" />

          <button type="button" onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition">
            <Plus size={16} /> Add Options
          </button>

          {showOptions && (
            <div className="space-y-4 pt-2 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm mb-2 text-slate-300">
                    <Calendar size={16} /> Due Date
                  </label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm mb-2 text-slate-300">
                    <Flag size={16} /> Priority
                  </label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm mb-2 text-slate-300">
                    <FolderOpen size={16} /> Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
                          selectedCategories.includes(cat.id)
                            ? 'text-white border-transparent'
                            : 'bg-white/5 text-slate-300 border-white/[0.06] hover:bg-white/10'
                        }`}
                        style={{ backgroundColor: selectedCategories.includes(cat.id) ? cat.color : undefined }}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-black border-t border-white/[0.06] flex gap-3">
          <button type="button" onClick={() => setIsOpen(false)}
            className="flex-1 py-3 bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition">
            Cancel
          </button>
          <button type="submit" disabled={!title.trim()}
            className="flex-1 py-3 bg-primary-500 text-white hover:bg-primary-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
