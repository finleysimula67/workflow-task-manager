const fs = require('fs');
const content = `import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import type { User } from '../types';
import { User as UserIcon, Mail, Calendar } from 'lucide-react';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ProfileData extends User {
  totalTasks?: number;
  completedTasks?: number;
  totalCategories?: number;
}

function UserProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const getProfileImageUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const filename = path.split('/').pop();
    return \`\${API_URL}/users/profile-image/\${filename}\`;
  };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/me');
      if (response.success) {
        setProfile(response.data);
        setProfileImage(getProfileImageUrl(response.data.profileImage));
        setEditForm({ username: response.data.username, email: response.data.email });
      }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      const response = await axios.put('/users/me/password', passwordForm);
      if (response.success) {
        toast.success('Password changed!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setChangingPassword(false);
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" /></div>;
  if (!profile) return <div className="min-h-[60vh] flex items-center justify-center"><p>Failed to load</p></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">My Profile</h1><p className="text-slate-500">Manage your settings</p></div>
      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProfilePhotoUpload currentPhoto={profileImage} username={profile.username} onPhotoUpdate={(newPhoto) => setProfileImage(newPhoto)} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-slate-500">{profile.email}</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          {!editing && <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl">Edit</button>}
        </div>
        {!editing ? (
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-slate-500">Username</p><p className="font-medium">{profile.username}</p></div>
            <div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{profile.email}</p></div>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4 max-w-md">
            <input type="text" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
            <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl">Save</button>
          </form>
        )}
      </div>
      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl"><p className="text-sm text-slate-500">Total</p><p className="text-2xl font-bold">{profile.totalTasks ?? 0}</p></div>
          <div className="bg-green-50 p-4 rounded-xl"><p className="text-sm text-slate-500">Done</p><p className="text-2xl font-bold">{profile.completedTasks ?? 0}</p></div>
          <div className="bg-purple-50 p-4 rounded-xl"><p className="text-sm text-slate-500">Categories</p><p className="text-2xl font-bold">{profile.totalCategories ?? 0}</p></div>
        </div>
      </div>
    </div>
  );
}
export default UserProfile;
`;
fs.writeFileSync('src/pages/UserProfile.tsx', content);
console.log('Done');
