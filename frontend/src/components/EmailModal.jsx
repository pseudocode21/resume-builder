import React, { useState } from 'react';
import api from '../utils/api';
import html2pdf from 'html2pdf.js';
import { Mail, Send, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const EmailModal = ({ onClose, resumeTitle }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState(`Resume - ${resumeTitle || 'Application'}`);
  const [message, setMessage] = useState('Please find my attached resume for your review.');
  
  const [status, setStatus] = useState('idle'); // 'idle', 'generating', 'sending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setStatus('generating');
    setErrorMessage('');

    try {
      // Find the print preview canvas element
      const element = document.querySelector('.print-canvas');
      if (!element) {
        throw new Error("Preview canvas not found. Cannot generate PDF.");
      }

      // Configure html2pdf options
      const opt = {
        margin: 0,
        filename: `${resumeTitle || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Generate the PDF blob client-side
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
      
      setStatus('sending');

      // Create FormData to send files multipart
      const formData = new FormData();
      
      // Axios or Fetch needs blobs appended as files
      formData.append('pdfFile', pdfBlob, `${resumeTitle || 'resume'}.pdf`);
      formData.append('recipientEmail', recipientEmail);
      formData.append('subject', subject);
      formData.append('message', message);

      const res = await api.post('/api/email/send-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        setStatus('success');
      } else {
        throw new Error(res.data?.message || "Failed to send email");
      }
    } catch (err) {
      console.error("Email send failed:", err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || err.message || "Failed to process and send resume email.");
    }
  };

  return (
    <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '300' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '95%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={20} style={{ color: 'var(--primary)' }} />
            <span>Email Resume</span>
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            disabled={status === 'generating' || status === 'sending'}
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={56} style={{ color: 'var(--success)', margin: '0 auto 16px' }} />
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Sent Successfully!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your resume has been successfully sent to <strong style={{ color: '#fff' }}>{recipientEmail}</strong>.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendEmail}>
            {status === 'error' && (
              <div className="alert alert-error" style={{ marginBottom: '16px', padding: '10px 12px' }}>
                <AlertCircle size={16} style={{ flexShrink: '0' }} />
                <span style={{ fontSize: '0.85rem' }}>{errorMessage}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Recipient Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="employer@company.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                disabled={status === 'generating' || status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                className="form-input"
                placeholder="Resume Application"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={status === 'generating' || status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="msg">Message</label>
              <textarea
                id="msg"
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'generating' || status === 'sending'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-secondary"
                disabled={status === 'generating' || status === 'sending'}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className={`btn btn-primary ${status === 'generating' || status === 'sending' ? 'btn-disabled' : ''}`}
                disabled={status === 'generating' || status === 'sending'}
                style={{ minWidth: '120px' }}
              >
                {status === 'generating' && (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Compiling...</span>
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Sending...</span>
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <Send size={14} />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailModal;
