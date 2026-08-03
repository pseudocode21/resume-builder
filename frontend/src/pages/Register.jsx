import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { UserPlus, Mail, Lock, User, Upload, Loader, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { signInWithGoogle } = await import('../config/firebase');
      const { idToken } = await signInWithGoogle();
      await googleLogin(idToken);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileImageUrl(res.data.imageUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (name.length < 4 || name.length > 15) {
      setError('Name must be between 4 and 15 characters.');
      return;
    }

    if (password.length < 6 || password.length > 15) {
      setError('Password must be between 6 and 15 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await registerUser(name, email, password, profileImageUrl);
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Registration successful! Please check your email to verify your account before logging in.' } 
      });
    } catch (err) {
      console.error(err);
      const backendErrors = err.response?.data?.errors;
      let errMsg = 'Failed to register account.';
      
      if (typeof backendErrors === 'object') {
        // Collect map errors (e.g. name: validation message)
        errMsg = Object.values(backendErrors).join(', ');
      } else {
        errMsg = err.response?.data?.errors || err.response?.data?.message || errMsg;
      }
      
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Get started building professional resumes</p>
        </div>

        {error && (
          <div className="alert alert-error animate-fade-in">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className="form-group" style={{ alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', overflow: 'hidden' }}>
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : uploading ? (
                <Loader className="animate-spin" size={24} style={{ color: 'var(--primary)' }} />
              ) : (
                <Upload size={24} style={{ color: 'var(--text-tertiary)' }} />
              )}
            </div>
            <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', marginTop: '8px' }}>
              <span>{profileImageUrl ? 'Change Picture' : 'Upload Picture'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
              <input
                id="name"
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${loading || uploading ? 'btn-disabled' : ''}`} 
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading || uploading}
          >
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <>
                <UserPlus size={18} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 12px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleSignIn}
          className="btn" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={loading || uploading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
