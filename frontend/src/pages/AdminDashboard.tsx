import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { adminApi, type UserWithStats } from '../api/adminApi';
import toast from 'react-hot-toast';
import { Users, CheckCircle, XCircle, Shield, Search, Eye, Trash2, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const statCards = [
  { label: 'Total Users', key: 'total' as const, icon: Users, boxCls: 'bg-primary-500/10 border-primary-500/20', iconCls: 'text-primary-400' },
  { label: 'Active', key: 'active' as const, icon: CheckCircle, boxCls: 'bg-emerald-500/10 border-emerald-500/20', iconCls: 'text-emerald-400' },
  { label: 'Inactive', key: 'inactive' as const, icon: XCircle, boxCls: 'bg-red-500/10 border-red-500/20', iconCls: 'text-red-400' },
  { label: 'Admins', key: 'admins' as const, icon: Shield, boxCls: 'bg-amber-500/10 border-amber-500/20', iconCls: 'text-amber-400' },
];

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
      const response = await adminApi.getUsers();
      if (response.success) {
        const usersWithStats: UserWithStats[] = await Promise.all(
          response.data.map(async (user: UserWithStats) => {
            try {
              const statsRes = await adminApi.getUserStats(user.id);
              return { ...user, taskStats: statsRes.success ? statsRes.data : undefined };
            } catch { return user; }
          })
        );
        setUsers(usersWithStats);
      }
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await adminApi.deleteUser(userId);
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
        <div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-slate-500 animate-pulse">Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage users and monitor activity</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ label, key, icon: Icon, boxCls, iconCls }) => (
          <div key={label} className="bg-white/5 border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${boxCls}`}>
                <Icon size={20} className={iconCls} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats[key]}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/5 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search users by name or email..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-white placeholder-slate-500 pl-10 focus:outline-none focus:ring-2 focus:ring-white/20 transition" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                viewMode === 'table' ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-300'
              }`}>
              <List size={18} /> <span className="hidden sm:inline">Table</span>
            </button>
            <button onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                viewMode === 'cards' ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-300'
              }`}>
              <Grid size={18} /> <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredUsers.map(user => {
                  const avatarUrl = getProfileImageUrl(user.profileImage);
                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white/[0.06]">
                              <img src={avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold shadow-md">
                              {user.username?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">{user.username}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            user.enabled
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {user.enabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {user.enabled ? 'Active' : 'Inactive'}
                          </span>
                          {user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Shield size={12} /> Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="font-semibold text-white">{user.taskStats?.totalTasks || 0}</span></td>
                      <td className="px-6 py-4"><span className="font-semibold text-white">{user.taskStats?.completedTasks || 0}</span></td>
                      <td className="px-6 py-4"><span className="font-semibold text-white">{user.taskStats?.inProgressTasks || 0}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="p-2 text-slate-400 hover:bg-white/5 rounded-lg transition"><Eye size={18} /></button>
                          {!user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                            <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                              className="p-2 text-slate-400 hover:bg-white/5 rounded-lg transition"><Trash2 size={18} /></button>
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
                <div key={user.id} className="bg-white/5 border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    {avatarUrl ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white/[0.06]">
                        <img src={avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg text-white truncate">{user.username}</p>
                      <p className="text-sm text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                      user.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {user.enabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {user.enabled ? 'Active' : 'Inactive'}
                    </span>
                    {user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Shield size={12} /> Admin
                      </span>
                    )}
                  </div>
                  {user.taskStats && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/[0.06]">
                        <p className="text-xl font-bold text-white">{user.taskStats.totalTasks}</p>
                        <p className="text-xs text-slate-400">Total</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/[0.06]">
                        <p className="text-xl font-bold text-white">{user.taskStats.completedTasks}</p>
                        <p className="text-xs text-slate-400">Done</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/[0.06]">
                        <p className="text-xl font-bold text-white">{user.taskStats.inProgressTasks}</p>
                        <p className="text-xs text-slate-400">Active</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2.5 rounded-xl font-medium flex-1 justify-center inline-flex items-center gap-2"><Eye size={16} /> View</button>
                    {!user.roles?.some((r: any) => r.name === 'ROLE_ADMIN') && (
                      <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                        className="px-4 py-2.5 bg-white/5 text-slate-300 rounded-xl font-medium"><Trash2 size={16} /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/[0.06]">
              <Users size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-slate-400">{searchQuery ? 'Try adjusting your search terms' : 'No registered users yet'}</p>
          </div>
        )}
      </motion.div>

      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="bg-white/5 border border-white/[0.06] rounded-xl p-6 w-full max-w-md">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/[0.06]">
              <Trash2 size={24} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">Delete User?</h3>
            <p className="text-center text-slate-400 mb-6">
              Are you sure you want to delete <strong className="text-white">{selectedUser.username}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="bg-white/5 text-slate-300 px-4 py-2.5 rounded-xl font-medium flex-1">Cancel</button>
              <button onClick={() => handleDeleteUser(selectedUser.id)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white hover:bg-red-600 rounded-xl font-medium">Delete User</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
