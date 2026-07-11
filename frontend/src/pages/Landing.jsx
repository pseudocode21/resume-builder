import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Zap,
  Layers,
  Mail,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeColor, setActiveColor] = useState('purple');

  // Interactive Theme Colors Configuration
  const themeColors = {
    purple: {
      primary: '#8b5cf6',
      bgLight: 'rgba(139, 92, 246, 0.15)',
      glow: 'rgba(139, 92, 246, 0.4)',
      badgeText: '#c084fc'
    },
    emerald: {
      primary: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.15)',
      glow: 'rgba(16, 185, 129, 0.4)',
      badgeText: '#34d399'
    },
    blue: {
      primary: '#3b82f6',
      bgLight: 'rgba(59, 130, 246, 0.15)',
      glow: 'rgba(59, 130, 246, 0.4)',
      badgeText: '#60a5fa'
    },
    rose: {
      primary: '#f43f5e',
      bgLight: 'rgba(244, 63, 94, 0.15)',
      glow: 'rgba(244, 63, 94, 0.4)',
      badgeText: '#f472b6'
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const currentTheme = themeColors[activeColor];

  // Dummy Reviews / Testimonials
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Software Engineer @ Google",
      text: "Got a Software Engineer interview at Meta just 3 days after applying with my new ResumeCraft CV! The formatting is flawless.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "David Chen",
      role: "Product Manager @ Stripe",
      text: "The live preview and auto-saving made this the easiest builder I have ever used. Swapping colors takes one click and looks gorgeous.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Alisha Patel",
      role: "UX Designer @ Airbnb",
      text: "The AI suggestions helped me structure my bullet points with strong action verbs. It completely transformed my design portfolio resume.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
    }
  ];

  // FAQ List
  const faqs = [
    {
      question: "Is ResumeCraft completely free to use?",
      answer: "Yes! We offer a full range of ATS-friendly templates and rich layout adjustments for free. We also feature a Premium tier containing advanced AI optimization suggestions and premium font selections."
    },
    {
      question: "Are the templates optimized for applicant tracking systems (ATS)?",
      answer: "Absolutely. All our resume designs follow strict parsing guidelines, clean headings, and linear layout flows that allow ATS tools to successfully read and grade your resume content."
    },
    {
      question: "Can I download my resume as a PDF or send it directly?",
      answer: "Yes, you can export and print your resume to a professional-grade PDF with clean page-breaks, or send it directly via email through our built-in email modal tool."
    },
    {
      question: "Can I create and manage multiple resumes?",
      answer: "Yes. From your dashboard, you can build, clone, and track separate resumes tailored for different jobs or roles, completely managing them side by side."
    }
  ];

  return (
    <div className="landing-wrapper animate-slide-up">
      {/* Background ambient lighting effects */}
      <div className="landing-glow-1"></div>
      <div className="landing-glow-2"></div>

      {/* Hero Section */}
      <section className="landing-section hero-container">
        <div className="hero-content">
          <div className="section-tag" style={{ marginBottom: '24px' }}>
            <Sparkles size={14} />
            <span>Premium AI Resume Architect</span>
          </div>
          <h1 className="hero-title">
            Build Resumes That Get You Hired.
          </h1>
          <p className="hero-description">
            Create recruiter-ready, ATS-optimized resumes in minutes. Swap styles, adjust color palettes, and share professionally using beautifully curated, modern developer templates.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
                  Build Resume Now <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <div className="hero-badge-list">
            <div className="hero-badge-item">
              <ShieldCheck size={16} />
              <span>ATS Friendly</span>
            </div>
            <div className="hero-badge-item">
              <Sparkles size={16} />
              <span>AI Assisted</span>
            </div>
            <div className="hero-badge-item">
              <Zap size={16} />
              <span>Instant PDF Export</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Theme Preview Visual */}
        <div className="hero-visual">
          <div className="visual-backdrop"></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
            {/* Interactive Resume Mockup Card */}
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-profile">
                  <span className="mockup-name" style={{ color: currentTheme.primary }}>
                    Alex Rivers
                  </span>
                  <span className="mockup-title">Senior Frontend Engineer</span>
                </div>
                <div className="mockup-badge" style={{ backgroundColor: currentTheme.bgLight, color: currentTheme.badgeText }}>
                  Active Candidate
                </div>
              </div>

              <div className="mockup-body">
                <div className="mockup-section">
                  <span className="mockup-section-title" style={{ color: currentTheme.primary }}>
                    Professional Summary
                  </span>
                  <p className="mockup-item-desc">
                    Experienced UI Architect specializing in React, TypeScript, and high-performance Web applications. Led developer teams at scale.
                  </p>
                </div>

                <div className="mockup-section">
                  <span className="mockup-section-title" style={{ color: currentTheme.primary }}>
                    Experience
                  </span>
                  <div className="mockup-item">
                    <div className="mockup-item-header">
                      <span>Lead UI Architect</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2024 - Pres.</span>
                    </div>
                    <p className="mockup-item-desc">
                      Built cloud interfaces reducing latency by 40%. Implemented responsive component libraries.
                    </p>
                  </div>
                </div>

                <div className="mockup-section">
                  <span className="mockup-section-title" style={{ color: currentTheme.primary }}>
                    Technical Skills
                  </span>
                  <div className="mockup-tags">
                    <span className="mockup-tag" style={{ borderColor: currentTheme.primary + '30', color: currentTheme.badgeText }}>React</span>
                    <span className="mockup-tag" style={{ borderColor: currentTheme.primary + '30', color: currentTheme.badgeText }}>TypeScript</span>
                    <span className="mockup-tag" style={{ borderColor: currentTheme.primary + '30', color: currentTheme.badgeText }}>Next.js</span>
                    <span className="mockup-tag" style={{ borderColor: currentTheme.primary + '30', color: currentTheme.badgeText }}>CSS Grid</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Theme Control Panel */}
            <div className="demo-controls">
              <span className="demo-controls-label">Interactive Colors</span>
              <div className="demo-color-picker">
                {Object.keys(themeColors).map((colorName) => (
                  <button
                    key={colorName}
                    onClick={() => setActiveColor(colorName)}
                    className={`color-btn ${activeColor === colorName ? 'active' : ''}`}
                    style={{
                      backgroundColor: themeColors[colorName].primary,
                      boxShadow: activeColor === colorName ? `0 0 12px ${themeColors[colorName].primary}` : 'none'
                    }}
                    title={`Preview ${colorName} theme`}
                    aria-label={`Preview ${colorName} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">15,000+</span>
            <span className="stat-label">Resumes Created</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">98.4%</span>
            <span className="stat-label">ATS Acceptance Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">&lt; 4 Mins</span>
            <span className="stat-label">Avg. Build Duration</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section">
        <div className="section-header">
          <div className="section-tag">
            <Zap size={14} />
            <span>Features</span>
          </div>
          <h2 className="section-title">Everything You Need To Succeed</h2>
          <p className="section-subtitle">
            Powering your job search with visual clarity, flexibility, and intelligent structure.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-container">
              <ShieldCheck size={24} />
            </div>
            <h3 className="feature-title">Recruiter Ready</h3>
            <p className="feature-description">
              Carefully formatted sections ensuring ATS parsers and hiring managers read your accomplishments clearly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <Layers size={24} />
            </div>
            <h3 className="feature-title">Dynamic Palette Customization</h3>
            <p className="feature-description">
              Choose from designer-curated dark/light-harmonious palettes to accent your experience with polished style.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <Mail size={24} />
            </div>
            <h3 className="feature-title">Direct Sharing & Email</h3>
            <p className="feature-description">
              Instantly share draft links or dispatch PDF copies directly to recruiters using the integrated email sender portal.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Reviews / Testimonials Section */}
      <section className="landing-section">
        <div className="section-header">
          <div className="section-tag">
            <Users size={14} />
            <span>Success Stories</span>
          </div>
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">
            Real feedback from professionals who accelerated their career progression with ResumeCraft.
          </p>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, idx) => (
            <div className="review-card" key={idx}>
              <div className="review-header">
                <div className="stars-container">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
              <div className="review-author">
                <img src={review.avatar} alt={review.name} className="author-avatar" />
                <div className="author-info">
                  <span className="author-name">{review.name}</span>
                  <span className="author-role">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="landing-section">
        <div className="section-header">
          <div className="section-tag">
            <Clock size={14} />
            <span>Help Desk</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find quick answers to common questions regarding template designs, exports, and accounts.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              key={index}
            >
              <button
                className="faq-header"
                onClick={() => toggleFaq(index)}
                aria-expanded={activeFaq === index}
              >
                <span className="faq-question">{faq.question}</span>
                <ChevronDown className="faq-icon" size={18} />
              </button>
              <div
                className="faq-body"
                style={{
                  maxHeight: activeFaq === index ? '200px' : '0px'
                }}
              >
                <div className="faq-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box Banner */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-content">
            <h2 className="cta-title">Upgrade Your Job Applications Today</h2>
            <p className="cta-desc">
              Join thousands of job seekers. Create, customize, and export professional templates designed to grab recruiters' attention instantly.
            </p>
          </div>
          <div className="cta-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 40px' }}>
                Access My Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 40px' }}>
                Get Started For Free
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
