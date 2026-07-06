import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
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
    </>
  );
};

// Landing Page Component
const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ maxWidth: '800px', animation: 'fadeIn 0.6s ease' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '9999px', color: '#a78bfa', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px' }}>
          <Sparkles size={14} />
          <span>AI-Powered & Professional Resume Templates</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.8rem', lineHeight: '1.1', fontWeight: '800', marginBottom: '24px', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Create Job-Winning Resumes in Minutes
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
          Build tailored resumes featuring premium developer designs. Choose from beautifully curated color palettes, track multiple resumes, and share directly via email or PDF.
        </p>
        <div>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
              Go to Dashboard
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
                Build Your Resume Now
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Temp Placeholder Pages for subsequent phases
const DashboardPlaceholder = () => (
  <div className="container">
    <h2>Dashboard (Phase 2)</h2>
    <p style={{ color: 'var(--text-secondary)' }}>This view will contain your resume list and management interfaces.</p>
  </div>
);

const ProfilePlaceholder = () => (
  <div className="container">
    <h2>Profile (Phase 5)</h2>
    <p style={{ color: 'var(--text-secondary)' }}>This view will show account settings and payment history logs.</p>
  </div>
);

const UpgradePlaceholder = () => (
  <div className="container">
    <h2>Upgrade to Premium (Phase 5)</h2>
    <p style={{ color: 'var(--text-secondary)' }}>This view will manage payment checkout and membership upgrades.</p>
  </div>
);

const EditorPlaceholder = () => (
  <div className="container">
    <h2>Resume Editor (Phase 3)</h2>
    <p style={{ color: 'var(--text-secondary)' }}>This view will render the split-screen resume builder interface.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePlaceholder /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><UpgradePlaceholder /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><EditorPlaceholder /></ProtectedRoute>} />
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
