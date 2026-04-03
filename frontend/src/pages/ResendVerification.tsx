import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';

function ResendVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Requesting verification resend

      const response = await axios.post(`/auth/resend-verification?email=${email}`);

      if (response.success) {
        // Email sent shown via toast
        toast.success('Verification email sent! Please check your inbox.');
        setSent(true);
      }
    } catch (error) {
      toast.error('Failed to send verification email');
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Sent!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{email}</strong>.
            Please check your inbox and click the verification link.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If you don't see the email, check your spam folder.
              The verification link will expire in 24 hours.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resend Verification</h1>
          <p className="text-gray-600">Enter your email to receive a new verification link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your credentials?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResendVerification;