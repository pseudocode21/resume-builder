import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Check, Loader2, CreditCard, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const Upgrade = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPremium = user?.subscriptionPlan === 'premium' || user?.subscriptionPlan === 'PREMIUM';

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Request Order ID from the server
      const res = await api.post('/api/payment/create-order', { planType: 'premium' });
      const { orderId, amount, currency } = res.data;

      // Step 2: Configure Razorpay Checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_default_key', // Fallback for Sandbox
        amount: amount, 
        currency: currency,
        name: 'ResumeCraft',
        description: 'Upgrade to Premium Membership',
        order_id: orderId,
        handler: async function (response) {
          setLoading(true);
          try {
            // Step 3: Verify Payment signature on the backend
            const verifyRes = await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.status === 'success' || verifyRes.data.message?.includes('Verified')) {
              // Refresh profile details to update subscriptionPlan status
              await refreshProfile();
              navigate('/dashboard');
            } else {
              setError('Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error(verifyErr);
            setError(verifyErr.response?.data?.message || 'Verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8b5cf6',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Step 4: Open Razorpay Popup
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to initialize payment order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#fff' }}>Upgrade Your Resume Game</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Get full access to professional themes, advanced formatting features, and unlimited resume exports.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '32px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'stretch', marginBottom: '48px' }}>
        
        {/* Basic Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '36px 30px', position: 'relative' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Basic Plan</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff' }}>Free</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px', flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Access to Template 01 (Minimalist)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Standard Form Sections</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Client-side PDF Download</span>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
            Current Active Plan
          </button>
        </div>

        {/* Premium Plan Card */}
        <div className="glass-panel" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '36px 30px', 
          border: '2px solid var(--primary)', 
          boxShadow: '0 8px 30px rgba(139, 92, 246, 0.25)', 
          position: 'relative' 
        }}>
          <div style={{ position: 'absolute', top: '16px', right: '20px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Popular
          </div>
          
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
            <span>Premium Plan</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff' }}>₹499</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/ one-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px', flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span><strong>Unlock Template 02 & 03</strong> (Modern layouts)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Unlimited Resume Creations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Custom Brand Color Palettes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Email sharing client integrations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Check size={16} style={{ color: 'var(--success)' }} />
              <span>Priority Customer Support</span>
            </div>
          </div>

          {isPremium ? (
            <button className="btn btn-secondary" style={{ width: '100%', color: 'var(--success)' }} disabled>
              <ShieldCheck size={18} />
              <span>Premium Active</span>
            </button>
          ) : (
            <button 
              onClick={handleUpgrade} 
              className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Upgrade Now</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
        <span>Secured checkout powered by Razorpay. Cancel anytime.</span>
      </div>

    </div>
  );
};

export default Upgrade;
