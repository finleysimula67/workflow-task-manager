import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import { categoryApi } from '../api/categoryApi';
import FileUpload from '../components/FileUpload';
import AttachmentList from '../components/AttachmentList';
import toast from 'react-hot-toast';
import type { Task, Category } from '../types';
import { Plus, Search, X } from 'lucide-react';

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    categoryIds: [] as number[]
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filter, selectedCategories]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch {
      // Silent fail
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedCategories.length > 0) {
        response = await taskApi.getTasksByCategories(selectedCategories);
      } else if (filter === 'ALL') {
        response = await taskApi.getAllTasks();
      } else if (filter === 'OVERDUE') {
        response = await taskApi.getOverdueTasks();
      } else {
        response = await taskApi.getTasksByStatus(filter);
      }
      if (response.success) {
        setTasks(response.data);
      }
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTasks();
      return;
    }
    try {
      setLoading(true);
      const response = await taskApi.searchTasks(searchQuery);
      if (response.success) {
        setTasks(response.data);
        toast.success(`Found ${response.data.length} task(s)`);
      }
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    try {
      const response = await taskApi.createTask(newTask);
      if (response.success) {
        toast.success('Task created successfully!');
        setShowCreateModal(false);
        setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '', categoryIds: [] });
        loadTasks();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await taskApi.updateTaskStatus(taskId, newStatus);
      if (response.success) {
        toast.success('Task status updated!');
        loadTasks();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await taskApi.deleteTask(taskId);
      if (response.success) {
        toast.success('Task deleted successfully!');
        loadTasks();
      }
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask({
      ...task,
      categoryIds: task.categories ? task.categories.map(c => c.id) : []
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await taskApi.updateTask(selectedTask!.id, selectedTask!);
      if (response.success) {
        toast.success('Task updated successfully!');
        setShowEditModal(false);
        setSelectedTask(null);
        loadTasks();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
        prev.includes(categoryId)
            ? prev.filter(id => id !== categoryId)
            : [...prev, categoryId]
    );
  };

  const handleFileUploadSuccess = () => loadTasks();
  const handleAttachmentDelete = () => loadTasks();

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: 'bg-red-500/20 text-red-400 border border-red-500/30',
      HIGH: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      LOW: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600'
    };
    return colors[priority] || colors.LOW;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      IN_PROGRESS: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      COMPLETED: 'bg-green-500/20 text-green-400 border border-green-500/30',
      ARCHIVED: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600'
    };
    return colors[status] || colors.ARCHIVED;
  };

  if (loading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">My Tasks</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your tasks efficiently</p>
          </div>
          <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>
          <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
          >
            Search
          </button>
          {searchQuery && (
              <button
                  onClick={() => { setSearchQuery(''); loadTasks(); }}
                  className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
          )}
        </div>

        {categories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Filter by Category:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                            selectedCategories.includes(category.id)
                                ? 'text-white border-transparent'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        style={{ backgroundColor: selectedCategories.includes(category.id) ? category.color : undefined }}
                    >
                      {category.name}
                    </button>
                ))}
              </div>
            </div>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2">
          {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((filterOption) => (
              <button
                  key={filterOption}
                  onClick={() => { setFilter(filterOption); setSelectedCategories([]); }}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition text-sm ${
                      filter === filterOption
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {filterOption.replace('_', ' ')}
              </button>
          ))}
        </div>

        {tasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No tasks found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{searchQuery ? 'Try a different search term' : 'Get started by creating your first task!'}</p>
              {!searchQuery && (
                  <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                  >
                    Create Task
                  </button>
              )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 p-6 group">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex-1">{task.title}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditTask(task)} className="p-1.5 text-slate-400 hover:text-blue-500 transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {task.description && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                    )}

                    {task.categories && task.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {task.categories.map((category) => (
                              <span key={category.id} className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: category.color }}>
                                {category.name}
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
                      {task.overdue && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            OVERDUE
                          </span>
                      )}
                    </div>

                    {task.dueDate && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                          <span className="font-medium">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    )}

                    {task.attachments && task.attachments.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span>{task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                      {task.status === 'TODO' && (
                          <button
                              onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                              className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm font-medium transition"
                          >
                            Start
                          </button>
                      )}
                      {task.status === 'IN_PROGRESS' && (
                          <button
                              onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                              className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-sm font-medium transition"
                          >
                            Complete
                          </button>
                      )}
                      {task.status === 'COMPLETED' && (
                          <button
                              onClick={() => handleUpdateStatus(task.id, 'ARCHIVED')}
                              className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium transition"
                          >
                            Archive
                          </button>
                      )}
                    </div>
                  </div>
              ))}
            </div>
        )}

        {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create New Task</h2>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                      <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                      <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>

                  {categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                              <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => {
                                    const categoryIds = newTask.categoryIds;
                                    setNewTask({
                                      ...newTask,
                                      categoryIds: categoryIds.includes(category.id)
                                          ? categoryIds.filter(id => id !== category.id)
                                          : [...categoryIds, category.id]
                                    });
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                                      newTask.categoryIds.includes(category.id)
                                          ? 'text-white border-transparent'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                  style={{ backgroundColor: newTask.categoryIds.includes(category.id) ? category.color : undefined }}
                              >
                                {category.name}
                              </button>
                          ))}
                        </div>
                      </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                    >
                      Create Task
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {showEditModal && selectedTask && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Task</h2>

                <form onSubmit={handleUpdateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={selectedTask.title}
                        onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea
                        value={selectedTask.description || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                      <select
                          value={selectedTask.status}
                          onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                      <select
                          value={selectedTask.priority}
                          onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                    <input
                        type="date"
                        value={selectedTask.dueDate || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  {categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                              <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => {
                                    const categoryIds = selectedTask.categoryIds || [];
                                    setSelectedTask({
                                      ...selectedTask,
                                      categoryIds: categoryIds.includes(category.id)
                                          ? categoryIds.filter(id => id !== category.id)
                                          : [...categoryIds, category.id]
                                    });
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                                      (selectedTask.categoryIds || []).includes(category.id)
                                          ? 'text-white border-transparent'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                  style={{ backgroundColor: (selectedTask.categoryIds || []).includes(category.id) ? category.color : undefined }}
                              >
                                {category.name}
                              </button>
                          ))}
                        </div>
                      </div>
                  )}

                  <FileUpload taskId={selectedTask.id} onUploadSuccess={handleFileUploadSuccess} />
                  <AttachmentList attachments={selectedTask.attachments} onDelete={handleAttachmentDelete} />

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                    >
                      Update Task
                    </button>
                    <button
                        type="button"
                        onClick={() => { setShowEditModal(false); setSelectedTask(null); }}
                        className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}

export default Tasks;
