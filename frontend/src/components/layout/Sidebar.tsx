import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { authApi } from '../../api/authApi';
import type { User } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  BarChart3,
  User as UserIcon,
  Shield,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  profileImage?: string;
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  { label: 'Categories', path: '/categories', icon: <FolderOpen size={20} /> },
  { label: 'Statistics', path: '/statistics', icon: <BarChart3 size={20} /> },
  { label: 'Profile', path: '/profile', icon: <UserIcon size={20} /> },
];

const adminNavItems: NavItem[] = [
  { label: 'Admin Panel', path: '/admin', icon: <Shield size={20} />, adminOnly: true },
];

export default function Sidebar({ collapsed, onToggle, profileImage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const user = authApi.getCurrentUser() as User | null;
  const isAdmin = authApi.isAdmin();

  const filteredNavItems = navItems.filter(item => !item.adminOnly);
  const filteredAdminNavItems = adminNavItems.filter(item => !item.adminOnly || isAdmin);

  const isDark = theme === 'dark';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700'
          : 'bg-white border-r border-slate-200'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex-shrink-0 flex items-center border-b ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      } ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          {!collapsed && (
            <span className={`font-bold text-xl tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Work<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Flow</span>
            </span>
          )}
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-1.5' : 'px-3'}`}>
        {/* Main Menu Items */}
        <ul className={`space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className={collapsed ? 'w-full flex justify-center' : ''}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    onNavigate?.();
                  }}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    collapsed ? 'w-12 h-12 justify-center' : 'w-full'
                  } ${
                    isActive
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`flex-shrink-0 ${isActive ? (isDark ? 'text-blue-400' : 'text-blue-600') : ''}`}>{item.icon}</span>
                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Admin Menu Items */}
        {isAdmin && (
          <ul className={`space-y-1 mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} ${collapsed ? 'flex flex-col items-center' : ''}`}>
            {filteredAdminNavItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <li key={item.path} className={collapsed ? 'w-full flex justify-center' : ''}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      onNavigate?.();
                    }}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      collapsed ? 'w-12 h-12 justify-center' : 'w-full'
                    } ${
                      isActive
                        ? isDark
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-purple-50 text-purple-600 border border-purple-200'
                        : isDark
                          ? 'text-purple-300 hover:text-white hover:bg-purple-500/20 border border-transparent'
                          : 'text-purple-600 hover:text-white hover:bg-purple-50 border border-transparent'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0"><Shield size={20} /></span>
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Bottom Section - Fixed */}
      <div className={`flex-shrink-0 p-2 space-y-1 ${isDark ? 'border-t border-slate-700' : 'border-t border-slate-200'}`}>
        
        {/* Theme Toggle */}
        <div className={collapsed ? 'flex justify-center' : ''}>
          <button
            onClick={toggleTheme}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              collapsed ? 'w-12 h-12 justify-center' : 'w-full'
            } ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={collapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {!collapsed && (
              <span className="font-medium text-sm">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && user && (
          <div className={`px-3 py-3 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={user.username} 
                  className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-600"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">{getInitials(user.username)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>{user.username}</p>
                <p className={`text-xs truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Avatar - Collapsed */}
        {collapsed && user && (
          <div className="flex justify-center">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={user.username} 
                className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-600" 
                title={user.username}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md" title={user.username}>
                <span className="text-white text-sm font-bold">{getInitials(user.username)}</span>
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        <div className={collapsed ? 'flex justify-center' : ''}>
          <button
            onClick={handleLogout}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              collapsed ? 'w-12 h-12 justify-center' : 'w-full'
            } ${
              isDark
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Collapse Button */}
        <div className="flex justify-center pt-1">
          <button
            onClick={onToggle}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              isDark
                ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
