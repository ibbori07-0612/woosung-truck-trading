import React from 'react';
import { Truck, PlusCircle, PhoneCall, Key } from 'lucide-react';

export default function Header({ onOpenForm, onOpenAdminModal }) {
  return (
    <header className="main-header">
      <div className="app-container header-content">
        <a href="/" className="brand-logo">
          <div className="brand-icon">
            <Truck size={26} />
          </div>
          <span className="brand-title">우성특장차매매</span>
        </a>

        <div className="header-actions">
          <a href="tel:010-7604-8949" className="btn btn-outline" style={{ display: 'none', smDisplay: 'inline-flex' }}>
            <PhoneCall size={16} />
            <span>010-7604-8949</span>
          </a>

          <button className="btn btn-outline" onClick={onOpenAdminModal} title="관리자 마스터 키">
            <Key size={16} />
            <span>관리자</span>
          </button>

          <button className="btn btn-primary" onClick={onOpenForm}>
            <PlusCircle size={18} />
            <span>매물 등록</span>
          </button>
        </div>
      </div>
    </header>
  );
}
