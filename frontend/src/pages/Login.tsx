import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  /**
    */
  useEffect(() => {
    const handleBackNavigation = (event) => {
      // event.persisted is true when the page is loaded from cache (Back button)
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handleBackNavigation);

    // Additional check for Safari/Chrome BFCache
    const handlePopState = () => {
      if (window.performance && window.performance.navigation.type === 2) {
        window.location.reload();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('pageshow', handleBackNavigation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /**
   * OAuth Error Check
    */
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error === 'oauth2_failed') {
      toast.error(message || 'Google login failed. Please try again.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      if (response.success) {
        toast.success(response.message || 'Login successful!', { id: 'login-success' });
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401) {
          toast.error(errorData.message || 'Invalid email or password');
        } else if (status === 404) {
          toast.error('User not found');
        } else if (status === 400) {
          if (errorData.fieldErrors) {
            setErrors(errorData.fieldErrors);
            toast.error('Please check your input');
          } else {
            toast.error(errorData.message || 'Invalid input');
          }
        } else {
          toast.error(errorData.message || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check backend.');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * GOOGLE LOGIN HANDLER
   * We use assign() to keep Login in history, but the
   * listeners above handle the 'Back' button breakage.
    */
  const handleGoogleLogin = () => {
    window.location.assign('http://localhost:8080/oauth2/authorization/google');
  };

  return (
      <div className="min-h-screen flex bg-[#020617]">
        {/* BRANDING SECTION  */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_40%),radial-gradient(circle_at_80%_70%,#7c3aed,transparent_40%)]"></div>
          <div className="relative z-10 px-16 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-md">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">WorkFlow</h1>
            </div>
            <h2 className="text-4xl font-semibold mb-4 leading-snug">
              Stay organized. <br /> Stay consistent.
            </h2>
            <p className="text-gray-400 max-w-md">
              Manage your tasks, track your progress, and build a better workflow every single day.
            </p>
          </div>
        </div>

        {/* LOGIN SECTION  */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 relative">
          
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-2"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 mt-6 md:mt-0">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your WorkFlow account</p>
            </div>

            {/* GOOGLE BUTTON  */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-black/30 hover:bg-black/50 transition border border-white/10 text-white shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-transparent uppercase tracking-widest text-[10px]">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                        errors.password ? 'border-red-500' : 'border-white/10'
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" className="mr-2 accent-blue-500" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 pointer-events-none cursor-not-allowed opacity-50">
                  Forgot password?
                </Link>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                      loading
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.01] active:scale-95 shadow-lg shadow-blue-500/30'
                  }`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-8">
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
  );
}

export default Login;