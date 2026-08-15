import { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Smartphone, Globe, Clock, LogOut, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(false);
      setSessions([
        { id: '1', device: 'Desktop', browser: 'Chrome on Windows', ip: '192.168.1.1', location: 'Local Network', loginTime: new Date(Date.now() - 3600000).toISOString(), isCurrent: true },
        { id: '2', device: 'Mobile', browser: 'Safari on iPhone', ip: '192.168.1.2', location: 'Local Network', loginTime: new Date(Date.now() - 86400000).toISOString(), isCurrent: false },
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
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto p-6 relative">
        <Link to="/profile" className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition relative z-10">
          <ArrowLeft size={20} />
          Back to Profile
        </Link>

        <div className="bg-white/5 border border-white/[0.06] rounded-xl p-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/[0.06]">
              <Clock className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Login History</h1>
              <p className="text-sm text-slate-400">Monitor where your account is being used</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-shimmer h-20 rounded-xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">No login sessions found</p>
                </div>
              ) : (
                sessions.map(session => (
                  <div key={session.id}
                    className={`p-4 rounded-xl border transition ${
                      session.isCurrent
                        ? 'bg-white/5 border-white/[0.08]'
                        : 'bg-white/5 border-white/[0.06]'
                    }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/[0.06]">
                          <span className="text-slate-400">{getDeviceIcon(session.device)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{session.device}</span>
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500 text-white">Current</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{session.browser}</p>
                          <p className="text-xs mt-1 text-slate-500">{session.ip} &bull; {session.location}</p>
                          <p className="text-xs mt-1 text-slate-500">{formatTime(session.loginTime)}</p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button onClick={() => handleLogoutSession(session.id)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition" title="Logout this session">
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

        <div className="mt-4 bg-white/5 border border-white/[0.06] rounded-xl p-4 relative z-10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />
            <p className="text-sm text-slate-400">
              For security reasons, we recommend logging out of devices you don't recognize or no longer use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
