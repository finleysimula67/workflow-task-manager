import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderOpen, BarChart3, User, Shield, Activity, Users } from 'lucide-react';
import { authApi } from '../../api/authApi';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/statistics', icon: BarChart3, label: 'Stats' },
  { path: '/teams', icon: Users, label: 'Teams' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const isAdmin = authApi.isAdmin();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/[0.05]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === '/tasks' && location.pathname.startsWith('/tasks'));
          return (
            <NavLink key={path} to={path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] ${
                isActive ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={20} className={isActive ? 'scale-110' : ''} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
        {isAdmin && (
          <NavLink to="/admin"
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] ${
              location.pathname === '/admin' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}>
            <Shield size={20} />
            <span className="text-[10px] font-medium">Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}
