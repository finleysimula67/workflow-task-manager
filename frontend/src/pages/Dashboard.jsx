import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { taskApi } from '../api/taskApi';
import toast from 'react-hot-toast';
import Logo from '../assets/logo.png';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import StatCard from '../components/StatCard';
import RecentTaskItem from '../components/RecentTaskItem';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- DARK MODE LOGIC ---
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);

    await Promise.allSettled([loadStats(), loadRecentTasks()]);
  };

  const loadStats = async () => {
    try {
      const res = await taskApi.getTaskStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const loadRecentTasks = async () => {
    try {
      const res = await taskApi.filterTasks({
        page: 0,
        size: 5,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      });
      if (res.success) {
        setRecentTasks(res.data.content ?? []);
      }
    } catch (err) {
      console.error('Recent tasks error:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        authApi.logout();
        navigate('/login');
      } else {
        toast.error('Failed to load recent tasks');
      }
    }
  };

  const handleLogout = () => {
    authApi.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#020617]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#020617] transition-colors duration-300">
        <EmailVerificationBanner />

        <header className="bg-white dark:bg-black/30 dark:backdrop-blur-lg dark:border-b dark:border-white/10 shadow transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <img
                  src={Logo}
                  alt="WorkFlow Logo"
                  className="h-20 w-auto object-contain -my-4 -ml-1 dark:invert dark:brightness-200 transition-all duration-300"
                  style={{ position: 'relative', top: '2px', left: '-22px' }}
              />
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.username}!</p>
            </div>

            <div className="flex items-center gap-4">
              {/* DARK MODE TOGGLE BUTTON */}
              <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-95"
                  title="Toggle Dark Mode"
              >
                {isDark ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
              </button>

              {authApi.isAdmin() && (
                  <button
                      onClick={() => navigate('/admin')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Admin Dashboard
                  </button>
              )}

              <button
                  onClick={() => navigate('/statistics')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                📊 Statistics
              </button>

              <button
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                My Profile
              </button>

              <button
                  onClick={() => navigate('/tasks')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Tasks
              </button>

              <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
                title="Total Tasks"
                value={stats?.totalTasks || 0}
                color="blue"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
            />

            <StatCard
                title="To Do"
                value={stats?.todoTasks || 0}
                color="blue"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
            />

            <StatCard
                title="In Progress"
                value={stats?.inProgressTasks || 0}
                color="yellow"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
            />

            <StatCard
                title="Completed"
                value={stats?.completedTasks || 0}
                color="green"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
            />

            <StatCard
                title="Overdue"
                value={stats?.overdueTasks || 0}
                color="red"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
            />
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-black/40 dark:border dark:border-white/10 rounded-lg shadow transition-colors">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
            </div>
            <div className="p-6">
              {recentTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No tasks yet. Create your first task!</p>
                    <button
                        onClick={() => navigate('/tasks')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Create Task
                    </button>
                  </div>
              ) : (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                        <RecentTaskItem
                            key={task.id}
                            task={task}
                            onClick={() => navigate('/tasks')}
                        />
                    ))}
                  </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}

export default Dashboard;