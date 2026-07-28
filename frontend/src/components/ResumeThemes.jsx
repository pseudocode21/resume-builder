// Helper to format multi-line descriptions with bullets and line breaks
const renderFormattedText = (text, style = {}) => {
  if (!text) return null;
  
  // Split by newlines first
  let rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // If no newlines were entered, but text has inline bullets like ".- Implemented" or ". - Implemented"
  if (rawLines.length === 1 && (text.includes('.- ') || text.includes('. - '))) {
    rawLines = text.split(/(?<=\.)\s*-\s*/).map(l => l.trim()).filter(Boolean);
  }

  return (
    <div style={{ ...style, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
      {rawLines.map((line, idx) => {
        const isBullet = line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ');
        const cleanContent = isBullet ? line.substring(2).trim() : line;
        return (
          <div key={idx} style={{ marginTop: idx > 0 ? '2px' : '0', display: isBullet ? 'flex' : 'block', gap: '5px', alignItems: 'flex-start' }}>
            {isBullet && <span style={{ flexShrink: 0, fontWeight: 'bold' }}>•</span>}
            <span style={{ flex: 1 }}>{cleanContent}</span>
          </div>
        );
      })}
    </div>
  );
};

export const DEFAULT_SAMPLE_DATA = {
  profileInfo: {
    fullName: 'Alex Morgan',
    designation: 'Senior Software Engineer',
    summary: 'Innovative and detail-oriented Software Engineer with 5+ years of experience crafting high-performance web applications, microservices, and elegant user interfaces. Adept at full-stack development, cloud deployment, and leading agile teams.',
  },
  contactInfo: {
    phone: '+1 (555) 234-5678',
    email: 'alex.morgan@example.com',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: 'alexmorgan.dev'
  },
  workExperience: [
    {
      company: 'TechCorp Solutions',
      role: 'Senior Frontend Engineer',
      startDate: '2021',
      endDate: 'Present',
      description: '• Spearheaded frontend architecture redesign using React & Redux, cutting initial bundle load time by 42%.\n• Mentored 5 junior engineers and established automated UI testing pipelines.'
    },
    {
      company: 'Innovate Labs',
      role: 'Full Stack Developer',
      startDate: '2019',
      endDate: '2021',
      description: '• Developed scalable RESTful APIs with Spring Boot and PostgreSQL, handling over 100k daily active users.\n• Implemented real-time dashboard analytics with WebSockets and Chart.js.'
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      startDate: '2015',
      endDate: '2019'
    }
  ],
  skills: [
    { name: 'React / JavaScript', Progress: 92 },
    { name: 'Java / Spring Boot', Progress: 88 },
    { name: 'Node.js & MongoDB', Progress: 82 },
    { name: 'TypeScript & Next.js', Progress: 85 }
  ],
  projects: [
    {
      title: 'E-Commerce Analytics Engine',
      description: 'Real-time sales dashboard tracking active users and conversion metrics.',
      github: 'https://github.com',
      liveDemo: 'https://example.com'
    }
  ],
  certifications: [
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }
  ],
  languages: [
    { name: 'English', Progress: 100 },
    { name: 'Spanish', Progress: 75 }
  ],
  interests: ['Open Source', 'UI/UX Design', 'Cloud Computing']
};

const isResumeEmpty = (data) => {
  if (!data) return true;
  const hasName = !!data.profileInfo?.fullName?.trim();
  const hasDesignation = !!data.profileInfo?.designation?.trim();
  const hasSummary = !!data.profileInfo?.summary?.trim();
  const hasContact = !!(
    data.contactInfo?.email?.trim() ||
    data.contactInfo?.phone?.trim() ||
    data.contactInfo?.location?.trim() ||
    data.contactInfo?.linkedIn?.trim() ||
    data.contactInfo?.github?.trim() ||
    data.contactInfo?.website?.trim()
  );
  const hasExp = data.workExperience && data.workExperience.some(e => e?.company?.trim() || e?.role?.trim() || e?.description?.trim());
  const hasEdu = data.education && data.education.some(e => e?.institution?.trim() || e?.degree?.trim());
  const hasSkills = data.skills && data.skills.some(s => s?.name?.trim());
  const hasProjects = data.projects && data.projects.some(p => p?.title?.trim() || p?.description?.trim());
  const hasCerts = data.certifications && data.certifications.some(c => c?.title?.trim());
  const hasLangs = data.languages && data.languages.some(l => l?.name?.trim());
  const hasInterests = data.interests && data.interests.length > 0;

  return !(hasName || hasDesignation || hasSummary || hasContact || hasExp || hasEdu || hasSkills || hasProjects || hasCerts || hasLangs || hasInterests);
};

const getEffectiveData = (data = {}) => {
  if (isResumeEmpty(data)) {
    return DEFAULT_SAMPLE_DATA;
  }
  return {
    profileInfo: data.profileInfo || {},
    contactInfo: data.contactInfo || {},
    workExperience: data.workExperience || [],
    education: data.education || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    interests: data.interests || []
  };
};

// Template 1: Classic Professional ATS Minimalist (Single Column)
export const Template01 = ({ data, accentColor }) => {
  const { profileInfo, contactInfo, workExperience, education, skills, projects, certifications, languages, interests } = getEffectiveData(data);
  const primaryColor = accentColor || '#c1630b';

  return (
    <div style={{ padding: '32px 36px', color: '#1f2937', background: '#fff', width: '100%', minHeight: '1123px', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', lineHeight: '1.4', textAlign: 'left', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 2px 0', letterSpacing: '-0.02em' }}>{profileInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '14px', color: primaryColor, fontWeight: '600', margin: '0 0 8px 0' }}>{profileInfo.designation || 'Professional Designation'}</p>

          {/* Contact Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#4b5563' }}>
            {contactInfo.phone && <span>📞 {contactInfo.phone}</span>}
            {contactInfo.email && <span>✉️ {contactInfo.email}</span>}
            {contactInfo.location && <span>📍 {contactInfo.location}</span>}
            {contactInfo.linkedIn && <span>🔗 {contactInfo.linkedIn}</span>}
            {contactInfo.github && <span>💻 {contactInfo.github}</span>}
            {contactInfo.website && <span>🌐 {contactInfo.website}</span>}
          </div>
        </div>
        {profileInfo.profilePreviewUrl && (
          <img
            src={profileInfo.profilePreviewUrl}
            alt="Profile"
            style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${primaryColor}`, marginLeft: '16px', flexShrink: 0 }}
          />
        )}
      </div>

      {/* Summary */}
      {profileInfo.summary && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Summary</h2>
          <p style={{ color: '#374151', fontSize: '11.5px', lineHeight: '1.4' }}>{profileInfo.summary}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <strong style={{ color: '#111827', fontSize: '12px' }}>{edu.degree}</strong>
                <span style={{ color: '#4b5563', fontSize: '11.5px', marginLeft: '6px' }}>— {edu.institution}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Work Experience</h2>
          {workExperience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#111827', fontSize: '12px' }}>
                <span>{exp.role} <span style={{ fontWeight: 'normal', color: '#4b5563' }}>— {exp.company}</span></span>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>{exp.startDate} - {exp.endDate}</span>
              </div>
              {renderFormattedText(exp.description, { color: '#374151', fontSize: '11.5px', marginTop: '2px', lineHeight: '1.35' })}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ color: '#111827', fontSize: '12px' }}>{proj.title}</strong>
                <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px' }}>
                  {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" style={{ color: primaryColor, fontWeight: '600' }}>GitHub</a>}
                  {proj.liveDemo && <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ color: primaryColor, fontWeight: '600' }}>Demo</a>}
                </div>
              </div>
              {renderFormattedText(proj.description, { color: '#374151', fontSize: '11.5px', marginTop: '2px', lineHeight: '1.35' })}
            </div>
          ))}
        </div>
      )}

      {/* Skills (Compact Inline Badges) */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Skills & Technical Expertise</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {skills.map((skill, idx) => (
              <span key={idx} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#334155', fontWeight: '500' }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Certifications & Achievements</h2>
          {certifications.map((cert, idx) => (
            <div key={idx} style={{ fontSize: '11.5px', color: '#374151', marginBottom: '3px' }}>
              <strong>• {cert.title}</strong> {cert.issuer ? `— ${cert.issuer}` : ''} {cert.year ? `(${cert.year})` : ''}
            </div>
          ))}
        </div>
      )}

      {/* Interests & Languages */}
      {(interests.length > 0 || languages.length > 0) && (
        <div>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', borderBottom: '1px solid #e5e7eb', paddingBottom: '2px' }}>Additional Info</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#4b5563' }}>
            {languages.length > 0 && (
              <div><strong>Languages:</strong> {languages.map(l => l.name).join(', ')}</div>
            )}
            {interests.length > 0 && (
              <div><strong>Interests:</strong> {interests.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Template 2: Creative Modern (Two Column Layout)
export const Template02 = ({ data, accentColor }) => {
  const { profileInfo, contactInfo, workExperience, education, skills, projects, certifications, languages, interests } = getEffectiveData(data);
  const primaryColor = accentColor || '#10b981';

  return (
    <div style={{ display: 'flex', color: '#333', background: '#fff', width: '100%', minHeight: '1123px', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', lineHeight: '1.4', textAlign: 'left', boxSizing: 'border-box' }}>
      
      {/* Left Sidebar */}
      <div style={{ width: '220px', flexShrink: 0, background: '#1e293b', color: '#f8fafc', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Profile Image & Name */}
        <div style={{ textAlign: 'center' }}>
          {profileInfo.profilePreviewUrl ? (
            <img src={profileInfo.profilePreviewUrl} alt="profile" style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}`, marginBottom: '8px' }} />
          ) : (
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              👤
            </div>
          )}
          <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 2px 0', color: '#fff' }}>{profileInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '11.5px', color: primaryColor, fontWeight: '600', margin: '0' }}>{profileInfo.designation || 'Designation'}</p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', marginBottom: '8px', color: primaryColor }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px', wordBreak: 'break-all' }}>
            {contactInfo.phone && <div>📞 {contactInfo.phone}</div>}
            {contactInfo.email && <div>✉️ {contactInfo.email}</div>}
            {contactInfo.location && <div>📍 {contactInfo.location}</div>}
            {contactInfo.linkedIn && <div>🔗 {contactInfo.linkedIn}</div>}
            {contactInfo.github && <div>💻 {contactInfo.github}</div>}
          </div>
        </div>

        {/* Skills (Compact Sidebar Badges) */}
        {skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', marginBottom: '8px', color: primaryColor }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', marginBottom: '6px', color: primaryColor }}>Languages</h3>
            {languages.map((lang, idx) => (
              <div key={idx} style={{ fontSize: '10.5px', marginBottom: '3px', color: '#cbd5e1' }}>
                {lang.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ flex: '1', padding: '24px 20px', background: '#fff' }}>
        {/* Profile/Summary */}
        {profileInfo.summary && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '2px', marginBottom: '6px' }}>About Me</h2>
            <p style={{ color: '#475569', lineHeight: '1.4', fontSize: '11.5px' }}>{profileInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '2px', marginBottom: '8px' }}>Professional Experience</h2>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b', fontSize: '12px' }}>
                  <span>{exp.role} <span style={{ fontWeight: 'normal', color: '#64748b' }}>at {exp.company}</span></span>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                {renderFormattedText(exp.description, { color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: '1.35' })}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '2px', marginBottom: '8px' }}>Featured Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '12px' }}>{proj.title}</div>
                {renderFormattedText(proj.description, { color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: '1.35' })}
                <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', marginTop: '2px' }}>
                  {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" style={{ color: primaryColor, textDecoration: 'underline' }}>Code</a>}
                  {proj.liveDemo && <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ color: primaryColor, textDecoration: 'underline' }}>Demo</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '2px', marginBottom: '6px' }}>Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: '#1e293b', fontSize: '11.5px' }}>{edu.degree}</strong>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748b' }}>{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '2px', marginBottom: '6px' }}>Certifications</h2>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
                <strong>{cert.title}</strong> — {cert.issuer} ({cert.year})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Template 3: Executive Elegant (Top Centered Banner - GUARANTEED NO PHOTO)
export const Template03 = ({ data, accentColor }) => {
  const { profileInfo, contactInfo, workExperience, education, skills, projects, certifications, languages, interests } = getEffectiveData(data);
  const primaryColor = accentColor || '#b45309';

  return (
    <div style={{ padding: '0', color: '#2d3748', background: '#fff', width: '100%', minHeight: '1123px', fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: '1.45', textAlign: 'center', boxSizing: 'border-box' }}>
      
      {/* Top Banner (GUARANTEED NO PROFILE PHOTO) */}
      <div style={{ background: '#f8fafc', padding: '28px 36px', borderBottom: `3px solid ${primaryColor}`, textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'normal', color: '#1a202c', margin: '0 0 4px 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {profileInfo.fullName || 'Your Name'}
        </h1>
        <p style={{ fontSize: '13px', color: primaryColor, fontStyle: 'italic', margin: '0 0 12px 0' }}>
          {profileInfo.designation || 'Designation'}
        </p>

        {/* Contact Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', fontSize: '11px', color: '#4a5568', fontFamily: 'system-ui, sans-serif' }}>
          {contactInfo.phone && <span>📞 {contactInfo.phone}</span>}
          {contactInfo.email && <span>✉️ {contactInfo.email}</span>}
          {contactInfo.location && <span>📍 {contactInfo.location}</span>}
          {contactInfo.linkedIn && <span>🔗 {contactInfo.linkedIn}</span>}
          {contactInfo.github && <span>💻 {contactInfo.github}</span>}
        </div>
      </div>

      {/* Main Body Wrapper */}
      <div style={{ padding: '24px 36px', textAlign: 'left' }}>
        
        {/* Summary */}
        {profileInfo.summary && (
          <div style={{ marginBottom: '16px', textAlign: 'justify' }}>
            <p style={{ color: '#4a5568', fontStyle: 'italic', fontSize: '11.5px', lineHeight: '1.4' }}>{profileInfo.summary}</p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '8px' }}>Academic Background</h2>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong style={{ color: '#1a202c', fontSize: '12px' }}>{edu.degree}</strong>
                  <span style={{ color: '#4a5568', fontSize: '11.5px', marginLeft: '6px' }}>— {edu.institution}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#718096', fontFamily: 'system-ui, sans-serif' }}>{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills (Compact Capability Badges) */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '8px' }}>Core Capabilities</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#475569', fontFamily: 'system-ui, sans-serif' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects / Experience */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '8px' }}>Featured Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ color: '#1a202c', fontSize: '12px' }}>{proj.title}</strong>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', fontFamily: 'system-ui, sans-serif' }}>
                    {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>GitHub</a>}
                    {proj.liveDemo && <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>Demo</a>}
                  </div>
                </div>
                {renderFormattedText(proj.description, { color: '#4a5568', fontSize: '11.5px', marginTop: '2px', lineHeight: '1.35' })}
              </div>
            ))}
          </div>
        )}

        {workExperience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '8px' }}>Professional History</h2>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1a202c', fontSize: '12px' }}>
                  <span>{exp.role} <span style={{ fontWeight: 'normal', color: '#4a5568' }}>| {exp.company}</span></span>
                  <span style={{ fontSize: '11px', color: '#718096', fontFamily: 'system-ui, sans-serif' }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                {renderFormattedText(exp.description, { color: '#4a5568', fontSize: '11.5px', marginTop: '2px', lineHeight: '1.35' })}
              </div>
            ))}
          </div>
        )}

        {/* Certifications & Achievements */}
        {certifications.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '6px' }}>Certifications & Achievements</h2>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ fontSize: '11.5px', color: '#4a5568', marginBottom: '3px' }}>
                <strong>• {cert.title}</strong> {cert.issuer ? `(${cert.issuer})` : ''} {cert.year ? `— ${cert.year}` : ''}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
