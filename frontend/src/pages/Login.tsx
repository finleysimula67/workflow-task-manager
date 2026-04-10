import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff, Clock } from 'lucide-react';

function Login(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastLogin, setLastLogin] = useState<string | null>(null);

  useEffect(() => {
    const handleBackNavigation = (event: PagesTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handleBackNavigation);

    const handlePopState = () => {
      if (window.performance && window.performance.navigation.type === 2) {
        window.location.reload();
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Load remembered email and last login
    const rememberedEmail = authApi.getRememberedEmail();
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
    
    const storedLastLogin = authApi.getLastLogin();
    if (storedLastLogin) {
      setLastLogin(storedLastLogin);
    }

    return () => {
      window.removeEventListener('pageshow', handleBackNavigation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error === 'oauth2_failed') {
      toast.error(message || 'Google login failed. Please try again.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      if (response.success) {
        toast.success(response.message || 'Login successful!', { id: 'login-success' });
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/dashboard');
      }
    } catch (error: any) {
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

  const handleGoogleLogin = () => {
    window.location.assign('http://localhost:8080/oauth2/authorization/google');
  };

  const formatLastLogin = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617]">
      {/* BRANDING SECTION */}
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

      {/* LOGIN SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 mt-6 md:mt-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your WorkFlow account</p>
          </div>

          {/* Last Login Indicator */}
          {lastLogin && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Clock size={16} className="text-blue-400" />
              <span>Last logged in: {formatLastLogin(lastLogin)}</span>
            </div>
          )}

          {/* GOOGLE BUTTON */}
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                        errors.password ? 'border-red-500' : 'border-white/10'
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" 
                />
                <span className="group-hover:text-white transition">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition">
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

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
