import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Template01, Template02, Template03, DEFAULT_SAMPLE_DATA } from '../components/ResumeThemes';
import html2pdf from 'html2pdf.js';
import EmailModal from '../components/EmailModal';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Download,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  LayoutGrid,
  X
} from 'lucide-react';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Save States
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const saveTimeoutRef = useRef(null);

  // Accordion active sections
  const [activeSections, setActiveSections] = useState({
    theme: true,
    profile: false,
    contact: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
    interests: false
  });

  // Premium template lock modal state
  const [showPremiumLock, setShowPremiumLock] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // File uploading states
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // Email Sharing Modal
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Finished Template Gallery Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryTheme, setSelectedGalleryTheme] = useState('01');

  // PDF download logic
  const handleDownloadPdf = async () => {
    const element = document.querySelector('.print-canvas');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${resumeData.title || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    setSaveStatus('saving');
    try {
      await html2pdf().from(element).set(opt).save();
      setSaveStatus('saved');
    } catch (err) {
      console.error("PDF generation failed:", err);
      setSaveStatus('error');
    }
  };

  // Fetch initial resume data and subscription info
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const [resumeRes, templatesRes] = await Promise.all([
          api.get(`/api/resumes/${id}`),
          api.get('/api/templates')
        ]);

        // Initialize default nested structures if not present on backend
        const resData = resumeRes.data;
        const completeData = {
          ...resData,
          template: resData.template || { theme: '01', colorPalette: ['#8b5cf6'] },
          profileInfo: resData.profileInfo || { fullName: '', designation: '', summary: '', profilePreviewUrl: '' },
          contactInfo: resData.contactInfo || { email: '', phone: '', location: '', linkedIn: '', github: '', website: '' },
          workExperience: resData.workExperience || [],
          education: resData.education || [],
          skills: resData.skills || [],
          projects: resData.projects || [],
          certifications: resData.certifications || [],
          languages: resData.languages || [],
          interests: resData.interests || []
        };

        setResumeData(completeData);
        setIsPremium(templatesRes.data?.isPremium || false);
      } catch (err) {
        console.error("Failed to load resume:", err);
        setError("Failed to load resume. It might not exist or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback((updatedData) => {
    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.put(`/api/resumes/${id}`, updatedData);
        setSaveStatus('saved');
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus('error');
      }
    }, 1500); // 1.5 seconds debounce
  }, [id]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Update resume data fields
  const handleFieldChange = (section, field, value) => {
    setResumeData(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setResumeData(prev => {
      const updated = { ...prev, title: val };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const handleThemeChange = (themeId) => {
    if (themeId !== '01' && !isPremium) {
      setShowPremiumLock(true);
      return;
    }
    setResumeData(prev => {
      const updated = {
        ...prev,
        template: {
          ...prev.template,
          theme: themeId
        }
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setResumeData(prev => {
      const updated = {
        ...prev,
        template: {
          ...prev.template,
          colorPalette: [color]
        }
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Upload Profile Image specific to this resume
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingProfile(true);
    setSaveStatus('saving');

    try {
      const res = await api.put(`/api/resumes/${id}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrl = res.data.profilePreviewUrl || res.data.profileImageUrl || res.data.imageUrl;
      setResumeData(prev => {
        const updated = {
          ...prev,
          profileInfo: {
            ...prev.profileInfo,
            profilePreviewUrl: uploadedUrl
          }
        };
        // Auto-save the updated state to sync with db
        api.put(`/api/resumes/${id}`, updated);
        return updated;
      });
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setUploadingProfile(false);
    }
  };

  // Generic array item modifiers
  const addArrayItem = (section, defaultObj) => {
    setResumeData(prev => {
      const updated = {
        ...prev,
        [section]: [...prev[section], defaultObj]
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const updateArrayItem = (section, index, field, value) => {
    setResumeData(prev => {
      const newList = [...prev[section]];
      newList[index] = { ...newList[index], [field]: value };
      const updated = { ...prev, [section]: newList };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const deleteArrayItem = (section, index) => {
    setResumeData(prev => {
      const updated = {
        ...prev,
        [section]: prev[section].filter((_, idx) => idx !== index)
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Interest list helpers (String lists)
  const addInterest = (val) => {
    if (!val.trim()) return;
    setResumeData(prev => {
      const updated = {
        ...prev,
        interests: [...prev.interests, val.trim()]
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  const deleteInterest = (index) => {
    setResumeData(prev => {
      const updated = {
        ...prev,
        interests: prev.interests.filter((_, idx) => idx !== index)
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Toggle sections of Accordion
  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Render proper live preview based on selected template
  const renderPreview = () => {
    if (!resumeData) return null;
    const selectedTheme = resumeData.template?.theme || '01';
    const accentColor = resumeData.template?.colorPalette?.[0] || '#8b5cf6';

    switch (selectedTheme) {
      case '02':
        return <Template02 data={resumeData} accentColor={accentColor} />;
      case '03':
        return <Template03 data={resumeData} accentColor={accentColor} />;
      case '01':
      default:
        return <Template01 data={resumeData} accentColor={accentColor} />;
    }
  };

  // Save manual trigger
  const handleManualSave = async () => {
    setSaveStatus('saving');
    try {
      await api.put(`/api/resumes/${id}`, resumeData);
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <XCircle size={60} style={{ color: 'var(--error)', margin: '0 auto 24px' }} />
        <h2 style={{ marginBottom: '16px' }}>Error</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{error}</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flex: '1', height: 'calc(100vh - 64px)', minHeight: 0, overflow: 'hidden' }}>

      {/* LEFT PANEL: Collapsible Input Accordion Form */}
      <div style={{ width: '480px', minWidth: '400px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)', height: '100%' }}>
        {/* Editor Sub-Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', marginRight: '16px' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }} title="Back to Dashboard">
              <ArrowLeft size={20} />
            </Link>
            <input
              type="text"
              value={resumeData.title}
              onChange={handleTitleChange}
              style={{ background: 'transparent', border: 'none', borderBottom: '1.5px solid transparent', fontSize: '1.1rem', fontWeight: '600', color: '#fff', padding: '2px 4px', width: '100%', outline: 'none' }}
              onFocus={(e) => e.target.style.borderBottomColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Auto Save State indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {saveStatus === 'saving' && (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                  <span>Draft Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <XCircle size={14} style={{ color: 'var(--error)' }} />
                  <span>Save Error</span>
                </>
              )}
            </div>
            <button onClick={handleManualSave} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Save Now">
              <Save size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ flex: '1', overflowY: 'auto', padding: '20px' }}>

          {/* 1. Theme Selection Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('theme')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>1. Layout & Styling</span>
              {activeSections.theme ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.theme && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Theme Template</label>
                    <button
                      type="button"
                      onClick={() => setShowGalleryModal(true)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                    >
                      <Eye size={14} />
                      <span>View Gallery Preview</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: '01', title: 'Template 01', tag: 'Classic', color: '#8b5cf6', isLock: false },
                      { id: '02', title: 'Template 02', tag: 'Creative', color: '#10b981', isLock: !isPremium },
                      { id: '03', title: 'Template 03', tag: 'Executive', color: '#b45309', isLock: !isPremium }
                    ].map(t => {
                      const isSelected = resumeData.template.theme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleThemeChange(t.id)}
                          style={{
                            border: isSelected ? `2px solid ${t.color}` : '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 8px',
                            background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {t.isLock && (
                            <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', padding: '3px', borderRadius: '50%' }}>
                              <Lock size={10} style={{ color: '#fbbf24' }} />
                            </div>
                          )}

                          {/* Mini visual diagram representation */}
                          <div style={{ width: '100%', height: '54px', background: '#fff', borderRadius: '4px', padding: '5px', overflow: 'hidden', display: 'flex', flexDirection: t.id === '02' ? 'row' : 'column', gap: '3px', border: '1px solid #ddd' }}>
                            {t.id === '01' && (
                              <>
                                <div style={{ height: '8px', background: t.color, borderRadius: '1px', width: '55%' }} />
                                <div style={{ height: '3px', background: '#e2e8f0', width: '100%' }} />
                                <div style={{ height: '3px', background: '#cbd5e1', width: '80%' }} />
                                <div style={{ flex: 1, display: 'flex', gap: '3px', marginTop: '3px' }}>
                                  <div style={{ flex: 1, background: '#f1f5f9' }} />
                                  <div style={{ flex: 1, background: '#f1f5f9' }} />
                                </div>
                              </>
                            )}
                            {t.id === '02' && (
                              <>
                                <div style={{ width: '32%', background: '#1e293b', borderRadius: '1px', display: 'flex', flexDirection: 'column', gap: '2px', padding: '2px' }}>
                                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color, margin: '0 auto' }} />
                                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.4)' }} />
                                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.3)' }} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '2px' }}>
                                  <div style={{ height: '6px', background: '#e2e8f0', width: '70%' }} />
                                  <div style={{ height: '3px', background: '#f1f5f9' }} />
                                  <div style={{ height: '3px', background: '#f1f5f9' }} />
                                </div>
                              </>
                            )}
                            {t.id === '03' && (
                              <>
                                <div style={{ height: '16px', background: '#f8fafc', borderBottom: `2px solid ${t.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{ height: '4px', background: '#334155', width: '50%' }} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '2px' }}>
                                  <div style={{ height: '3px', background: '#e2e8f0', width: '90%' }} />
                                  <div style={{ height: '3px', background: '#f1f5f9', width: '100%' }} />
                                </div>
                              </>
                            )}
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>{t.title}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{t.tag}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Accent Palette</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="color"
                      value={resumeData.template.colorPalette?.[0] || '#8b5cf6'}
                      onChange={handleColorChange}
                      style={{ border: 'none', background: 'transparent', width: '48px', height: '40px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Selected: {resumeData.template.colorPalette?.[0] || '#8b5cf6'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Profile Info Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('profile')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>2. Profile Info</span>
              {activeSections.profile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.profile && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Profile Image upload specifically for this resume */}
                <div className="form-group" style={{ alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px dashed var(--border-color)', overflow: 'hidden' }}>
                    {resumeData.profileInfo.profilePreviewUrl ? (
                      <img src={resumeData.profileInfo.profilePreviewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : uploadingProfile ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <ImageIcon size={18} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </div>
                  <label className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', marginTop: '6px' }}>
                    <span>{uploadingProfile ? 'Uploading...' : 'Resume Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: 'none' }} disabled={uploadingProfile} />
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    value={resumeData.profileInfo.fullName}
                    onChange={(e) => handleFieldChange('profileInfo', 'fullName', e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="designation">Designation</label>
                  <input
                    id="designation"
                    type="text"
                    className="form-input"
                    value={resumeData.profileInfo.designation}
                    onChange={(e) => handleFieldChange('profileInfo', 'designation', e.target.value)}
                    placeholder="Senior Fullstack Architect"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="summary">Summary</label>
                  <textarea
                    id="summary"
                    className="form-input"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    value={resumeData.profileInfo.summary}
                    onChange={(e) => handleFieldChange('profileInfo', 'summary', e.target.value)}
                    placeholder="Describe your credentials and highlights..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Contact Info Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('contact')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>3. Contact Details</span>
              {activeSections.contact ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.contact && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['email', 'phone', 'location', 'linkedIn', 'github', 'website'].map(field => (
                  <div className="form-group" key={field}>
                    <label className="form-label" style={{ textTransform: 'capitalize' }}>{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      className="form-input"
                      value={resumeData.contactInfo[field] || ''}
                      onChange={(e) => handleFieldChange('contactInfo', field, e.target.value)}
                      placeholder={`your ${field}...`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Work Experience Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('experience')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>4. Work Experience</span>
              {activeSections.experience ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.experience && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    <button type="button" onClick={() => deleteArrayItem('workExperience', index)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '12px' }}>Position #{index + 1}</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Company"
                        className="form-input"
                        value={exp.company || ''}
                        onChange={(e) => updateArrayItem('workExperience', index, 'company', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Role / Title"
                        className="form-input"
                        value={exp.role || ''}
                        onChange={(e) => updateArrayItem('workExperience', index, 'role', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Start Date (e.g. Oct 2024)"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={exp.startDate || ''}
                          onChange={(e) => updateArrayItem('workExperience', index, 'startDate', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="End Date (e.g. Present)"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={exp.endDate || ''}
                          onChange={(e) => updateArrayItem('workExperience', index, 'endDate', e.target.value)}
                        />
                      </div>
                      <textarea
                        placeholder="Job description & achievements..."
                        className="form-input"
                        style={{ minHeight: '80px', resize: 'vertical' }}
                        value={exp.description || ''}
                        onChange={(e) => updateArrayItem('workExperience', index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem('workExperience', { company: '', role: '', startDate: '', endDate: '', description: '' })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Add Work Experience</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Education Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('education')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>5. Education</span>
              {activeSections.education ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.education && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resumeData.education.map((edu, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    <button type="button" onClick={() => deleteArrayItem('education', index)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '12px' }}>Education #{index + 1}</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Degree / Certificate"
                        className="form-input"
                        value={edu.degree || ''}
                        onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Institution / School"
                        className="form-input"
                        value={edu.institution || ''}
                        onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Start Date"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={edu.startDate || ''}
                          onChange={(e) => updateArrayItem('education', index, 'startDate', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="End Date"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={edu.endDate || ''}
                          onChange={(e) => updateArrayItem('education', index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem('education', { degree: '', institution: '', startDate: '', endDate: '' })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Add Education</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. Skills Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('skills')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>6. Skills</span>
              {activeSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.skills && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {resumeData.skills.map((skill, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. React)"
                      className="form-input"
                      style={{ flex: '2', padding: '8px 12px', fontSize: '0.85rem' }}
                      value={skill.name || ''}
                      onChange={(e) => updateArrayItem('skills', index, 'name', e.target.value)}
                    />

                    {/* CRITICAL: Backend fields map to Progress with CAPITAL 'P'! */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1.5' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        style={{ width: '100%' }}
                        value={skill.Progress || 0}
                        onChange={(e) => updateArrayItem('skills', index, 'Progress', parseInt(e.target.value))}
                      />
                      <span style={{ fontSize: '0.8rem', minWidth: '32px' }}>{skill.Progress || 0}%</span>
                    </div>

                    <button type="button" onClick={() => deleteArrayItem('skills', index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem('skills', { name: '', Progress: 80 })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Add Skill</span>
                </button>
              </div>
            )}
          </div>

          {/* 7. Projects Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('projects')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>7. Projects</span>
              {activeSections.projects ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.projects && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resumeData.projects.map((proj, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    <button type="button" onClick={() => deleteArrayItem('projects', index)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '12px' }}>Project #{index + 1}</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Project Title"
                        className="form-input"
                        value={proj.title || ''}
                        onChange={(e) => updateArrayItem('projects', index, 'title', e.target.value)}
                      />
                      <textarea
                        rows={3}
                        placeholder="Project Description (Press Enter for new line / bullet points)..."
                        className="form-input"
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                        value={proj.description || ''}
                        onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="GitHub Link"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={proj.github || ''}
                          onChange={(e) => updateArrayItem('projects', index, 'github', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Live Demo Link"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={proj.liveDemo || ''}
                          onChange={(e) => updateArrayItem('projects', index, 'liveDemo', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem('projects', { title: '', description: '', github: '', liveDemo: '' })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Add Project</span>
                </button>
              </div>
            )}
          </div>

          {/* 8. Certifications Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('certifications')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>8. Certifications</span>
              {activeSections.certifications ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.certifications && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    <button type="button" onClick={() => deleteArrayItem('certifications', index)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Certification Title"
                        className="form-input"
                        value={cert.title || ''}
                        onChange={(e) => updateArrayItem('certifications', index, 'title', e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Issuer / Authority"
                          className="form-input"
                          style={{ flex: '2' }}
                          value={cert.issuer || ''}
                          onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          className="form-input"
                          style={{ flex: '1' }}
                          value={cert.year || ''}
                          onChange={(e) => updateArrayItem('certifications', index, 'year', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem('certifications', { title: '', issuer: '', year: '' })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Add Certification</span>
                </button>
              </div>
            )}
          </div>

          {/* 9. Languages Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('languages')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>9. Languages</span>
              {activeSections.languages ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.languages && (
              <div className="animate-fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {resumeData.languages.map((lang, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <input
                      type="text"
                      placeholder="Language (e.g. English)"
                      className="form-input"
                      style={{ flex: '2', padding: '8px 12px', fontSize: '0.85rem' }}
                      value={lang.name || ''}
                      onChange={(e) => updateArrayItem('languages', index, 'name', e.target.value)}
                    />

                    {/* CRITICAL: Backend fields map to Progress with CAPITAL 'P'! */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1.5' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        style={{ width: '100%' }}
                        value={lang.Progress || 0}
                        onChange={(e) => updateArrayItem('languages', index, 'Progress', parseInt(e.target.value))}
                      />
                      <span style={{ fontSize: '0.8rem', minWidth: '32px' }}>{lang.Progress || 0}%</span>
                    </div>

                    <button type="button" onClick={() => deleteArrayItem('languages', index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem('languages', { name: '', Progress: 100 })}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Add Language</span>
                </button>
              </div>
            )}
          </div>

          {/* 10. Interests Accordion */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => toggleSection('interests')} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>10. Interests</span>
              {activeSections.interests ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {activeSections.interests && (
              <div className="animate-fade-in" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    id="new-interest"
                    placeholder="e.g. Open Source, Hiking"
                    className="form-input"
                    style={{ flex: '1', padding: '10px 16px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('new-interest');
                      if (el) {
                        addInterest(el.value);
                        el.value = '';
                      }
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 16px' }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {resumeData.interests.map((interest, index) => (
                    <span
                      key={index}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => deleteInterest(index)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', color: 'var(--text-secondary)' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT PANEL: Live Paper Preview & Action Strip */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', height: '100%', position: 'relative' }}>

        {/* Actions Toolbar Strip */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,11,16,0.6)', backdropFilter: 'blur(8px)', zIndex: '10' }}>
          <h2 style={{ fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} />
            <span>Live Preview</span>
          </h2>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Download/Export Button */}
            <button
              onClick={handleDownloadPdf}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            {/* Email Share modal trigger */}
            <button
              onClick={() => setShowEmailModal(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Mail size={14} />
              <span>Email Resume</span>
            </button>
          </div>
        </div>

        {/* Scrollable Preview Canvas */}
        <div style={{ flex: '1', overflowY: 'auto', padding: '32px 16px 120px 16px', background: '#13151c' }}>
          {/* Printable Page Container */}
          <div className="print-canvas" style={{ width: '794px', minHeight: '1123px', margin: '0 auto 100px auto', boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)', borderRadius: '4px', background: '#fff', boxSizing: 'border-box' }}>
            {renderPreview()}
          </div>
        </div>
      </div>

      {/* Premium Locking Dialog Alert Modal */}
      {showPremiumLock && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '250' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '420px', padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(217, 70, 239, 0.1)', color: 'var(--accent)', marginBottom: '20px' }}>
              <Lock size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '10px' }}>Unlock Premium Layout</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '28px' }}>
              Template 02 and 03 are available exclusively for Premium members. Upgrade your account today to unlock all templates, custom color palettes, and priority support.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/upgrade" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Sparkles size={16} />
                <span>Upgrade for Premium Templates</span>
              </Link>
              <button onClick={() => setShowPremiumLock(false)} className="btn btn-secondary">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Email Sharing Modal */}
      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          resumeTitle={resumeData.title}
        />
      )}

      {/* Finished CV Template Gallery Modal */}
      {showGalleryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '24px' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '1240px', height: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '24px', border: '1px solid var(--border-color)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LayoutGrid size={22} style={{ color: 'var(--primary)' }} />
                  <span>Finished CV Template Showcase</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '3px' }}>
                  Select a template on the left to inspect the full high-resolution completed resume preview.
                </p>
              </div>
              <button
                onClick={() => setShowGalleryModal(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Content Split Area */}
            <div style={{ flex: 1, display: 'flex', gap: '20px', overflow: 'hidden', minHeight: 0 }}>

              {/* Left Selector Sidebar */}
              <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                {[
                  { id: '01', title: 'Template 01', name: 'Classic Minimalist', tag: 'Single-Column Layout', desc: 'Clean margins, bold section headings, ideal for corporate and traditional roles.', color: '#8b5cf6', isLocked: false },
                  { id: '02', title: 'Template 02', name: 'Creative Modern', tag: 'Two-Column Layout', desc: 'Features a dark slate sidebar with progress bars, great for tech and design.', color: '#10b981', isLocked: !isPremium },
                  { id: '03', title: 'Template 03', name: 'Executive Elegant', tag: 'Top Centered Banner', desc: 'Centered header banner with classic serif typography, perfect for senior roles.', color: '#b45309', isLocked: !isPremium }
                ].map(item => {
                  const isInspecting = selectedGalleryTheme === item.id;
                  const isCurrentActive = resumeData.template?.theme === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedGalleryTheme(item.id)}
                      style={{
                        border: isInspecting ? `2px solid ${item.color}` : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        background: isInspecting ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-secondary)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: item.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.tag}</div>
                          <h3 style={{ fontSize: '1.05rem', color: '#fff', marginTop: '2px' }}>{item.name}</h3>
                        </div>
                        {isCurrentActive && (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            Current
                          </span>
                        )}
                        {item.isLocked && !isCurrentActive && (
                          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                            <Lock size={10} />
                            <span>Premium</span>
                          </div>
                        )}
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>{item.desc}</p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleThemeChange(item.id);
                          if (!item.isLocked) setShowGalleryModal(false);
                        }}
                        className={`btn ${isCurrentActive ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ width: '100%', padding: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
                      >
                        {item.isLocked ? (
                          <>
                            <Lock size={14} />
                            <span>Unlock Premium {item.title}</span>
                          </>
                        ) : isCurrentActive ? (
                          <>
                            <CheckCircle size={14} />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Use {item.title}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Right Large Preview Area */}
              <div style={{ flex: 1, background: '#0a0b10', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowY: 'auto', padding: '32px 16px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ width: '800px', transform: 'scale(0.72)', transformOrigin: 'top center', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)', borderRadius: '4px', overflow: 'hidden' }}>
                  {selectedGalleryTheme === '01' && <Template01 data={DEFAULT_SAMPLE_DATA} accentColor="#8b5cf6" />}
                  {selectedGalleryTheme === '02' && <Template02 data={DEFAULT_SAMPLE_DATA} accentColor="#10b981" />}
                  {selectedGalleryTheme === '03' && <Template03 data={DEFAULT_SAMPLE_DATA} accentColor="#b45309" />}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
