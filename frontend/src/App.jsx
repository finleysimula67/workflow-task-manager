import { useEffect } from 'react'; // Added useEffect for scrolling
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Page Imports
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuthCallback from './pages/AuthCallback';
import AdminDashboard from './pages/AdminDashboard';
import UserDetails from './pages/UserDetails';
import { authApi } from './api/authApi.js';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Tasks from './pages/Tasks';
import Categories from './pages/Categories';
import Statistics from './pages/Statistics';
import LandingPage from './pages/public/LandingPage';
import About from './pages/public/About';
import Features from './pages/public/Features';
import Pricing from './pages/public/Pricing';
import Contact from './pages/public/Contact';

/**
 * 1. SCROLL TO TOP COMPONENT
 * This component watches the URL. Whenever the path changes,
 * it smoothly slides the window back to the top.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // This creates the "sliding" animation
        });
    }, [pathname]);

    return null;
};

// Route Protection Components
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function AdminRoute({ children }) {
    const isAuthenticated = authApi.isAuthenticated();
    const isAdmin = authApi.isAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

/**
 * 2. MAIN APP COMPONENT
 */
function App() {
    return (
        <>
            <Router>
                {/* We place ScrollToTop inside the Router so it can track the URL */}
                <ScrollToTop />

                <Routes>
                    {/* PUBLIC PAGES */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Email Verification Routes */}
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/resend-verification" element={<ResendVerification />} />

                    {/* Password Reset Routes */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected User Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}/>
                    <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                    <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/users/:userId" element={<AdminRoute><UserDetails /></AdminRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>

            <Toaster position="top-right" />
        </>
    );
}

export default App;