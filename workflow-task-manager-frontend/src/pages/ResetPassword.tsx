import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Lock, Eye, EyeOff, Check, X } from 'lucide-react';

function ResetPassword(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) { toast.error('Invalid reset link'); navigate('/login'); }
    else setToken(tokenParam);
  }, [searchParams, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post('/auth/reset-password', { token, newPassword: formData.newPassword, confirmPassword: formData.confirmPassword });
      if (response.success) {
        toast.success('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      if (error.response?.data?.fieldErrors) setErrors(error.response.data.fieldErrors);
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.');
    } finally { setLoading(false); }
  };

  const requirements = [
    { label: 'At least 6 characters', met: formData.newPassword.length >= 6 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Contains number', met: /[0-9]/.test(formData.newPassword) },
    { label: 'Contains special character', met: /[@#$%^&+=!]/.test(formData.newPassword) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <button onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Login</span>
        </button>
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="bg-white/5 rounded-full p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center border border-white/10">
              <Lock className="w-7 h-7 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-400">Enter your new password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-300 mb-2">New Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="newPassword"
                  value={formData.newPassword} onChange={handleChange}
                  className={`glass-input pr-12 ${errors.newPassword ? 'border-red-500' : ''}`}
                  placeholder="Enter new password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition p-1">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>}
              {formData.newPassword && (
                <div className="mt-3 space-y-1.5">
                  {requirements.map((req, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${req.met ? 'text-green-400' : 'text-slate-500'}`}>
                      {req.met ? <Check size={14} /> : <X size={14} />}
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  className={`glass-input pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm new password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition p-1">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
              {formData.confirmPassword && (
                <p className={`mt-1 text-xs flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                  {formData.newPassword === formData.confirmPassword ? <><Check size={14} /> Passwords match</> : <><X size={14} /> Passwords do not match</>}
                </p>
              )}
            </div>
            <button type="submit" disabled={loading || (formData.newPassword !== formData.confirmPassword && formData.confirmPassword.length > 0)}
              className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                loading ? 'bg-white/10 cursor-not-allowed' : 'glass-button-primary w-full justify-center'
              }`}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-slate-400 hover:text-white transition font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
