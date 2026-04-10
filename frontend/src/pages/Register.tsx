import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import type { PasswordStrength } from '../types';

function Register(): ReactElement {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');

  useEffect(() => {
    const handlePageShow = (event: PagesTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleGoogleSignUp = () => {
    const googleAuthUrl = 'http://localhost:8080/oauth2/authorization/google';
    window.location.assign(googleAuthUrl);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Calculate password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'weak';
    
    let score = 0;
    
    // Length checks
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Character type checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@#$%^&+=!]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'fair';
    if (score <= 6) return 'good';
    return 'strong';
  };

  const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getStrengthLabel = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
    }
  };

  const getStrengthWidth = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'weak': return '25%';
      case 'fair': return '50%';
      case 'good': return '75%';
      case 'strong': return '100%';
    }
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /[0-9]/.test(formData.password) },
    { label: 'Contains special character', met: /[@#$%^&+=!]/.test(formData.password) },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must not exceed 50 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores and hyphens';
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
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 mt-6 md:mt-0 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
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
                      placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Strength</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'weak' ? 'text-red-400' :
                        passwordStrength === 'fair' ? 'text-orange-400' :
                        passwordStrength === 'good' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {getStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                        style={{ width: getStrengthWidth(passwordStrength) }}
                      />
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-3 space-y-1.5">
                      {passwordRequirements.map((req, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-2 text-xs transition-colors ${
                            req.met ? 'text-green-400' : 'text-gray-500'
                          }`}
                        >
                          {req.met ? (
                            <Check size={14} className="flex-shrink-0" />
                          ) : (
                            <X size={14} className="flex-shrink-0" />
                          )}
                          <span>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`w-full px-4 py-3 pr-12 rounded-lg bg-black/30 text-white placeholder-gray-500 border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                      } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`mt-1 flex items-center gap-2 text-xs ${
                    formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check size={14} />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X size={14} />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
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
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}

export default Register;
