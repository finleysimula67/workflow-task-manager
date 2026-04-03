import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import type { User } from '../types';
import { Users, CheckCircle, XCircle, Shield, Search, Eye, Trash2, Grid, List, UserPlus } from 'lucide-react';

interface UserWithStats extends User {
  taskStats?: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completedTasks: number;
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    if (!authApi.isAdmin()) {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users');
      if (response.success) {
        const usersWithStats: UserWithStats[] = await Promise.all(
          response.data.map(async (user: User) => {
            try {
              const statsRes = await axios.get(`/admin/users/${user.id}/stats`);
              return { ...user, taskStats: statsRes.success ? statsRes.data : undefined };
            } catch {
              return user;
            }
          })
        );
        setUsers(usersWithStats);
      }
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await axios.delete(`/admin/users/${userId}`);
      if (response.success) {
        toast.success('User deleted');
        setUsers(users.filter((u) => u.id !== userId));
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    } catch { toast.error('Delete failed'); }
  };

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return null;
    if (profileImage.startsWith('http')) return profileImage;
    return `http://localhost:8080${profileImage}`;
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.enabled).length,
    inactive: users.filter(u => !u.enabled).length,
    admins: users.filter(u => u.roles?.some((r: any) => r.name === 'ROLE_ADMIN')).length
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage users and monitor activity</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-500/20">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-500/20">
              <XCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/20">
              <Shield size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.admins}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50" 
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('table')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                viewMode === 'table' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <List size={18} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button 
              onClick={() => setViewMode('cards')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                viewMode === 'cards' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Grid size={18} />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Progress</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map(user => {
                  const avatarUrl = getProfileImageUrl(user.profileImage);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                              {user.username?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{user.username}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.enabled 
                              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                              : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                          }`}>
                            {user.enabled ? 'Active' : 'Inactive'}
                          </span>
                          {user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 dark:text-white">{user.taskStats?.totalTasks || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600 dark:text-green-400">{user.taskStats?.completedTasks || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">{user.taskStats?.inProgressTasks || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/users/${user.id}`)} 
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
                          >
                            <Eye size={18} />
                          </button>
                          {!user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                            <button 
                              onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} 
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => {
              const avatarUrl = getProfileImageUrl(user.profileImage);
              return (
                <div key={user.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition">
                  <div className="flex items-center gap-4 mb-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.username}
                        className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg text-slate-900 dark:text-white truncate">{user.username}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.enabled 
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {user.enabled ? 'Active' : 'Inactive'}
                    </span>
                    {user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                        Admin
                      </span>
                    )}
                  </div>
                  {user.taskStats && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{user.taskStats.totalTasks}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{user.taskStats.completedTasks}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Done</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{user.taskStats.inProgressTasks}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/admin/users/${user.id}`)} 
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    {!user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                      <button 
                        onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} 
                        className="px-4 py-2.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-500/30 transition font-medium"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Users size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No users found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery ? 'Try adjusting your search terms' : 'No registered users yet'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <Trash2 size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Delete User?</h3>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{selectedUser.username}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteUser(selectedUser.id)} 
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium shadow-lg shadow-red-500/25"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
