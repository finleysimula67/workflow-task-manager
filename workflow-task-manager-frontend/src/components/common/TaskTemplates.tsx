import { useState } from 'react';
import { X, Plus, Bookmark, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  categoryIds?: number[];
}

interface TaskTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  templates: TaskTemplate[];
  onSelect: (template: TaskTemplate) => void;
  onSaveTemplate?: (name: string, data: Partial<TaskTemplate>) => void;
  onDeleteTemplate?: (id: string) => void;
  categories?: { id: number; name: string; color: string }[];
}

const defaultTemplates: TaskTemplate[] = [
  { id: '1', name: 'Bug Fix', title: '[BUG] ', description: 'Report and fix a bug', priority: 'HIGH' },
  { id: '2', name: 'Feature', title: '[FEATURE] ', description: 'Implement a new feature', priority: 'MEDIUM' },
  { id: '3', name: 'Documentation', title: 'Update docs: ', description: 'Document a feature or process', priority: 'LOW' },
  { id: '4', name: 'Meeting Prep', title: 'Meeting prep: ', description: 'Prepare for an upcoming meeting', priority: 'MEDIUM' },
  { id: '5', name: 'Code Review', title: 'Review PR: ', description: 'Review pull request', priority: 'MEDIUM' },
];

export default function TaskTemplates({
  isOpen,
  onClose,
  templates,
  onSelect,
  onSaveTemplate,
  onDeleteTemplate,
  categories = [],
}: TaskTemplatesProps) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    onSaveTemplate?.(newTemplateName.trim(), {
      title: '',
      priority: 'MEDIUM',
    });
    setNewTemplateName('');
    setShowSaveForm(false);
    toast.success('Template saved!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md max-h-[80vh] overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Bookmark className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Task Templates
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition`}
          >
            <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {templates.length === 0 && defaultTemplates.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No templates saved yet
              </p>
            </div>
          ) : (
            <>
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelect(template);
                      onClose();
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {template.name}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        template.priority === 'URGENT' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        template.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        template.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                      }`}>
                        {template.priority}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {template.title}
                      {template.description && <span className="ml-1">- {template.description}</span>}
                    </p>
                  </button>
                  {onDeleteTemplate && (
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition ${
                        isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              {defaultTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${
                    isDark
                      ? 'bg-slate-700/30 border-slate-700 border-dashed'
                      : 'bg-slate-50 border-slate-200 border-dashed'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelect(template);
                      onClose();
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {template.name}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        template.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                      }`}>
                        Default
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {template.description}
                    </p>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {onSaveTemplate && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {showSaveForm ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Template name..."
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveForm(false);
                    setNewTemplateName('');
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                  } transition`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveForm(true)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed transition ${
                  isDark
                    ? 'border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400'
                    : 'border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                <Plus size={20} />
                Save Current Task as Template
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
