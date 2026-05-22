import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Check, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') setPasswordStrength(calculateStrength(value));
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

  const getStrengthBar = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/4';
      case 'fair': return 'w-2/4';
      case 'good': return 'w-3/4';
      case 'strong': return 'w-full';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/users/me/change-password', { currentPassword: formData.currentPassword, newPassword: formData.newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to change password'); }
    finally { setLoading(false); }
  };

  const requirements = [
    { label: 'At least 6 characters', met: formData.newPassword.length >= 6 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(formData.newPassword) },
    { label: 'Contains special character', met: /[@#$%^&+=!]/.test(formData.newPassword) },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-xl mx-auto p-6 relative">
        <Link to="/profile" className="inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition relative z-10">
          <ArrowLeft size={20} />
          Back to Profile
        </Link>

        <div className="bg-white/5 border border-white/[0.06] rounded-xl p-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/[0.06]">
              <Lock className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Change Password</h1>
              <p className="text-sm text-slate-400">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} name="currentPassword"
                  value={formData.currentPassword} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-white pr-12" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition p-1">
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} name="newPassword"
                  value={formData.newPassword} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-white pr-12" />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition p-1">
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Strength</span>
                    <span className="text-xs font-medium text-slate-400">
                      {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all bg-white/10 ${getStrengthBar()}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2">
                    {requirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-xs ${req.met ? 'text-slate-400' : 'text-slate-500'}`}>
                        {req.met ? <Check size={12} /> : <X size={12} />}
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-white pr-12" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition p-1">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`mt-2 text-sm flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? 'text-slate-400' : 'text-slate-400'}`}>
                  {formData.newPassword === formData.confirmPassword ? <><Check size={14} /> Passwords match</> : <><X size={14} /> Passwords do not match</>}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || (formData.newPassword !== formData.confirmPassword && formData.confirmPassword.length > 0)}
              className={`w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                loading || (formData.newPassword !== formData.confirmPassword && formData.confirmPassword.length > 0)
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}>
              <Save size={18} />
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
