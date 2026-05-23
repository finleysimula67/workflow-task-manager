import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

function ResendVerification(): ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email address'); return; }
    setLoading(true);
    try {
      const response = await axios.post(`/auth/resend-verification?email=${email}`);
      if (response.success) { toast.success('Verification email sent!'); setSent(true); }
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to send verification email'); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="glass-card p-8 w-full max-w-md text-center relative z-10 animate-fadeIn">
          <div className="bg-green-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-green-500/20">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Email Sent!</h2>
          <p className="text-slate-400 mb-6">We've sent a verification email to <strong className="text-white">{email}</strong>.</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <AlertCircle size={16} /> <strong>Note:</strong> If you don't see the email, check your spam folder.
            </p>
          </div>
          <button onClick={() => navigate('/login')} className="glass-button-primary w-full justify-center">Go to Login</button>
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
            <h1 className="text-2xl font-bold text-white mb-2">Resend Verification</h1>
            <p className="text-slate-400">Enter your email to receive a new verification link</p>
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
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            Remember your credentials?{' '}
            <Link to="/login" className="text-slate-400 hover:text-white transition font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResendVerification;
