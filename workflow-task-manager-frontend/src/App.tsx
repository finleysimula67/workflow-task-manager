import { useEffect, type ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedLayout from './components/layout/ProtectedLayout';
import { authApi } from './api/authApi';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import ActivityLog from './pages/ActivityLog';
import AdminDashboard from './pages/AdminDashboard';
import UserDetails from './pages/UserDetails';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Tasks from './pages/Tasks';
import Categories from './pages/Categories';
import Statistics from './pages/Statistics';
import ChangePassword from './pages/ChangePassword';
import LoginHistory from './pages/LoginHistory';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import LandingPage from './pages/public/LandingPage';
import About from './pages/public/About';
import Features from './pages/public/Features';
import Pricing from './pages/public/Pricing';
import Contact from './pages/public/Contact';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [pathname]);
    return null;
};

const HistoryGuard = () => {
    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) window.location.reload();
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);
    return null;
};

interface RouteProps { children: ReactElement; }

const ProtectedRoute = ({ children }: RouteProps) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

const AdminRoute = ({ children }: RouteProps) => {
    if (!authApi.isAuthenticated()) return <Navigate to="/login" />;
    if (!authApi.isAdmin()) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <Router>
                <ScrollToTop />
                <HistoryGuard />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/resend-verification" element={<ResendVerification />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                        <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                        <Route path="/login-history" element={<ProtectedRoute><LoginHistory /></ProtectedRoute>} />
                        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
                        <Route path="/teams/:id" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
                        <Route path="/activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
                        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                        <Route path="/admin/users/:userId" element={<AdminRoute><UserDetails /></AdminRoute>} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
            <Toaster position="top-right" />
        </ThemeProvider>
    );
}

export default App;
