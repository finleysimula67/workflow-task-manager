import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function ChangePassword() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordStrength(calculateStrength(value));
    }
  };

  const calculateStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
    if (!password) return 'weak';
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@#$%^&+=!]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'fair';
    if (score <= 5) return 'good';
    return 'strong';
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/users/me/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: 'At least 6 characters', met: formData.newPassword.length >= 6 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(formData.newPassword) },
    { label: 'Contains special character', met: /[@#$%^&+=!]/.test(formData.newPassword) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl mx-auto p-6">
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
              <Lock className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Change Password
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                    isDark
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  } focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                    isDark
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  } focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'weak' ? 'text-red-500' :
                      passwordStrength === 'fair' ? 'text-orange-500' :
                      passwordStrength === 'good' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                      style={{
                        width: passwordStrength === 'weak' ? '25%' :
                               passwordStrength === 'fair' ? '50%' :
                               passwordStrength === 'good' ? '75%' : '100%'
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-2">
                    {requirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-xs ${
                        req.met ? 'text-green-500' : isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {req.met ? <Check size={12} /> : <X size={12} />}
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                    isDark
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  } focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.confirmPassword && (
                <p className={`mt-2 text-sm ${
                  formData.newPassword === formData.confirmPassword
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {formData.newPassword === formData.confirmPassword
                    ? 'Passwords match'
                    : 'Passwords do not match'
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || formData.newPassword !== formData.confirmPassword}
              className={`w-full py-3 rounded-xl font-medium text-white transition ${
                loading || formData.newPassword !== formData.confirmPassword
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
