import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  /**
   * FIX: Stop the "Back" button from breaking the page.
   * We force a reload if the browser tries to load this from cache.
   */
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  /**
   * HANDLER: Google Sign Up
   * Using location. replace prevents the Google transition from
   * creating a broken history entry that causes white screens.
   */
  const handleGoogleSignUp = () => {
    const googleAuthUrl = 'http://localhost:8080/oauth2/authorization/google';
    window.location.assign(googleAuthUrl);
  };

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
    const newErrors: any = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must not exceed 50 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
          'Username can only contain letters, numbers, underscores and hyphens';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[@#$%^&+=])/.test(formData.password)) {
      newErrors.password =
          'Password must contain at least one special character (@#$%^&+=)';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authApi.register(formData);

      if (response.success) {
        toast.success(
            'Registration successful! Please check your email to verify your account.'
        );

        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
          error.response?.data?.message ||
          'Registration failed. Please try again.';

      if (error.response?.data?.fieldErrors) {
        setErrors(error.response.data.fieldErrors);
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex bg-[#020617]">

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
              Build better habits. <br /> One task at a time.
            </h2>
            <p className="text-gray-400 max-w-md">
              Start organizing your work, tracking your progress, and becoming more productive every day.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 relative">
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
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join WorkFlow today</p>
            </div>

            <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full py-3 px-4 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-200 active:scale-95 mb-6 shadow-lg shadow-white/5"
            >
              <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={`w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                        errors.username ? 'border-red-500' : 'border-white/10'
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
              </div>

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
                    placeholder="Create a strong password"
                    className={`w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                        errors.password ? 'border-red-500' : 'border-white/10'
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                      loading
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/30'
                  }`}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}

export default Register;