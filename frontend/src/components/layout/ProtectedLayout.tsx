import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNavigation from '../common/BottomNavigation';
import { useTheme } from '../../context/ThemeContext';
import { authApi } from '../../api/authApi';
import { buildApiUrl } from '../../api/config';
import type { User } from '../../types';
import toast from 'react-hot-toast';
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  LogOut,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const { theme, toggleTheme } = useTheme();
  const user = authApi.getCurrentUser() as User | null;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get('/users/me');
        if (response.success && response.data.profileImage) {
          setProfileImage(buildApiUrl(response.data.profileImage));
        }
      } catch {
        // ignore
      }
    };
    fetchProfileImage();
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 h-16 z-30 border-b ${
        isDark
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Side - Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Work<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Flow</span>
              </span>
            </button>
          </div>

          {/* Right Side - Theme & Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-lg transition ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={user?.username || 'User'} 
                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user ? getInitials(user.username) : 'U'}</span>
                  </div>
                )}
                <ChevronDown size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
              </button>

              {profileDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border overflow-hidden z-[60] ${
                  isDark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${
                    isDark ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{user?.username}</p>
                    <p className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); navigate('/profile'); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isDark
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <UserIcon size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                        isDark
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - Fixed LEFT side */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar on LEFT side */}
          <div className="absolute left-0 top-0 h-full">
            <Sidebar 
              collapsed={false} 
              onToggle={closeMobileMenu} 
              profileImage={profileImage}
              onNavigate={closeMobileMenu} 
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Fixed LEFT side */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-30">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          profileImage={profileImage}
        />
      </div>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />

      {/* Click outside to close profile dropdown */}
      {profileDropdownOpen && (
        <div 
          className="fixed inset-0 z-[35]" 
          onClick={() => setProfileDropdownOpen(false)} 
        />
      )}
    </div>
  );
}
