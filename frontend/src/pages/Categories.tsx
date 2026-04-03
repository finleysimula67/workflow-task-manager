import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';
import toast from 'react-hot-toast';
import type { Category } from '../types';
import { Plus, FolderOpen } from 'lucide-react';

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAllCategories();

      if (response.success) {
        setCategories(response.data);
      }
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const response = await categoryApi.createCategory(newCategory);

      if (response.success) {
        toast.success('Category created successfully!');
        setShowCreateModal(false);
        setNewCategory({ name: '', description: '', color: '#3B82F6' });
        loadCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await categoryApi.updateCategory(selectedCategory!.id, {
        name: selectedCategory!.name,
        description: selectedCategory!.description,
        color: selectedCategory!.color
      });

      if (response.success) {
        toast.success('Category updated successfully!');
        setShowEditModal(false);
        setSelectedCategory(null);
        loadCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await categoryApi.deleteCategory(categoryId);

      if (response.success) {
        toast.success('Category deleted successfully!');
        loadCategories();
      }
    } catch {
      toast.error('Failed to delete category');
    }
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
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Categories</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your tasks with categories</p>
          </div>
          <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
          >
            <Plus size={18} /> New Category
          </button>
        </div>

        {categories.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
              <FolderOpen className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No categories yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Create categories to organize your tasks!</p>
              <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
              >
                Create Category
              </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                  <div
                      key={category.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 p-6"
                  >
                    <div
                        className="h-2 rounded-full mb-4"
                        style={{ backgroundColor: category.color }}
                    />

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {category.name}
                    </h3>

                    {category.description && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </p>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button
                          onClick={() => handleEditCategory(category)}
                          className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/30 text-sm font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Create New Category</h2>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name *
                    </label>
                    <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="e.g., Work, Personal, Urgent"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        rows="3"
                        placeholder="Optional description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Color
                    </label>
                    <div className="flex gap-3">
                      <input
                          type="color"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                          type="text"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                    >
                      Create
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

        {showEditModal && selectedCategory && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Edit Category</h2>

                <form onSubmit={handleUpdateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name *
                    </label>
                    <input
                        type="text"
                        value={selectedCategory.name}
                        onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                        value={selectedCategory.description || ''}
                        onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Color
                    </label>
                    <div className="flex gap-3">
                      <input
                          type="color"
                          value={selectedCategory.color}
                          onChange={(e) => setSelectedCategory({ ...selectedCategory, color: e.target.value })}
                          className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                          type="text"
                          value={selectedCategory.color}
                          onChange={(e) => setSelectedCategory({ ...selectedCategory, color: e.target.value })}
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                    >
                      Update
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setSelectedCategory(null);
                        }}
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

export default Categories;
