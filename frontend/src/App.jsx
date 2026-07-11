import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import Profile from './pages/Profile';
import Upgrade from './pages/Upgrade';
import Landing from './pages/Landing';
import About from './pages/About';
import Footer from './components/Footer';
import { LogOut, FileText, User as UserIcon, Loader2, Sparkles, CreditCard } from 'lucide-react';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Navbar/Layout Wrapper
const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          ResumeCraft
        </Link>
        <div className="nav-links">
          <Link to="/about" className="nav-link">About</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
              <Link to="/upgrade" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
                <Sparkles size={16} />
                <span>Premium</span>
              </Link>
              <div className="user-badge">
                {user?.profileImageUrl && (
                  <img src={user.profileImageUrl} alt="avatar" className="user-avatar" />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Get Started</Link>
            </>
          )}
        </div>
      </nav>
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
