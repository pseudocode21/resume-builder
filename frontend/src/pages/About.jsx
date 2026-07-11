import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Layers,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Code,
  ArrowRight
} from 'lucide-react';
import './About.css';
import profileImage from '../assets/profile_image.jpeg';

const About = () => {
  // Brand SVGs matching styling of Lucide Icons
  const githubIcon = (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  const linkedinIcon = (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );

  const pillars = [
    {
      title: "Recruiter-Approved Grids",
      desc: "Templates follow structured formatting guidelines. Standardized fonts and linear layouts ensure hiring managers scan your milestones in under 6 seconds.",
      icon: <Layers size={24} />
    },
    {
      title: "ATS-Compliant Parsing",
      desc: "Unlike graphic resume builders that export files as static images or complex tables, ResumeCraft compiles structured text PDFs that ATS screeners read flawlessly.",
      icon: <ShieldCheck size={24} />
    },
    {
      title: "Paywall-Free Generation",
      desc: "Design your profile, tweak accent colors, and print or share your resume instantly. No hidden subscription paywalls or surprise checkout windows.",
      icon: <Zap size={24} />
    }
  ];

  return (
    <div className="about-wrapper">
      <div className="about-glow"></div>

      {/* Hero Header */}
      <section className="about-hero">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', alignSelf: 'flex-start' }} className="nav-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="section-tag" style={{ marginTop: '20px' }}>
          <Sparkles size={14} />
          <span>About ResumeCraft</span>
        </div>
        <h1 className="about-hero-title">Create Resumes that Recruiters Read</h1>
        <p className="about-hero-subtitle">
          ResumeCraft was built to take the layout formatting struggle out of application building, providing structured developer templates optimized for recruiters and hiring systems.
        </p>
      </section>

      {/* Problem & Solution Columns */}
      <section className="landing-section">
        <div className="problem-solution-section">
          {/* Problem Card */}
          <div className="about-card-split">
            <h2 className="card-title">
              <AlertTriangle size={22} style={{ color: 'var(--warning)' }} />
              <span>The Formatting Paywall Problem</span>
            </h2>
            <p className="card-text">
              Most resume tools trap candidates in complex drag-and-drop sidebars where content overflows margins at random. Even worse, many popular online builders let you invest hours writing your cv, only to block exports behind credit-card subscription walls at the very last step.
            </p>
          </div>

          {/* Solution Card */}
          <div className="about-card-split">
            <h2 className="card-title">
              <CheckCircle2 size={22} style={{ color: 'var(--success)' }} />
              <span>Our Structured Approach</span>
            </h2>
            <p className="card-text">
              ResumeCraft restores visual balance. Our editor separates the content writing process from styling design. By outputting clean linear tables and providing simple designer-curated accent colors, you generate a compliant, highly readable resume in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Product Pillars Grid */}
      <section className="landing-section">
        <div className="section-header">
          <div className="section-tag">
            <ShieldCheck size={14} />
            <span>Product Pillars</span>
          </div>
          <h2 className="section-title">Why ResumeCraft is Different</h2>
          <p className="section-subtitle">
            We focus on clean visual presentation, search screening success, and paywall-free utility.
          </p>
        </div>

        <div className="pillar-grid">
          {pillars.map((pillar, idx) => (
            <div className="pillar-card" key={idx}>
              <div className="pillar-icon-wrapper">
                {pillar.icon}
              </div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built By Section (Small Developer Section at the end - 10-20% of the page) */}
      <section className="landing-section developer-section">
        <div className="developer-card-container">
          <div className="developer-card">
            <div className="dev-avatar-info">
              <img
                src={profileImage}
                alt="Gaurav Singh Yadav"
                className="dev-avatar"
              />
              <div className="dev-info">
                <span className="dev-name">Gaurav Singh Yadav</span>
                <span className="dev-title">Developer & Creator</span>
                <p className="dev-bio">
                  Built ResumeCraft as an open-source project to give software developers and designers a formatting-free CV creator. Open to community contributions!
                </p>
              </div>
            </div>

            <div className="dev-links-col">
              <a href="https://linkedin.com/in/thisisgauravyadav" target="_blank" rel="noreferrer" className="dev-link" title="LinkedIn Profile">
                {linkedinIcon}
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/pseudocode21" target="_blank" rel="noreferrer" className="dev-link" title="GitHub Profile">
                {githubIcon}
                <span>GitHub</span>
              </a>
              <a href="https://github.com/pseudocode21/resume-builder" target="_blank" rel="noreferrer" className="dev-link" title="Project Repository" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                <Code size={14} />
                <span>View Source</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
