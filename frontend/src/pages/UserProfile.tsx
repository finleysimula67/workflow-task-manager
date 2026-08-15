import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import type { User } from '../types';
import { authApi } from '../api/authApi';
import { buildApiUrl } from '../api/config';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { notificationPreferenceApi, type NotificationPreference } from '../api/notificationPreferenceApi';
import { User as UserIcon, Mail, Calendar, Shield, CheckCircle, XCircle, Sparkles, Edit3, Save, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileData extends User {
  totalTasks?: number;
  completedTasks?: number;
  totalCategories?: number;
}

function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreference[]>([]);
  const isAdmin = authApi.isAdmin();

  useEffect(() => { fetchProfile(); loadNotifPrefs(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/me');
      if (response.success) {
        setProfile(response.data);
        const imgUrl = response.data.profileImage ? buildApiUrl(response.data.profileImage) : undefined;
        setProfileImage(imgUrl);
        setEditForm({ username: response.data.username, email: response.data.email });
      }
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handlePhotoUpdate = (newPhoto: string) => setProfileImage(newPhoto);

  const loadNotifPrefs = async () => {
    try {
      const res = await notificationPreferenceApi.getPreferences();
      if (res.success) setNotifPrefs(res.data);
    } catch {}
  };

  const toggleNotifPref = async (type: string) => {
    const updated = notifPrefs.map(p => p.type === type ? { ...p, enabled: !p.enabled } : p);
    setNotifPrefs(updated);
    try { await notificationPreferenceApi.updatePreferences(updated.map(p => ({ type: p.type, enabled: p.enabled }))); }
    catch { loadNotifPrefs(); }
  };

  const notifTypes = [
    { type: 'TASK_CREATED', label: 'Task Created', desc: 'When a task is created' },
    { type: 'TASK_UPDATED', label: 'Task Updated', desc: 'When a task is modified' },
    { type: 'TASK_DUE_SOON', label: 'Due Soon', desc: 'When a task is due within 24h' },
    { type: 'STATUS_CHANGED', label: 'Status Changed', desc: 'When task status changes' },
    { type: 'COMMENT_ADDED', label: 'Comment Added', desc: 'When someone comments on a task' },
  ];

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put('/users/me', editForm);
      if (response.success) { toast.success('Profile updated!'); setProfile(response.data); setEditing(false); }
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition";

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-white/10 border-t-primary-400 rounded-full animate-spin" /></div>;
  if (!profile) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-slate-400">Failed to load profile</p></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your account settings</p>
      </div>

      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProfilePhotoUpload currentPhoto={profileImage} username={profile.username} onPhotoUpdate={handlePhotoUpdate} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
            <p className="text-slate-400 text-sm">{profile.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/[0.06]">
                <Shield size={12} /> {profile.provider}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/[0.06]">
                {profile.enabled ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-red-400" />}
                {profile.enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <UserIcon size={18} className="text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          </div>
          {!editing && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition inline-flex items-center gap-2 shadow-lg shadow-primary-500/20">
              <Edit3 size={16} /> Edit
            </motion.button>
          )}
        </div>
        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Username</p>
              <p className="font-medium text-white">{profile.username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
              <p className="font-medium text-white">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12} /> Member Since</p>
              <p className="font-medium text-white">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Username</label>
              <input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className={inputCls} required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputCls} required />
            </div>
            <div className="flex gap-3 pt-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}

                type="submit" className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition inline-flex items-center gap-2 shadow-lg shadow-primary-500/20">
                <Save size={16} /> Save
              </motion.button>
              <button type="button" onClick={() => { setEditing(false); setEditForm({ username: profile.username, email: profile.email }); }}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-medium transition border border-white/[0.06]">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {isAdmin && (
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings size={18} className="text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Administration</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">Manage users, view system data, and configure application settings.</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/admin')}
            className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-500/20 inline-flex items-center gap-2">
            <Shield size={16} /> Open Admin Panel
          </motion.button>
        </div>
      )}

      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Statistics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Tasks', value: profile.totalTasks ?? 0, color: 'primary', bar: 'bg-primary-500/60' },
            { label: 'Completed', value: profile.completedTasks ?? 0, color: 'emerald', bar: 'bg-emerald-500/60' },
            { label: 'Categories', value: profile.totalCategories ?? 0, color: 'amber', bar: 'bg-amber-500/60' },
          ].map(({ label, value, bar }) => (
            <div key={label} className="bg-white/5 border border-white/[0.06] p-5 rounded-xl text-center relative overflow-hidden group">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
              <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((value / Math.max(profile.totalTasks ?? 1, 1)) * 100, 100)}%` }} transition={{ duration: 0.8, delay: 0.2 }} className={`h-full rounded-full ${bar}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-primary-400" />
          <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
        </div>
        <div className="space-y-1 divide-y divide-white/[0.04]">
          {notifTypes.map(({ type, label, desc }) => {
            const pref = notifPrefs.find(p => p.type === type);
            const enabled = pref === undefined ? true : pref.enabled;
            return (
              <div key={type} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleNotifPref(type)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${enabled ? 'bg-primary-500' : 'bg-white/10'}`}>
                  <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" />
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
