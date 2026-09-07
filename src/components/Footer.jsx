import React from 'react';
import { PhoneCall, Printer, User, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fixed-footer">
      <div className="app-container footer-content">
        <div className="dealer-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={18} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>담당 딜러</span>
            <span className="dealer-name">권정중</span>
          </div>

          <div style={{ width: 1, height: 16, background: 'var(--border-navy)', margin: '0 4px' }} />

          <div className="contact-item">
            <PhoneCall size={16} style={{ color: 'var(--accent-teal)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>연락처:</span>
            <a href="tel:010-7604-8949" style={{ color: '#fff', textDecoration: 'none' }}>010-7604-8949</a>
            <span style={{ color: 'var(--text-muted)' }}>,</span>
            <a href="tel:010-3335-3230" style={{ color: '#fff', textDecoration: 'none' }}>010-3335-3230</a>
          </div>

          <div style={{ width: 1, height: 16, background: 'var(--border-navy)', margin: '0 4px' }} />

          <div className="contact-item">
            <Printer size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>팩스:</span>
            <span>032-888-3203</span>
          </div>
        </div>

        <div className="quick-call-group">
          <a href="tel:010-7604-8949" className="btn btn-teal" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <PhoneCall size={14} />
            <span>010-7604-8949 전화</span>
          </a>
          <a href="tel:010-3335-3230" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <PhoneCall size={14} />
            <span>010-3335-3230 전화</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
