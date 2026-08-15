import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, CheckCheck, Loader2 } from 'lucide-react';
import { notificationApi, type Notification } from '../../api/notificationApi';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      if (res.success) setUnreadCount(res.data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getUnreadNotifications();
      if (res.success) setNotifications(res.data);
    } catch {}
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleNotificationClick = (notif: Notification) => {
    handleMarkRead(notif.id);
    if (notif.taskId) navigate(`/tasks`);
    setIsOpen(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg hover:bg-white/5 transition ${unreadCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
        {unreadCount > 0 ? (
          <>
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        ) : (
          <BellOff size={20} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl shadow-xl border border-white/10 overflow-hidden z-[60] bg-black backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-white hover:text-gray-300 transition">
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <BellOff size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button key={notif.id} onClick={() => handleNotificationClick(notif)}
                  className="w-full text-left px-4 py-3 transition border-b border-white/[0.03] last:border-0 hover:bg-white/[0.03]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">{notif.title}</p>
                      {notif.message && (
                        <p className="text-xs mt-0.5 line-clamp-2 text-slate-400">{notif.message}</p>
                      )}
                    </div>
                    <span className="text-[10px] shrink-0 mt-0.5 text-slate-500">{formatTime(notif.createdAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
