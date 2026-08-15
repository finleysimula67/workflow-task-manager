import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function VerifyEmail(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) { setError('Invalid verification link'); setVerifying(false); return; }
      try {
        const response = await axios.get(`/auth/verify-email?token=${token}`);
        if (response.success) {
          setSuccess(true);
          toast.success('Email verified successfully!');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Email verification failed';
        setError(msg);
        toast.error(msg);
      } finally { setVerifying(false); }
    };
    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="glass-card p-8 w-full max-w-md text-center relative z-10 animate-fadeIn">
        {verifying && (
          <div>
            <Loader2 size={48} className="animate-spin text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
            <p className="text-slate-400">Please wait while we verify your email address.</p>
          </div>
        )}
        {!verifying && success && (
          <div className="animate-fadeIn">
            <div className="bg-green-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-green-500/20">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-slate-400 mb-6">Your email has been verified successfully.</p>
            <button onClick={() => navigate('/login')} className="glass-button-primary w-full justify-center">Go to Login</button>
          </div>
        )}
        {!verifying && error && (
          <div className="animate-fadeIn">
            <div className="bg-red-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-red-500/20">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="space-y-3">
              <button onClick={() => navigate('/resend-verification')} className="glass-button-primary w-full justify-center">Resend Verification Email</button>
              <button onClick={() => navigate('/login')} className="glass-button-secondary w-full justify-center">Back to Login</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
