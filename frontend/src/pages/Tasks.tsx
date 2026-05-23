import { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { categoryApi } from '../api/categoryApi';
import FileUpload from '../components/FileUpload';
import AttachmentList from '../components/AttachmentList';
import { EmptyState, LoadingSkeleton, QuickAddTask, Pagination, TaskTemplates } from '../components/common';
import toast from 'react-hot-toast';
import type { Task, Category } from '../types';
import { Plus, Search, X, Grid, List, Calendar, Download, Bookmark, GripVertical } from 'lucide-react';
import { exportTasksCSV, exportTasksPDF } from '../utils/export';
import { taskTemplateApi } from '../api/taskTemplateApi';
import type { TaskTemplate as ApiTaskTemplate } from '../api/taskTemplateApi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<ApiTaskTemplate[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    categoryIds: [] as number[]
  });
  const itemsPerPage = 12;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { loadCategories(); loadTemplates(); }, []);

  useEffect(() => { loadTasks(); }, [filter, priorityFilter, selectedCategories, searchQuery, sortBy, sortDir]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      if (response.success) setCategories(response.data);
    } catch {}
  };

  const loadTemplates = async () => {
    try {
      const res = await taskTemplateApi.getTemplates();
      if (res.success) setTemplates(res.data);
    } catch {}
  };

  const handleSelectTemplate = (template: any) => {
    setNewTask({
      title: template.title || template.titlePrefix || '',
      description: template.description || '',
      priority: template.priority || 'MEDIUM',
      status: 'TODO',
      dueDate: '',
      categoryIds: [],
    });
    setShowCreateModal(true);
  };

  const handleSaveTemplate = async (name: string) => {
    try {
      await taskTemplateApi.createTemplate({ name, titlePrefix: newTask.title, description: newTask.description, priority: newTask.priority });
      loadTemplates();
      toast.success('Template saved!');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save template'); }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await taskTemplateApi.deleteTemplate(Number(id));
      loadTemplates();
    } catch { toast.error('Failed to delete template'); }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = paginatedTasks.findIndex(t => t.id === active.id);
    const newIndex = paginatedTasks.findIndex(t => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(paginatedTasks, oldIndex, newIndex);
    const newTasks = [...tasks];
    const startIdx = (currentPage - 1) * itemsPerPage;
    for (let i = 0; i < reordered.length; i++) {
      newTasks[startIdx + i] = reordered[i];
    }
    setTasks(newTasks);
    const order = reordered.map((t, i) => ({ id: t.id, position: startIdx + i }));
    taskApi.reorderTasks(order).catch(() => loadTasks());
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params: any = { sortBy, sortDirection: sortDir, page: 0, size: 100 };
      if (filter !== 'ALL' && filter !== 'OVERDUE') params.status = filter;
      if (priorityFilter !== 'ALL') params.priority = priorityFilter;
      if (selectedCategories.length > 0) params.categoryIds = selectedCategories;
      if (searchQuery.trim()) params.searchQuery = searchQuery;

      let response;
      if (filter === 'OVERDUE') {
        response = await taskApi.getOverdueTasks();
        if (response.success) setTasks(response.data);
      } else {
        response = await taskApi.filterTasks(params);
        if (response.success && response.data) setTasks(response.data.content || []);
      }
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) { loadTasks(); return; }
    try {
      setLoading(true);
      const response = await taskApi.searchTasks(searchQuery);
      if (response.success) setTasks(response.data);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const sanitizeTaskPayload = (data: any) => {
    const payload: any = {
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      dueDate: data.dueDate || null,
      categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
    };
    if (data.status) payload.status = data.status;
    return payload;
  };

  const handleQuickAdd = async (title: string, options?: { dueDate?: string; priority?: string; categoryIds?: number[] }) => {
    try {
      const response = await taskApi.createTask(
        sanitizeTaskPayload({ title, priority: options?.priority || 'MEDIUM', dueDate: options?.dueDate || null, categoryIds: options?.categoryIds })
      );
      if (response.success) { toast.success('Task created!'); loadTasks(); }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to create task'); }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) { toast.error('Please enter a task title'); return; }
    try {
      const response = await taskApi.createTask(sanitizeTaskPayload(newTask));
      if (response.success) {
        toast.success('Task created successfully!');
        setShowCreateModal(false);
        setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '', categoryIds: [] });
        loadTasks();
      }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to create task'); }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await taskApi.updateTaskStatus(taskId, newStatus);
      if (response.success) { toast.success('Task status updated!'); loadTasks(); }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update status'); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await taskApi.deleteTask(taskId);
      if (response.success) { toast.success('Task deleted successfully!'); loadTasks(); }
    } catch { toast.error('Failed to delete task'); }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      categoryIds: task.categories ? task.categories.map(c => c.id) : [],
    } as any);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = sanitizeTaskPayload({
        title: selectedTask!.title,
        description: selectedTask!.description,
        priority: selectedTask!.priority,
        status: selectedTask!.status,
        dueDate: selectedTask!.dueDate,
        categoryIds: selectedTask!.categoryIds,
      });
      const response = await taskApi.updateTask(selectedTask!.id, payload);
      if (response.success) { toast.success('Task updated successfully!'); setShowEditModal(false); setSelectedTask(null); loadTasks(); }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update task'); }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
    setCurrentPage(1);
  };

  const handleFileUploadSuccess = (newAttachment?: any) => {
    if (selectedTask && newAttachment) setSelectedTask({ ...selectedTask, attachments: [...(selectedTask.attachments || []), newAttachment] });
    toast.success('File uploaded successfully!');
  };

  const handleAttachmentDelete = (attachmentId: number) => {
    if (selectedTask) setSelectedTask({ ...selectedTask, attachments: (selectedTask.attachments || []).filter((a: any) => a.id !== attachmentId) });
    toast.success('Attachment deleted!');
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: 'bg-white/10 text-white border border-white/[0.08]',
      HIGH: 'bg-white/5 text-red-400 border border-white/[0.06]',
      MEDIUM: 'bg-white/5 text-slate-300 border border-white/[0.06]',
      LOW: 'bg-white/5 text-slate-500 border border-white/[0.06]'
    };
    return colors[priority] || colors.LOW;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: 'bg-white/5 text-slate-300 border border-white/[0.06]',
      IN_PROGRESS: 'bg-white/10 text-white border border-white/[0.08]',
      COMPLETED: 'bg-white/5 text-slate-400 border border-white/[0.06]',
      ARCHIVED: 'bg-white/5 text-slate-500 border border-white/[0.06]'
    };
    return colors[status] || colors.ARCHIVED;
  };

  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const paginatedTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-slate-400 mt-1">Manage your tasks efficiently</p>
          </div>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">My Tasks</h1>
          <p className="text-slate-400 mt-1">
            {tasks.length > 0 ? `${tasks.length} task${tasks.length !== 1 ? 's' : ''}` : 'No tasks yet'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="glass-button-secondary flex items-center gap-1.5 text-sm">
              Sort: {sortBy === 'createdAt' ? 'Created' : sortBy === 'dueDate' ? 'Due Date' : 'Priority'} {sortDir === 'asc' ? '↑' : '↓'}
            </button>
            {showSortDropdown && (
              <>
                <div className="absolute right-0 top-full mt-1 w-44 bg-black border border-white/[0.08] rounded-xl overflow-hidden shadow-xl z-20">
                  {[
                    { label: 'Created ↑', sortBy: 'createdAt', sortDir: 'asc' as const },
                    { label: 'Created ↓', sortBy: 'createdAt', sortDir: 'desc' as const },
                    { label: 'Due Date ↑', sortBy: 'dueDate', sortDir: 'asc' as const },
                    { label: 'Due Date ↓', sortBy: 'dueDate', sortDir: 'desc' as const },
                    { label: 'Priority ↑', sortBy: 'priority', sortDir: 'asc' as const },
                    { label: 'Priority ↓', sortBy: 'priority', sortDir: 'desc' as const },
                  ].map(opt => (
                    <button key={`${opt.sortBy}-${opt.sortDir}`} onClick={() => { setSortBy(opt.sortBy); setSortDir(opt.sortDir); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left ${sortBy === opt.sortBy && sortDir === opt.sortDir ? 'text-primary-400 bg-white/5' : 'text-slate-300 hover:bg-white/5'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              </>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
              <List size={18} />
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="glass-button-secondary flex items-center gap-1.5">
              <Download size={16} /> Export
            </button>
            {showExportDropdown && (
              <>
                <div className="absolute right-0 top-full mt-1 w-36 bg-black border border-white/[0.08] rounded-xl overflow-hidden shadow-xl z-20">
                  <button onClick={() => { exportTasksCSV(tasks); setShowExportDropdown(false); }} className="w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 text-left">Export CSV</button>
                  <button onClick={() => { exportTasksPDF(tasks); setShowExportDropdown(false); }} className="w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 text-left">Export PDF</button>
                </div>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportDropdown(false)} />
              </>
            )}
          </div>
          <button onClick={() => setShowTemplates(true)} className="glass-button-secondary flex items-center gap-1.5">
            <Bookmark size={16} /> Templates
          </button>
          <button onClick={() => setShowCreateModal(true)} className="glass-button-primary">
            <Plus size={18} /> <span className="hidden xs:inline">Create Task</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 relative z-10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search tasks..."
            className="glass-input pl-10" />
        </div>
        <button onClick={handleSearch} className="glass-button-primary">Search</button>
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); loadTasks(); }} className="glass-button-secondary">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 relative z-10">
          {categories.map((category) => (
            <button key={category.id} onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                selectedCategories.includes(category.id)
                  ? 'text-white border-transparent'
                  : 'glass-button-secondary'
              }`}
              style={{ backgroundColor: selectedCategories.includes(category.id) ? category.color : undefined }}>
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 relative z-10">
        {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((filterOption) => (
          <button key={filterOption}
            onClick={() => { setFilter(filterOption); setSelectedCategories([]); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition text-sm ${
              filter === filterOption
                ? 'bg-white/10 text-white'
                : 'glass-button-secondary'
            }`}>
            {filterOption.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Priority Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 relative z-10">
        {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
          <button key={p}
            onClick={() => { setPriorityFilter(p); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition text-sm ${
              priorityFilter === p
                ? p === 'URGENT' ? 'bg-red-500/20 text-red-400' :
                  p === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                  p === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                  p === 'LOW' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-white/10 text-white'
                : 'glass-button-secondary'
            }`}>
            {p === 'ALL' ? 'All Priority' : p}
          </button>
        ))}
      </div>

      {/* Active Filters */}
      {(filter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery || selectedCategories.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Active filters:</span>
          {filter !== 'ALL' && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/[0.06] flex items-center gap-1">
              Status: {filter.replace('_', ' ')}
              <button onClick={() => setFilter('ALL')} className="hover:text-white ml-1"><X size={12} /></button>
            </span>
          )}
          {priorityFilter !== 'ALL' && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/[0.06] flex items-center gap-1">
              Priority: {priorityFilter}
              <button onClick={() => setPriorityFilter('ALL')} className="hover:text-white ml-1"><X size={12} /></button>
            </span>
          )}
          {searchQuery && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/[0.06] flex items-center gap-1">
              Search: "{searchQuery}"
              <button onClick={() => { setSearchQuery(''); loadTasks(); }} className="hover:text-white ml-1"><X size={12} /></button>
            </span>
          )}
          {selectedCategories.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/[0.06] flex items-center gap-1">
              {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}
              <button onClick={() => setSelectedCategories([])} className="hover:text-white ml-1"><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      {/* Tasks */}
      {tasks.length === 0 ? (
        searchQuery ? <EmptyState type="search" searchQuery={searchQuery} /> : <EmptyState type="tasks" onAction={() => setShowCreateModal(true)} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
          {paginatedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask}
              onStatusChange={handleUpdateStatus} getPriorityColor={getPriorityColor} getStatusColor={getStatusColor} />
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={paginatedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 relative z-10">
              {paginatedTasks.map((task) => (
                <SortableTaskItem key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask}
                  onStatusChange={handleUpdateStatus} getPriorityColor={getPriorityColor} getStatusColor={getStatusColor} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
          totalItems={tasks.length} itemsPerPage={itemsPerPage} />
      )}

      <QuickAddTask onAdd={handleQuickAdd} categories={categories} />

      <TaskTemplates isOpen={showTemplates} onClose={() => setShowTemplates(false)}
        templates={templates.map(t => ({ id: String(t.id), name: t.name, title: t.titlePrefix || '', description: t.description || undefined, priority: t.priority as any, categoryIds: t.categoryIds ? t.categoryIds.split(',').map(Number) : undefined }))}
        onSelect={handleSelectTemplate}
        onSaveTemplate={handleSaveTemplate} onDeleteTemplate={handleDeleteTemplate}
        categories={categories} />

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white/[0.08] max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Task</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white transition p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Title *</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.08] transition" required autoFocus />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.08] transition" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition" />
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button key={category.id} type="button"
                        onClick={() => setNewTask(prev => ({ ...prev, categoryIds: prev.categoryIds.includes(category.id) ? prev.categoryIds.filter(id => id !== category.id) : [...prev.categoryIds, category.id] }))}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                          newTask.categoryIds.includes(category.id) ? 'text-white border-transparent' : 'bg-white/5 text-slate-300 border-white/[0.06] hover:bg-white/10'
                        }`}
                        style={{ backgroundColor: newTask.categoryIds.includes(category.id) ? category.color : undefined }}>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 font-medium transition justify-center">Create Task</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition justify-center">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-black border border-white/[0.08] max-w-2xl w-full p-6 my-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Task</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedTask(null); }} className="text-slate-400 hover:text-white transition p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Title *</label>
                <input type="text" value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.08] transition" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Description</label>
                <textarea value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.08] transition" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Status</label>
                  <select value={selectedTask.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Priority</label>
                  <select value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Due Date</label>
                <input type="date" value={selectedTask.dueDate || ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white focus:outline-none focus:border-white/[0.08] transition" />
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button key={category.id} type="button"
                        onClick={() => {
                          const categoryIds = selectedTask.categoryIds || [];
                          setSelectedTask({
                            ...selectedTask,
                            categoryIds: categoryIds.includes(category.id) ? categoryIds.filter(id => id !== category.id) : [...categoryIds, category.id]
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                          (selectedTask.categoryIds || []).includes(category.id) ? 'text-white border-transparent' : 'bg-white/5 text-slate-300 border-white/[0.06] hover:bg-white/10'
                        }`}
                        style={{ backgroundColor: (selectedTask.categoryIds || []).includes(category.id) ? category.color : undefined }}>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <FileUpload taskId={selectedTask.id} onUploadSuccess={handleFileUploadSuccess} />
              <AttachmentList attachments={selectedTask.attachments} onDelete={handleAttachmentDelete} />

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 font-medium transition justify-center">Update Task</button>
                <button type="button" onClick={() => { setShowEditModal(false); setSelectedTask(null); }} className="flex-1 px-4 py-2 bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition justify-center">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onStatusChange, getPriorityColor, getStatusColor }: any) {
  return (
    <div className="bg-black border border-white/[0.08] p-5 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-white flex-1 line-clamp-2">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-1.5 text-slate-400 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 text-slate-400 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
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
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-red-400 border border-white/[0.06]">OVERDUE</span>
        )}
      </div>

      {task.dueDate && (
        <div className="text-xs text-slate-400 mb-4 flex items-center gap-1">
          <Calendar size={12} />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {task.status === 'TODO' && (
        <button onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
          className="w-full py-2 bg-white/5 text-slate-300 border border-white/[0.06] hover:bg-white/10 text-sm font-medium transition">
          Start
        </button>
      )}
      {task.status === 'IN_PROGRESS' && (
        <button onClick={() => onStatusChange(task.id, 'COMPLETED')}
          className="w-full py-2 bg-white/10 text-white border border-white/[0.08] hover:bg-white/[0.15] text-sm font-medium transition">
          Complete
        </button>
      )}
    </div>
  );
}

function SortableTaskItem({ task, onEdit, onDelete, onStatusChange, getPriorityColor, getStatusColor }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`bg-black border border-white/[0.08] p-4 flex items-center gap-4 ${isDragging ? 'z-50' : ''}`}>
      <button {...attributes} {...listeners} className="p-1 text-slate-500 hover:text-white cursor-grab active:cursor-grabbing transition shrink-0">
        <GripVertical size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-white truncate">{task.title}</h3>
          {task.overdue && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-red-400 border border-white/[0.06] shrink-0">OVERDUE</span>
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
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.status === 'TODO' && (
          <button onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
            className="px-3 py-1.5 bg-white/5 text-slate-300 border border-white/[0.06] hover:bg-white/10 text-sm font-medium transition">Start</button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button onClick={() => onStatusChange(task.id, 'COMPLETED')}
            className="px-3 py-1.5 bg-white/10 text-white border border-white/[0.08] hover:bg-white/[0.15] text-sm font-medium transition">Complete</button>
        )}
        <button onClick={() => onEdit(task)} className="p-2 text-slate-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-slate-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Tasks;
