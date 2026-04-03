import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import type { User } from '../types';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

interface ProfileData extends User {
  totalTasks?: number;
  completedTasks?: number;
  totalCategories?: number;
}

function UserProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [editForm, setEditForm] = useState({ username: '', email: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/me');
      if (response.success) {
        setProfile(response.data);
        const imgUrl = response.data.profileImage 
          ? `http://localhost:8080${response.data.profileImage}`
          : undefined;
        setProfileImage(imgUrl);
        setEditForm({ username: response.data.username, email: response.data.email });
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhoto: string) => {
    setProfileImage(newPhoto);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put('/users/me', editForm);
      if (response.success) {
        toast.success('Profile updated!');
        setProfile(response.data);
        setEditing(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" /></div>;
  }

  if (!profile) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-slate-600 dark:text-slate-300">Failed to load</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your settings</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProfilePhotoUpload currentPhoto={profileImage} username={profile.username} onPhotoUpdate={handlePhotoUpdate} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.username}</h2>
            <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">{profile.provider}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Profile Information</h2>
          {!editing && <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">Edit</button>}
        </div>
        {!editing ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Username</p>
              <p className="font-medium text-slate-900 dark:text-white">{profile.username}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="font-medium text-slate-900 dark:text-white">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
              <span className="inline-flex px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">{profile.enabled ? 'Active' : 'Inactive'}</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Member Since</p>
              <p className="font-medium text-slate-900 dark:text-white">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4 max-w-md">
            <input 
              type="text" 
              value={editForm.username} 
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} 
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400" 
              required 
            />
            <input 
              type="email" 
              value={editForm.email} 
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400" 
              required 
            />
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">Save</button>
              <button type="button" onClick={() => { setEditing(false); setEditForm({ username: profile.username, email: profile.email }); }} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition">Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profile.totalTasks ?? 0}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
          </div>
          <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{profile.completedTasks ?? 0}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Done</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{profile.totalCategories ?? 0}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
