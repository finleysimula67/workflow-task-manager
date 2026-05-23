import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Mail, Shield, CheckCircle, XCircle, Hash, Save, Edit3, ToggleLeft, ToggleRight } from 'lucide-react';

interface UserDetailData {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  createdAt?: string;
  profileImage?: string;
  roles?: { id: number; name: string }[];
}

function UserDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => { loadUser(); }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUser(Number(userId));
      if (response.success) {
        setUser(response.data);
        setEditForm({ username: response.data.username, email: response.data.email });
      }
    } catch { toast.error('Failed to load user details'); navigate('/admin'); }
    finally { setLoading(false); }
  };

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return null;
    if (profileImage.startsWith('http')) return profileImage;
    return `http://localhost:8080${profileImage}`;
  };

  const toggleEnabled = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const response = await adminApi.updateUser(user.id, { enabled: !user.enabled });
      if (response.success) { setUser(response.data); toast.success(`User ${response.data.enabled ? 'enabled' : 'disabled'}`); }
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(false); }
  };

  const toggleRole = async () => {
    if (!user) return;
    const isAdmin = user.roles?.some(r => r.name === 'ROLE_ADMIN');
    try {
      setSaving(true);
      const newRoles = isAdmin ? ['ROLE_USER'] : ['ROLE_ADMIN'];
      const response = await adminApi.updateUser(user.id, { roles: newRoles });
      if (response.success) { setUser(response.data); toast.success(`Role updated to ${isAdmin ? 'User' : 'Admin'}`); }
    } catch { toast.error('Failed to update role'); }
    finally { setSaving(false); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      const response = await adminApi.updateUser(user.id, editForm);
      if (response.success) {
        setUser(response.data);
        setEditForm({ username: response.data.username, email: response.data.email });
        setEditingProfile(false);
        toast.success('Profile updated');
      }
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-transparent mx-auto" />
          <p className="mt-4 text-slate-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg">User not found</p>
          <button onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-xl font-medium">Back to Admin</button>
        </div>
      </div>
    );
  }

  const isAdmin = user.roles?.some((r: any) => r.name === 'ROLE_ADMIN');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition font-medium">
          <ArrowLeft size={18} /> Back
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">User Details</h1>
          <p className="text-slate-400 mt-1">Managing {user.username}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="h-24 bg-white/5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-amber-500/5" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-6">
            {getProfileImageUrl(user.profileImage) ? (
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl border-4 border-[#0f0f1a] shrink-0">
                <img src={getProfileImageUrl(user.profileImage)!} alt={user.username} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-[#0f0f1a] shrink-0">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="pb-2 flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{user.username}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  user.enabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {user.enabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {user.enabled ? 'Active' : 'Inactive'}
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Shield size={12} /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
              <div className="p-2 rounded-lg bg-white/5">
                <Hash size={16} className="text-primary-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">User ID</p>
                <p className="mt-0.5 text-base font-semibold text-white">{user.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
              <div className="p-2 rounded-lg bg-white/5">
                <User size={16} className="text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Username</p>
                {editingProfile ? (
                  <input type="text" value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20" />
                ) : (
                  <p className="mt-0.5 text-base font-semibold text-white">{user.username}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
              <div className="p-2 rounded-lg bg-white/5">
                <Mail size={16} className="text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</p>
                {editingProfile ? (
                  <input type="email" value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.06] text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20" />
                ) : (
                  <p className="mt-0.5 text-base font-semibold text-white">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06]">
              <div className="p-2 rounded-lg bg-white/5">
                {user.enabled ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Status</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-base font-semibold text-white">{user.enabled ? 'Active' : 'Inactive'}</p>
                  <button onClick={toggleEnabled} disabled={saving}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 border ${
                      user.enabled
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
                    } disabled:opacity-50`}>
                    {user.enabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {user.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/[0.06] md:col-span-2">
              <div className="p-2 rounded-lg bg-white/5">
                <Shield size={16} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Roles</p>
                  <button onClick={toggleRole} disabled={saving}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition border border-white/[0.06] inline-flex items-center gap-1.5 disabled:opacity-50">
                    <Shield size={14} /> {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                  </button>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role: any, index: number) => (
                      <span key={index}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          role.name === 'ROLE_ADMIN'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-white/5 text-slate-400 border-white/[0.06]'
                        }`}>{role.name?.replace('ROLE_', '') || role}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">No roles assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/[0.06]">
            {editingProfile ? (
              <>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition inline-flex items-center gap-2 disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditingProfile(false); setEditForm({ username: user.username, email: user.email }); }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 text-sm font-medium transition">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditingProfile(true)}
                className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition inline-flex items-center gap-2">
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
