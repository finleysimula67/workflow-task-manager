import { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Smartphone, Globe, Clock, LogOut, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  loginTime: string;
  isCurrent: boolean;
}

export default function LoginHistory() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(false);
      setSessions([
        {
          id: '1',
          device: 'Desktop',
          browser: 'Chrome on Windows',
          ip: '192.168.1.1',
          location: 'Local Network',
          loginTime: new Date(Date.now() - 3600000).toISOString(),
          isCurrent: true,
        },
        {
          id: '2',
          device: 'Mobile',
          browser: 'Safari on iPhone',
          ip: '192.168.1.2',
          location: 'Local Network',
          loginTime: new Date(Date.now() - 86400000).toISOString(),
          isCurrent: false,
        },
      ]);
    };

    fetchSessions();
  }, []);

  const handleLogoutSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const getDeviceIcon = (device: string) => {
    if (device === 'Desktop') return <Monitor size={20} />;
    if (device === 'Mobile') return <Smartphone size={20} />;
    return <Globe size={20} />;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          to="/profile"
          className={`inline-flex items-center gap-2 mb-6 ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
          } transition`}
        >
          <ArrowLeft size={20} />
          Back to Profile
        </Link>

        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
              <Clock className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Login History
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Monitor where your account is being used
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="animate-pulse space-y-2">
                    <div className={`h-4 w-32 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`h-3 w-48 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    No login sessions found
                  </p>
                </div>
              ) : (
                sessions.map(session => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl border transition ${
                      session.isCurrent
                        ? isDark
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-blue-50 border-blue-200'
                        : isDark
                          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {getDeviceIcon(session.device)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {session.device}
                            </span>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white">
                                Current
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {session.browser}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {session.ip} • {session.location}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {formatTime(session.loginTime)}
                          </p>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleLogoutSession(session.id)}
                          className={`p-2 rounded-lg transition ${
                            isDark
                              ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                              : 'text-slate-500 hover:text-red-500 hover:bg-red-50'
                          }`}
                          title="Logout this session"
                        >
                          <LogOut size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-blue-50 border border-blue-100'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-blue-800'}`}>
              For security reasons, we recommend logging out of devices you don't recognize or no longer use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
