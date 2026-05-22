import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import axios from '../api/axios';
import toast from 'react-hot-toast';

function EmailVerificationBanner(): ReactElement | null {
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const user = authApi.getCurrentUser();

  useEffect(() => {
    if (user && user.enabled === false) setShow(true);
    else setShow(false);
  }, [user]);

  const handleResend = async () => {
    if (!user?.email) { toast.error('User email not found'); return; }
    setSending(true);
    try {
      const response = await axios.post(`/auth/resend-verification?email=${encodeURIComponent(user.email)}`);
      if (response.success) toast.success('Verification email sent!');
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to send verification email'); }
    finally { setSending(false); }
  };

  if (!show) return null;

  return (
    <div className="bg-white/5 border border-white/[0.06] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-amber-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-slate-400"><strong>Email not verified.</strong> Please check your inbox.</p>
        </div>
        <button onClick={handleResend} disabled={sending}
          className="ml-4 px-4 py-2 bg-white/10 text-white text-sm rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap">
          {sending ? 'Sending...' : 'Resend'}
        </button>
      </div>
    </div>
  );
}

export default EmailVerificationBanner;
