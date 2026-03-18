import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// We are using standard relative paths now to avoid the "os error 2"
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
function App() {
  return (
    <>
      <Router>
        <Routes>
             {/* PUBLIC PAGES - NEW */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />

             {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Email Verification Routes */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
{/*           <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} /> */}

          <Route
               path="/tasks"
                     element={
                       <ProtectedRoute>
                         <Tasks />
                       </ProtectedRoute>
                     }/>

          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}/>

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />

  {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users/:userId"
          element={
            <AdminRoute>
              <UserDetails />
            </AdminRoute>
          }
        />
          <Route path="/" element={<Navigate to="/dashboard" />} />

        </Routes>

      </Router>

      <Toaster position="top-right" />
    </>
  );
}

export default App;