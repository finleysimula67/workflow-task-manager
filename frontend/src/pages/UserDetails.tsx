import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Mail, Shield, CheckCircle, XCircle, Hash } from 'lucide-react';

function UserDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/users/${userId}`);
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      toast.error('Failed to load user details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = (profileImage?: string) => {
    if (!profileImage) return null;
    if (profileImage.startsWith('http')) return profileImage;
    return `http://localhost:8080${profileImage}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">User not found</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.roles?.some((r: any) => r.name === 'ROLE_ADMIN');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium"
        >
          <ArrowLeft size={18} />
          Back to Admin
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">User Details</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Viewing details for {user.username}</p>
        </div>
      </div>

      {/* User Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* User Header Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end gap-4 -mt-10 mb-6">
            {getProfileImageUrl(user.profileImage) ? (
              <img
                src={getProfileImageUrl(user.profileImage)!}
                alt={user.username}
                className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white dark:border-slate-900"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-white dark:border-slate-900">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="pb-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.enabled
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                  {user.enabled
                    ? <><CheckCircle size={12} /> Active</>
                    : <><XCircle size={12} /> Inactive</>
                  }
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                    <Shield size={12} /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User ID */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                <Hash size={16} className="text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User ID</p>
                <p className="mt-0.5 text-base font-semibold text-slate-900 dark:text-white">{user.id}</p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                <User size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</p>
                <p className="mt-0.5 text-base font-semibold text-slate-900 dark:text-white">{user.username}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
                <Mail size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                <p className="mt-0.5 text-base font-semibold text-slate-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className={`p-2 rounded-lg ${user.enabled ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                {user.enabled
                  ? <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  : <XCircle size={16} className="text-red-600 dark:text-red-400" />
                }
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Status</p>
                <p className={`mt-0.5 text-base font-semibold ${user.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {user.enabled ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 md:col-span-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                <Shield size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roles</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role: any, index: number) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${role.name === 'ROLE_ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
                          : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                          }`}
                      >
                        {role.name?.replace('ROLE_', '') || role}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 text-sm">No roles assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;