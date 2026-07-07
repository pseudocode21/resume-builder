import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Shield, CreditCard, Loader2, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch payment logs on load
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/payment/history');
        setPayments(res.data || []);
      } catch (err) {
        console.error("Failed to load payment logs:", err);
        setError("Could not load payment history details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const formatAmount = (amount, currency) => {
    if (!amount) return '₹0.00';
    // Razorpay amounts are represented in currency subunit (paise)
    const formatted = (amount / 100).toFixed(2);
    const sym = currency === 'INR' ? '₹' : currency || '$';
    return `${sym}${formatted}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      
      {/* Navigation */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* User Information Card */}
      <div className="glass-panel" style={{ display: 'flex', gap: '30px', alignItems: 'center', padding: '36px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={48} style={{ color: 'var(--text-tertiary)' }} />
          )}
        </div>

        <div style={{ flex: '1', minWidth: '240px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '4px' }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>{user?.email}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              padding: '4px 12px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              fontWeight: '700',
              background: user?.subscriptionPlan === 'premium' ? 'rgba(217, 70, 239, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: '1.5px solid',
              borderColor: user?.subscriptionPlan === 'premium' ? 'var(--accent)' : 'var(--border-color)',
              color: user?.subscriptionPlan === 'premium' ? 'var(--accent)' : 'var(--text-secondary)'
            }}>
              Plan: {user?.subscriptionPlan || 'basic'}
            </span>

            {user?.subscriptionPlan !== 'premium' && (
              <Link to="/upgrade" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Payment History Log */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={20} style={{ color: 'var(--primary)' }} />
          <span>Billing History</span>
        </h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)' }} />
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No payment history found. If you upgrade your account, invoices will appear here.
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Order ID</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const payId = p._id || p.id;
                    const isPaid = p.status?.toLowerCase() === 'paid' || p.status?.toLowerCase() === 'success';
                    const isFailed = p.status?.toLowerCase() === 'failed';
                    
                    return (
                      <tr key={payId} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 20px', color: 'var(--text-primary)' }}>{formatDate(p.createdAt)}</td>
                        <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{p.razorpayOrderId}</td>
                        <td style={{ padding: '16px 20px', color: '#fff', fontWeight: 'bold' }}>{formatAmount(p.amount, p.currency)}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: isPaid ? 'rgba(16, 185, 129, 0.1)' : isFailed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: isPaid ? '#34d399' : isFailed ? '#fca5a5' : '#fbbf24',
                            border: '1px solid',
                            borderColor: isPaid ? 'rgba(16, 185, 129, 0.2)' : isFailed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                          }}>
                            {isPaid ? <CheckCircle size={12} /> : isFailed ? <AlertCircle size={12} /> : <Clock size={12} />}
                            <span style={{ textTransform: 'capitalize' }}>{p.status || 'Created'}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
