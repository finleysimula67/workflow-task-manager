import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

function ForgotPassword(): ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email address'); return; }
    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
    } catch (_) {}
    toast.success('If an account exists with this email, a password reset link has been sent.');
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="glass-card p-8 w-full max-w-md text-center relative z-10 animate-fadeIn">
          <div className="bg-green-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-green-500/20">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-slate-400 mb-6">
            If an account exists with <strong className="text-white">{email}</strong>, we've sent a password reset link.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-yellow-400 font-medium flex items-center gap-2 mb-2">
              <AlertCircle size={16} /> Important:
            </p>
            <ul className="text-sm text-yellow-400/80 space-y-1 list-disc list-inside">
              <li>The link will expire in 1 hour</li>
              <li>Check your spam folder if you don't see it</li>
              <li>The link can only be used once</li>
            </ul>
          </div>
          <button onClick={() => navigate('/login')}
            className="glass-button-primary w-full justify-center">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <button onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Login</span>
        </button>
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="bg-white/5 rounded-full p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center border border-white/10">
              <Mail className="w-7 h-7 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-slate-400">Enter your email and we'll send you reset instructions.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="glass-input" placeholder="you@example.com" required />
            </div>
            <button type="submit" disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                loading ? 'bg-white/10 cursor-not-allowed' : 'glass-button-primary w-full justify-center'
              }`}>
              {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
