import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';
import toast from 'react-hot-toast';
import type { Category } from '../types';
import { Plus, FolderOpen, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const presetColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#6366f1' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try { setLoading(true); const r = await categoryApi.getAllCategories(); if (r.success) setCategories(r.data); }
    catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) { toast.error('Please enter a category name'); return; }
    try { const r = await categoryApi.createCategory(newCategory); if (r.success) { toast.success('Category created!'); setShowCreateModal(false); setNewCategory({ name: '', description: '', color: '#6366f1' }); loadCategories(); } }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed to create category'); }
  };

  const handleEditCategory = (category: Category) => { setSelectedCategory({ ...category }); setShowEditModal(true); };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try { const r = await categoryApi.updateCategory(selectedCategory!.id, { name: selectedCategory!.name, description: selectedCategory!.description, color: selectedCategory!.color }); if (r.success) { toast.success('Category updated!'); setShowEditModal(false); setSelectedCategory(null); loadCategories(); } }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update category'); }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Delete this category?')) return;
    try { const r = await categoryApi.deleteCategory(categoryId); if (r.success) { toast.success('Category deleted!'); loadCategories(); } }
    catch { toast.error('Failed to delete category'); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition";

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Organize your tasks with categories</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.97]">
          <Plus size={18} /> New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="glass-panel p-16 text-center">
          <FolderOpen className="mx-auto h-14 w-14 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No categories yet</h3>
          <p className="text-sm text-slate-500 mb-6">Create categories to organize your tasks!</p>
          <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition">
            <Plus size={16} /> Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel-hover p-5 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                <h3 className="text-base font-semibold text-white truncate">{category.name}</h3>
              </div>
              {category.description && (
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{category.description}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-white/[0.04]">
                <button onClick={() => handleEditCategory(category)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white text-sm font-medium transition">
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => handleDeleteCategory(category.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-6 animate-fadeInScale shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-5">Create Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
                <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className={inputCls} placeholder="e.g., Work, Personal, Urgent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                <textarea value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} className={inputCls} rows={3} placeholder="Optional description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetColors.map((color) => (
                    <button key={color} type="button" onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                      className="w-8 h-8 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: color, borderColor: newCategory.color === color ? '#fff' : 'transparent', borderWidth: '2px', boxShadow: newCategory.color === color ? '0 0 0 2px rgba(255,255,255,0.3)' : 'none' }} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} className="h-10 w-16 rounded cursor-pointer bg-transparent border-0" />
                  <input type="text" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition text-sm">Create</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-6 animate-fadeInScale shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-5">Edit Category</h2>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
                <input type="text" value={selectedCategory.name} onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                <textarea value={selectedCategory.description || ''} onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })} className={inputCls} rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Color</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetColors.map((color) => (
                    <button key={color} type="button" onClick={() => setSelectedCategory(prev => ({ ...prev!, color }))}
                      className="w-8 h-8 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: color, borderColor: selectedCategory.color === color ? '#fff' : 'transparent', borderWidth: '2px', boxShadow: selectedCategory.color === color ? '0 0 0 2px rgba(255,255,255,0.3)' : 'none' }} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <input type="color" value={selectedCategory.color} onChange={(e) => setSelectedCategory({ ...selectedCategory, color: e.target.value })} className="h-10 w-16 rounded cursor-pointer bg-transparent border-0" />
                  <input type="text" value={selectedCategory.color} onChange={(e) => setSelectedCategory({ ...selectedCategory, color: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition text-sm">Update</button>
                <button type="button" onClick={() => { setShowEditModal(false); setSelectedCategory(null); }} className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
