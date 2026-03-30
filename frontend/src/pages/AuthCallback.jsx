import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');

        if (!token || !refreshToken) {
          toast.error('Authentication failed - missing tokens');
          navigate('/login', { replace: true });
          return;
        }

        console.log('OAuth tokens received');

        // Save tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        // Decode JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        const user = {
          id: payload.userId,
          username: payload.username,
          email: payload.sub,
          roles: payload.roles ? payload.roles.split(',') : ['ROLE_USER']
        };

        localStorage.setItem('user', JSON.stringify(user));

        console.log('User info saved:', user);
        toast.success('Successfully logged in with Google!');

        // Move to dashboard and clear this page from history
        navigate('/dashboard', { replace: true });

      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Completing Google Sign-In...</p>
        </div>
      </div>
  );
}

export default AuthCallback;