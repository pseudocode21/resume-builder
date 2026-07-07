import React from 'react';

// Basic utility to render percentage bars or stars
const SkillBar = ({ progress, color }) => (
  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
    <div style={{ width: `${progress || 0}%`, height: '100%', background: color || '#8b5cf6', borderRadius: '3px' }} />
  </div>
);

// Template 1: Classic Professional Minimalist (Single Column)
export const Template01 = ({ data, accentColor }) => {
  const { profileInfo = {}, contactInfo = {}, workExperience = [], education = [], skills = [], projects = [], certifications = [], languages = [], interests = [] } = data;
  const primaryColor = accentColor || '#8b5cf6';

  return (
    <div style={{ padding: '40px', color: '#333', background: '#fff', minHeight: '840px', fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.5', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111', margin: '0 0 4px 0' }}>{profileInfo.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: '16px', color: primaryColor, fontWeight: '600', margin: '0 0 12px 0' }}>{profileInfo.designation || 'Professional Designation'}</p>
        
        {/* Contact info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '12px', color: '#666' }}>
          {contactInfo.phone && <div>📞 {contactInfo.phone}</div>}
          {contactInfo.email && <div>✉️ {contactInfo.email}</div>}
          {contactInfo.location && <div>📍 {contactInfo.location}</div>}
          {contactInfo.linkedIn && <div>🔗 LinkedIn: {contactInfo.linkedIn}</div>}
          {contactInfo.github && <div>💻 GitHub: {contactInfo.github}</div>}
          {contactInfo.website && <div>🌐 Web: {contactInfo.website}</div>}
        </div>
      </div>

      {/* Summary */}
      {profileInfo.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Summary</h2>
          <p style={{ color: '#444' }}>{profileInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Work Experience</h2>
          {workExperience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#222' }}>
                <span>{exp.role} — {exp.company}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{exp.startDate} - {exp.endDate}</span>
              </div>
              <p style={{ color: '#555', marginTop: '4px', whiteSpace: 'pre-line' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#222' }}>{edu.degree}</strong>
                <div style={{ color: '#555', fontSize: '13px' }}>{edu.institution}</div>
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Grid for Skills, Projects & rest */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#333' }}>
                      <span>{skill.name}</span>
                      <span>{skill.Progress}%</span>
                    </div>
                    <SkillBar progress={skill.Progress} color={primaryColor} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Languages</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {languages.map((lang, idx) => (
                  <div key={idx} style={{ fontSize: '12px', color: '#333' }}>
                    <strong>{lang.name}</strong> ({lang.Progress}%)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Projects</h2>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: '#222', fontSize: '13px' }}>{proj.title}</div>
                  <p style={{ color: '#555', fontSize: '12px', margin: '2px 0' }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                    {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>GitHub</a>}
                    {proj.liveDemo && <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>Demo</a>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Certifications</h2>
              {certifications.map((cert, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: '#333', marginBottom: '4px' }}>
                  <strong>{cert.title}</strong> — {cert.issuer} ({cert.year})
                </div>
              ))}
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>Interests</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {interests.map((interest, idx) => (
                  <span key={idx} style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#555' }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template 2: Creative Modern (Two Column Layout)
export const Template02 = ({ data, accentColor }) => {
  const { profileInfo = {}, contactInfo = {}, workExperience = [], education = [], skills = [], projects = [], certifications = [], languages = [], interests = [] } = data;
  const primaryColor = accentColor || '#10b981';

  return (
    <div style={{ display: 'flex', color: '#333', background: '#fff', minHeight: '840px', fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.4', textAlign: 'left' }}>
      {/* Left Sidebar */}
      <div style={{ width: '220px', background: '#1e293b', color: '#f8fafc', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile Image & Name */}
        <div style={{ textAlign: 'center' }}>
          {profileInfo.profilePreviewUrl ? (
            <img src={profileInfo.profilePreviewUrl} alt="profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}`, marginBottom: '12px' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              👤
            </div>
          )}
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>{profileInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '12px', color: primaryColor, fontWeight: '600', margin: '0' }}>{profileInfo.designation || 'Designation'}</p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '10px', color: primaryColor }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', wordBreak: 'break-all' }}>
            {contactInfo.phone && <div>📞 {contactInfo.phone}</div>}
            {contactInfo.email && <div>✉️ {contactInfo.email}</div>}
            {contactInfo.location && <div>📍 {contactInfo.location}</div>}
            {contactInfo.linkedIn && <div>🔗 {contactInfo.linkedIn}</div>}
            {contactInfo.github && <div>💻 {contactInfo.github}</div>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '10px', color: primaryColor }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                    <span>{skill.name}</span>
                  </div>
                  <SkillBar progress={skill.Progress} color={primaryColor} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '10px', color: primaryColor }}>Languages</h3>
            {languages.map((lang, idx) => (
              <div key={idx} style={{ fontSize: '11px', marginBottom: '4px' }}>
                {lang.name} — {lang.Progress}%
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ flex: '1', padding: '30px 24px', background: '#fff' }}>
        {/* Profile/Summary */}
        {profileInfo.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '10px' }}>About Me</h2>
            <p style={{ color: '#475569', lineHeight: '1.5' }}>{profileInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '12px' }}>Professional Experience</h2>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b' }}>
                  <span>{exp.role} <span style={{ fontWeight: 'normal', color: '#64748b' }}>at {exp.company}</span></span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p style={{ color: '#475569', marginTop: '4px', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '12px' }}>Featured Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{proj.title}</div>
                <p style={{ color: '#475569', fontSize: '12px', margin: '2px 0' }}>{proj.description}</p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                  {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" style={{ color: primaryColor, textDecoration: 'underline' }}>Code</a>}
                  {proj.liveDemo && <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ color: primaryColor, textDecoration: 'underline' }}>Demo</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: '#1e293b' }}>{edu.degree}</strong>
                  <div style={{ color: '#64748b' }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Template 3: Executive Elegant (Top Centered Banner)
export const Template03 = ({ data, accentColor }) => {
  const { profileInfo = {}, contactInfo = {}, workExperience = [], education = [], skills = [], projects = [], certifications = [], languages = [], interests = [] } = data;
  const primaryColor = accentColor || '#b45309';

  return (
    <div style={{ padding: '0', color: '#2d3748', background: '#fff', minHeight: '840px', fontFamily: 'Georgia, serif', fontSize: '13px', lineHeight: '1.6', textAlign: 'center' }}>
      {/* Top banner */}
      <div style={{ background: '#f7fafc', padding: '36px 40px', borderBottom: `4px solid ${primaryColor}`, textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'normal', color: '#1a202c', margin: '0 0 6px 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {profileInfo.fullName || 'Your Name'}
        </h1>
        <p style={{ fontSize: '14px', color: primaryColor, fontStyle: 'italic', margin: '0 0 16px 0' }}>
          {profileInfo.designation || 'Designation'}
        </p>
        
        {/* Contact strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '11px', color: '#718096', fontFamily: 'sans-serif' }}>
          {contactInfo.phone && <span>📞 {contactInfo.phone}</span>}
          {contactInfo.email && <span>✉️ {contactInfo.email}</span>}
          {contactInfo.location && <span>📍 {contactInfo.location}</span>}
          {contactInfo.linkedIn && <span>🔗 {contactInfo.linkedIn}</span>}
          {contactInfo.github && <span>💻 {contactInfo.github}</span>}
        </div>
      </div>

      {/* Main body wrapper */}
      <div style={{ padding: '30px 40px', textAlign: 'left' }}>
        {/* Summary */}
        {profileInfo.summary && (
          <div style={{ marginBottom: '20px', textAlign: 'justify' }}>
            <p style={{ color: '#4a5568', fontStyle: 'italic' }}>{profileInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '12px' }}>Professional History</h2>
            {workExperience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1a202c' }}>
                  <span>{exp.role} <span style={{ fontWeight: 'normal', color: '#4a5568' }}>| {exp.company}</span></span>
                  <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#718096', fontFamily: 'sans-serif' }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p style={{ color: '#4a5568', marginTop: '4px', whiteSpace: 'pre-line', fontSize: '12.5px' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education & Certs in columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '24px' }}>
          <div>
            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '10px' }}>Academic Background</h2>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#1a202c' }}>{edu.degree}</strong>
                    <div style={{ color: '#4a5568', fontSize: '12px' }}>{edu.institution}</div>
                    <div style={{ fontSize: '11px', color: '#718096', fontFamily: 'sans-serif', marginTop: '2px' }}>{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Skills list */}
            {skills.length > 0 && (
              <div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e0', paddingBottom: '2px', marginBottom: '10px' }}>Core Capabilities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skills.map((skill, idx) => (
                    <span key={idx} style={{ background: '#f7fafc', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', color: '#4a5568', fontFamily: 'sans-serif' }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
