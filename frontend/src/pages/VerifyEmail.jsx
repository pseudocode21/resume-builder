import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing in the link.');
        return;
      }

      try {
        const res = await api.get(`/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully!');
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage(err.response?.data?.errors || err.response?.data?.message || 'Email verification failed or token is expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
        {status === 'verifying' && (
          <div>
            <Loader2 className="animate-spin" size={60} style={{ color: 'var(--primary)', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Verifying your Email</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please wait a moment while we process your request...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle2 size={60} style={{ color: 'var(--success)', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#fff' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle size={60} style={{ color: 'var(--error)', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#fff' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{message}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/resend-verification" className="btn btn-primary">
                Request New Verification Link
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
