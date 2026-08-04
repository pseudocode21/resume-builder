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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

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
  const location = useLocation();
  const isEditorPage = location.pathname.startsWith('/editor');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: isEditorPage ? '100vh' : 'auto', minHeight: '100vh', overflow: isEditorPage ? 'hidden' : 'visible' }}>
      <Navbar />
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: isEditorPage ? 'hidden' : 'visible', minHeight: 0 }}>
        {children}
      </div>
      {!isEditorPage && <Footer />}
    </div>
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
