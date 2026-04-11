import { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { categoryApi } from '../api/categoryApi';
import FileUpload from '../components/FileUpload';
import AttachmentList from '../components/AttachmentList';
import { EmptyState, LoadingSkeleton, QuickAddTask, Pagination } from '../components/common';
import toast from 'react-hot-toast';
import type { Task, Category } from '../types';
import { Plus, Search, X, Grid, List, Calendar } from 'lucide-react';

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  const handleQuickAdd = async (title: string, options?: { dueDate?: string; priority?: string; categoryIds?: number[] }) => {
    try {
      const taskData = {
        title,
        priority: options?.priority || 'MEDIUM',
        dueDate: options?.dueDate,
        categoryIds: options?.categoryIds
      };
      const response = await taskApi.createTask(taskData);
      if (response.success) {
        toast.success('Task created!');
        loadTasks();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
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
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handleFileUploadSuccess = (newAttachment?: any) => {
    if (selectedTask && newAttachment) {
      setSelectedTask({
        ...selectedTask,
        attachments: [...(selectedTask.attachments || []), newAttachment]
      });
    }
    toast.success('File uploaded successfully!');
  };
  
  const handleAttachmentDelete = (attachmentId: number) => {
    if (selectedTask) {
      setSelectedTask({
        ...selectedTask,
        attachments: (selectedTask.attachments || []).filter((a: any) => a.id !== attachmentId)
      });
    }
    toast.success('Attachment deleted!');
  };

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

  // Pagination
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const paginatedTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">My Tasks</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your tasks efficiently</p>
          </div>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {tasks.length > 0 ? `${tasks.length} task${tasks.length !== 1 ? 's' : ''}` : 'No tasks yet'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
          >
            <Plus size={18} /> <span className="hidden xs:inline">Create Task</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {/* Category Filter */}
      {categories.length > 0 && (
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
      )}

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => { setFilter(filterOption); setSelectedCategories([]); setCurrentPage(1); }}
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

      {/* Tasks */}
      {tasks.length === 0 ? (
        searchQuery ? (
          <EmptyState type="search" searchQuery={searchQuery} />
        ) : (
          <EmptyState type="tasks" onAction={() => setShowCreateModal(true)} />
        )
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleUpdateStatus}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleUpdateStatus}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={tasks.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Quick Add FAB */}
      <QuickAddTask onAdd={handleQuickAdd} categories={categories} />

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Task</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                  autoFocus
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
                            categoryIds: categoryIds.includes(category.id) ? categoryIds.filter(id => id !== category.id) : [...categoryIds, category.id]
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                          newTask.categoryIds.includes(category.id) ? 'text-white border-transparent' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                        style={{ backgroundColor: newTask.categoryIds.includes(category.id) ? category.color : undefined }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition">
                  Create Task
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Task</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedTask(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={24} />
              </button>
            </div>

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
                            categoryIds: categoryIds.includes(category.id) ? categoryIds.filter(id => id !== category.id) : [...categoryIds, category.id]
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                          (selectedTask.categoryIds || []).includes(category.id) ? 'text-white border-transparent' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
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
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition">
                  Update Task
                </button>
                <button type="button" onClick={() => { setShowEditModal(false); setSelectedTask(null); }} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
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

// Task Card Component
function TaskCard({ task, onEdit, onDelete, onStatusChange, getPriorityColor, getStatusColor }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 p-5 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex-1 line-clamp-2">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1.5 text-slate-400 hover:text-blue-500 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      {task.categories && task.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.categories.map((category: any) => (
            <span key={category.id} className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: category.color }}>
              {category.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.overdue && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            OVERDUE
          </span>
        )}
      </div>

      {task.dueDate && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
          <Calendar size={12} />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {task.status === 'TODO' && (
        <button
          onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
          className="w-full px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm font-medium transition"
        >
          Start
        </button>
      )}
      {task.status === 'IN_PROGRESS' && (
        <button
          onClick={() => onStatusChange(task.id, 'COMPLETED')}
          className="w-full px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-sm font-medium transition"
        >
          Complete
        </button>
      )}
    </div>
  );
}

// Task List Item Component
function TaskListItem({ task, onEdit, onDelete, onStatusChange, getPriorityColor, getStatusColor }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{task.title}</h3>
          {task.overdue && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
              OVERDUE
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {task.categories && task.categories.map((cat: any) => (
            <span key={cat.id} className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: cat.color }}>
              {cat.name}
            </span>
          ))}
          {task.dueDate && (
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.status === 'TODO' && (
          <button onClick={() => onStatusChange(task.id, 'IN_PROGRESS')} className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm font-medium transition">
            Start
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button onClick={() => onStatusChange(task.id, 'COMPLETED')} className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-sm font-medium transition">
            Complete
          </button>
        )}
        <button onClick={() => onEdit(task)} className="p-2 text-slate-400 hover:text-blue-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-slate-400 hover:text-red-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Tasks;
