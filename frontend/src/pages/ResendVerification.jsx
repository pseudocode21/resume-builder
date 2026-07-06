import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import { Mail, Send, Loader, ArrowLeft } from 'lucide-react';

const ResendVerification = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [status, setStatus] = useState(''); // 'success', 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/resend-verification', { email });
      setStatus('success');
      setMessage(res.data?.message || 'Verification email sent successfully.');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(err.response?.data?.errors || err.response?.data?.message || 'Failed to send verification email. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={18} />
          </Link>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Back to Login</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Resend Verification</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your email address to receive a new confirmation link</p>
        </div>

        {status === 'success' && (
          <div className="alert alert-success animate-fade-in">
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="alert alert-error animate-fade-in">
            <span>{message}</span>
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit}>
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

            <button 
              type="submit" 
              className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} 
              style={{ width: '100%', marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Link</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
