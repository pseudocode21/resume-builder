import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Loader2, 
  FileText,
  Mail,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Subscription info from template endpoint
  const [subscription, setSubscription] = useState({
    subscriptionPlan: 'basic',
    isPremium: false,
    availableTemplates: ['01'],
  });

  // Modal states for creating resume
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Delete resume confirmation states
  const [deletingId, setDeletingId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch resumes and template/subscription info
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [resumesRes, templatesRes] = await Promise.all([
          api.get('/api/resumes'),
          api.get('/api/templates')
        ]);
        
        setResumes(resumesRes.data || []);
        setSubscription(templatesRes.data || {
          subscriptionPlan: 'basic',
          isPremium: false,
          availableTemplates: ['01'],
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle resume creation
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreateLoading(true);
    setCreateError('');

    try {
      const res = await api.post('/api/resumes', { title: newTitle });
      const createdResume = res.data;
      
      // Close modal and navigate to the editor
      setShowCreateModal(false);
      navigate(`/editor/${createdResume._id || createdResume.id}`);
    } catch (err) {
      console.error(err);
      setCreateError(err.response?.data?.errors || err.response?.data?.message || 'Failed to create resume.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle resume deletion
  const handleDeleteResume = async (id) => {
    try {
      await api.delete(`/api/resumes/${id}`);
      setResumes(resumes.filter(r => (r._id || r.id) !== id));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete resume. Please try again.");
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      {/* Upper Status Bar / Subscription Alert */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Hello, {user?.name}! 
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage, customize, and share your professional resumes.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '8px 16px', background: subscription.isPremium ? 'rgba(217, 70, 239, 0.1)' : 'rgba(255, 255, 255, 0.04)', border: '1px solid', borderColor: subscription.isPremium ? 'rgba(217, 70, 239, 0.2)' : 'var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', tracking: '0.1em', color: subscription.isPremium ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 'bold' }}>
              Plan: {subscription.subscriptionPlan}
            </span>
          </div>
          {!subscription.isPremium && (
            <Link to="/upgrade" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Sparkles size={14} />
              <span>Upgrade to Premium</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '32px' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Resumes Grid Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>My Resumes</h2>
        <button 
          onClick={() => {
            setNewTitle('');
            setCreateError('');
            setShowCreateModal(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Create New</span>
        </button>
      </div>

      {/* Grid List */}
      {resumes.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FileText size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No resumes found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '24px', fontSize: '0.95rem' }}>
            Get started by creating your first resume. Choose from our professional developer layouts.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Create New Resume</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {resumes.map((resume) => {
            const resumeId = resume._id || resume.id;
            return (
              <div key={resumeId} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', height: '100%' }}>
                {/* Card Thumbnail Area */}
                <div style={{ 
                  height: '160px', 
                  width: '100%', 
                  background: resume.thumbnailLink ? `url(${resume.thumbnailLink})` : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(217, 70, 239, 0.15) 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {!resume.thumbnailLink && (
                    <FileText size={40} style={{ color: 'var(--primary)', opacity: '0.5' }} />
                  )}
                  {resume.template?.theme && (
                    <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Template {resume.template.theme}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {resume.title}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>
                    <Clock size={12} />
                    <span>Edited {formatDate(resume.updatedAt)}</span>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <Link 
                      to={`/editor/${resumeId}`} 
                      className="btn btn-secondary" 
                      style={{ flex: '1', padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </Link>
                    
                    <button 
                      onClick={() => setDeletingId(resumeId)} 
                      className="btn btn-danger" 
                      style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete Resume"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog Modal */}
      {deletingId && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '200' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <AlertTriangle size={24} style={{ color: 'var(--error)', flexShrink: '0' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Delete Resume</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', lineHeight: '1.4' }}>
                  Are you sure you want to delete this resume? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setDeletingId(null)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteResume(deletingId)} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Resume Dialog Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '200' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '95%', maxWidth: '440px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Create New Resume</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Enter a title for your resume (e.g., "Fullstack Dev Resume 2026").
            </p>

            {createError && (
              <div className="alert alert-error" style={{ marginBottom: '16px', padding: '8px 12px' }}>
                <span style={{ fontSize: '0.85rem' }}>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateResume}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="title">Resume Title</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Frontend Engineer Profile"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={50}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn btn-primary ${createLoading ? 'btn-disabled' : ''}`}
                  style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <span>Create</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
