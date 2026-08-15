import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import type { User } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  BarChart3,
  User as UserIcon,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Activity,
  Users,
} from 'lucide-react';
import { cn } from '../../lib/utils';

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
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  { label: 'Categories', path: '/categories', icon: <FolderOpen size={20} /> },
  { label: 'Statistics', path: '/statistics', icon: <BarChart3 size={20} /> },
  { label: 'Activity', path: '/activity', icon: <Activity size={20} /> },
  { label: 'Teams', path: '/teams', icon: <Users size={20} /> },
  { label: 'Profile', path: '/profile', icon: <UserIcon size={20} /> },
];

export default function Sidebar({ collapsed, onToggle, profileImage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authApi.getCurrentUser() as User | null;
  const isAdmin = authApi.isAdmin();

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
    window.location.replace('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname.startsWith(path);
    if (path === '/tasks') return location.pathname === '/tasks';
    return location.pathname === path;
  };

  const NavButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);
    return (
      <button
        onClick={() => {
          navigate(item.path);
          onNavigate?.();
        }}
        className={cn(
          'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
          collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-3 py-2.5',
          active
            ? 'bg-primary-500/10 text-primary-300 border border-primary-500/30'
            : 'text-slate-500 hover:text-white hover:bg-white/[0.03] border border-transparent',
        )}
        title={collapsed ? item.label : undefined}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-black text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        'h-screen flex flex-col transition-all duration-300 ease-in-out bg-black border-r border-white/[0.05]',
        collapsed ? 'w-20' : 'w-56',
      )}
    >
      {/* Logo */}
      <div className={cn('h-16 flex-shrink-0 flex items-center border-b border-white/[0.04]', collapsed ? 'justify-center' : 'px-4')}>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 group"
        >
          <div className={cn(
            'rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.10] transition-all',
            collapsed ? 'w-10 h-10' : 'w-10 h-10',
          )}>
            <span className="text-white font-bold text-sm">W</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl tracking-tight text-white">
              WorkFlow
            </span>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')}>
        <div className={cn('space-y-1', collapsed ? 'flex flex-col items-center' : '')}>
          {navItems.map((item) => (
            <div key={item.path} className={collapsed ? 'w-full flex justify-center' : ''}>
              <NavButton item={item} />
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className={cn('mt-4 pt-4 border-t border-white/[0.04] space-y-1', collapsed ? 'flex flex-col items-center' : '')}>
            <div className={collapsed ? 'w-full flex justify-center' : ''}>
              <NavButton item={{ label: 'Admin Panel', path: '/admin', icon: <Shield size={20} /> }} />
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 p-2 space-y-1 border-t border-white/[0.04]">

        {/* User Info */}
        {!collapsed && user && (
          <div className="mx-1 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-3">
              {profileImage ? (
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white/10 shrink-0">
                  <img
                    src={profileImage}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center ring-2 ring-white/10 shrink-0">
                  <span className="text-white text-sm font-bold">{getInitials(user.username)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{user.username}</p>
                <p className="text-xs truncate text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {collapsed && user && (
          <div className="flex justify-center py-1">
            {profileImage ? (
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white/10">
                <img
                  src={profileImage}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  title={user.username}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center ring-2 ring-white/10" title={user.username}>
                <span className="text-white text-sm font-bold">{getInitials(user.username)}</span>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div className={collapsed ? 'flex justify-center' : ''}>
          <button
            onClick={handleLogout}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
              collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-3 py-2.5',
              'text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent',
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-black text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Collapse Button */}
        <div className="flex justify-center pt-0.5">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
