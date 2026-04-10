import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderOpen, BarChart3, User, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authApi } from '../../api/authApi';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/statistics', icon: BarChart3, label: 'Stats' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAdmin = authApi.isAdmin();

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${
      isDark
        ? 'bg-slate-900/95 backdrop-blur-lg border-slate-700'
        : 'bg-white/95 backdrop-blur-lg border-slate-200'
    }`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/tasks' && location.pathname.startsWith('/tasks'));
          
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? isDark
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-blue-600 bg-blue-50'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={22} className={isActive ? 'scale-110' : ''} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
        
        {isAdmin && (
          <NavLink
            to="/admin"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
              location.pathname === '/admin'
                ? isDark
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-purple-600 bg-purple-50'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield size={22} />
            <span className="text-[10px] font-medium">Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}
