import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import axios from '../api/axios';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- LOGIC & SIDE EFFECTS ---

  useEffect(() => {
    // Security check: Redirect if not admin
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

      // Assuming your API returns { success: true, data: [...] }
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/admin/users/${userId}`);

      if (response.success) {
        toast.success('User deleted');
        setUsers(users.filter((u) => u.id !== userId));
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleLogout = async () => {
    await authApi.logout();
    toast.success('Logged out');
    navigate('/login');
  };

  // --- RENDER: LOADING STATE ---

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  // --- RENDER: MAIN DASHBOARD ---

  return (
      <div className="min-h-screen bg-[#020617] text-white font-sans">

        {/* HEADER */}
        <header className="border-b border-white/10 backdrop-blur-lg bg-black/30 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage users and system settings</p>
            </div>

            <div className="flex gap-3">
              <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 hover:bg-white/5 transition-all active:scale-95"
              >
                Dashboard
              </button>
              <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">

          {/* STATISTICS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Users',
                value: users.length,
                color: 'text-blue-400',
              },
              {
                title: 'Active Users',
                value: users.filter((u) => u.enabled).length,
                color: 'text-green-400',
              },
              {
                title: 'Inactive Users',
                value: users.filter((u) => !u.enabled).length,
                color: 'text-red-400',
              },
              {
                title: 'Admins',
                value: users.filter((u) => u.roles?.includes('ROLE_ADMIN')).length,
                color: 'text-purple-400',
              },
            ].map((card, index) => (
                <div
                    key={index}
                    className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md hover:border-white/20 transition-colors"
                >
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold mt-1 ${card.color}`}>
                    {card.value}
                  </p>
                </div>
            ))}
          </div>

          {/* USERS TABLE SECTION */}
          <div className="bg-black/40 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-semibold">All Registered Users</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-gray-400">{user.id}</td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {user.username}
                        </span>
                          {user.roles?.includes('ROLE_ADMIN') && (
                              <span className="text-[10px] uppercase font-bold text-purple-400 mt-0.5">
                            Administrator
                          </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                      <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              user.enabled
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.enabled ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {user.enabled ? 'Active' : 'Inactive'}
                      </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                              onClick={() => confirmDelete(user)}
                              className="text-red-400 hover:text-red-300 font-medium transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                              disabled={user.roles?.includes('ROLE_ADMIN')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>

              {users.length === 0 && (
                  <div className="py-20 text-center text-gray-500">
                    No users found in the system.
                  </div>
              )}
            </div>
          </div>
        </main>

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowDeleteModal(false)}
              ></div>

              {/* Modal Card */}
              <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Are you sure you want to remove <strong>{selectedUser.username}</strong>? This action is permanent and cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl transition-all font-medium shadow-lg shadow-red-900/30 active:scale-95"
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

export default AdminDashboard;