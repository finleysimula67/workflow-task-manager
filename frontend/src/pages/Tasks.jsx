import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import { categoryApi } from '../api/categoryApi';
import FileUpload from '../components/FileUpload';
import AttachmentList from '../components/AttachmentList';
import toast from 'react-hot-toast';

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    categoryIds: []
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
    } catch (error) {
      console.error('Error loading categories:', error);
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
    } catch (error) {
      console.error('Error loading tasks:', error);
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
    } catch (error) {
      console.error('Error searching tasks:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
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
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await taskApi.updateTaskStatus(taskId, newStatus);
      if (response.success) {
        toast.success('Task status updated!');
        loadTasks();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await taskApi.deleteTask(taskId);
      if (response.success) {
        toast.success('Task deleted successfully!');
        loadTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask({
      ...task,
      categoryIds: task.categories ? task.categories.map(c => c.id) : []
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskApi.updateTask(selectedTask.id, selectedTask);
      if (response.success) {
        toast.success('Task updated successfully!');
        setShowEditModal(false);
        setSelectedTask(null);
        loadTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.message || 'Failed to update task');
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
        prev.includes(categoryId)
            ? prev.filter(id => id !== categoryId)
            : [...prev, categoryId]
    );
  };

  const handleFileUploadSuccess = () => loadTasks();
  const handleAttachmentDelete = () => loadTasks();

  const getPriorityColor = (priority) => {
    const colors = {
      URGENT: 'bg-red-500/20 text-red-400 border border-red-500/30',
      HIGH: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      LOW: 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
    };
    return colors[priority] || 'bg-slate-700/50 text-slate-400 border border-slate-600/30';
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      IN_PROGRESS: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      COMPLETED: 'bg-green-500/20 text-green-400 border border-green-500/30',
      ARCHIVED: 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
    };
    return colors[status] || 'bg-slate-700/50 text-slate-400 border border-slate-600/30';
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#030712] text-slate-200">

        {/* Background Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Header */}
        <header className="bg-[#030712]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">My Tasks</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage your tasks efficiently</p>
            </div>
            <div className="flex gap-3">
              <button
                  onClick={() => navigate('/categories')}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-600/30 transition font-medium text-sm"
              >
                Categories
              </button>
              <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-xl hover:bg-slate-800 transition font-medium text-sm"
              >
                Dashboard
              </button>
              <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition font-semibold text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                + Create Task
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search tasks..."
                  className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
              />
              <button
                  onClick={handleSearch}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition font-semibold text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                Search
              </button>
              {searchQuery && (
                  <button
                      onClick={() => { setSearchQuery(''); loadTasks(); }}
                      className="px-6 py-2.5 bg-slate-900/50 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition text-sm"
                  >
                    Clear
                  </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Filter by Category:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                      <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                              selectedCategories.includes(category.id)
                                  ? 'text-white border-transparent'
                                  : 'bg-slate-900/50 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                          style={{ backgroundColor: selectedCategories.includes(category.id) ? category.color : undefined }}
                      >
                        {category.name}
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* Status Filters */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((filterOption) => (
                <button
                    key={filterOption}
                    onClick={() => { setFilter(filterOption); setSelectedCategories([]); }}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition text-sm ${
                        filter === filterOption
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                            : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                >
                  {filterOption.replace('_', ' ')}
                </button>
            ))}
          </div>

          {/* Tasks Grid */}
          {tasks.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-sm">
                <svg className="mx-auto h-16 w-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                <p className="text-slate-400 mb-6">{searchQuery ? 'Try a different search term' : 'Get started by creating your first task!'}</p>
                {!searchQuery && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                      Create Task
                    </button>
                )}
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all duration-300 p-6 backdrop-blur-sm group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white flex-1">{task.title}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditTask(task)} className="text-slate-500 hover:text-blue-400 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-slate-500 hover:text-red-400 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {task.description && (
                          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                      )}

                      {task.categories?.length > 0 && (
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
                          <div className="text-sm text-slate-400 mb-4">
                            <span className="font-medium text-slate-300">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                      )}

                      {task.attachments?.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
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
                                className="flex-1 px-3 py-2 bg-slate-700/50 text-slate-400 border border-slate-600/30 rounded-lg hover:bg-slate-700 text-sm font-medium transition"
                            >
                              Archive
                            </button>
                        )}
                      </div>
                    </div>
                ))}
              </div>
          )}
        </main>

        {/* CREATE MODAL */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-[#0f1629] border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                      <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                      <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  {categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                              <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => {
                                    const categoryIds = newTask.categoryIds || [];
                                    setNewTask({
                                      ...newTask,
                                      categoryIds: categoryIds.includes(category.id)
                                          ? categoryIds.filter(id => id !== category.id)
                                          : [...categoryIds, category.id]
                                    });
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                                      (newTask.categoryIds || []).includes(category.id)
                                          ? 'text-white border-transparent'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                  }`}
                                  style={{ backgroundColor: (newTask.categoryIds || []).includes(category.id) ? category.color : undefined }}
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
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                      Create Task
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && selectedTask && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-[#0f1629] border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Task</h2>

                <form onSubmit={handleUpdateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                    <input
                        type="text"
                        value={selectedTask.title}
                        onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                        value={selectedTask.description || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                      <select
                          value={selectedTask.status}
                          onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                      <select
                          value={selectedTask.priority}
                          onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                    <input
                        type="date"
                        value={selectedTask.dueDate || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                  </div>

                  {categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Categories</label>
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
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                  }`}
                                  style={{ backgroundColor: (selectedTask.categoryIds || []).includes(category.id) ? category.color : undefined }}
                              >
                                {category.name}
                              </button>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* FILE UPLOAD - ONLY IN EDIT MODAL */}
                  <FileUpload taskId={selectedTask.id} onUploadSuccess={handleFileUploadSuccess} />

                  {/* ATTACHMENTS LIST - ONLY IN EDIT MODAL */}
                  <AttachmentList attachments={selectedTask.attachments} onDelete={handleAttachmentDelete} />

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                      Update Task
                    </button>
                    <button
                        type="button"
                        onClick={() => { setShowEditModal(false); setSelectedTask(null); }}
                        className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 transition"
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