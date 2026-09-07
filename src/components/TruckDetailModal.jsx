import React, { useState } from 'react';
import { X, Phone, MessageSquare, Edit3, Trash2, Calendar, MapPin, Eye, ShieldCheck } from 'lucide-react';

export default function TruckDetailModal({ truck, onClose, onEdit, onDelete }) {
  if (!truck) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80';
  
  // Combine main image and reference images into one gallery list
  const galleryImages = [
    truck.main_image_url || fallbackImage,
    ...(Array.isArray(truck.reference_images) ? truck.reference_images : [])
  ];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const formatPrice = (val) => {
    if (!val && val !== 0) return '가격 문의';
    return `${Number(val).toLocaleString()} 만원`;
  };

  const formatMileage = (val) => {
    if (!val) return '미기재';
    return `${Number(val).toLocaleString()} KM`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className={`badge-reg ${truck.registration_type === '팝니다' ? 'badge-sell' : truck.registration_type === '삽니다' ? 'badge-buy' : 'badge-done'}`} style={{ position: 'static', display: 'inline-block', marginRight: 8 }}>
              {truck.registration_type}
            </span>
            <span className="badge-condition" style={{ position: 'static', display: 'inline-block', marginRight: 8 }}>
              상태: {truck.condition_grade}
            </span>
            <h2 className="modal-title" style={{ display: 'inline-block', marginTop: 4 }}>
              {truck.model_name}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Gallery View */}
          <div className="detail-gallery">
            <div className="main-preview-box">
              <img
                src={galleryImages[activeImgIndex] || fallbackImage}
                alt="특장차 상세 이미지"
                className="main-preview-img"
                onError={(e) => { e.target.src = fallbackImage; }}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="thumbs-row">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumb-item ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={img} alt={`썸네일 ${idx + 1}`} onError={(e) => { e.target.src = fallbackImage; }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Price Banner */}
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>판매 / 매입 가격</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'var(--font-num)' }}>
                {formatPrice(truck.price)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`tel:${truck.contact_number || '010-7604-8949'}`} className="btn btn-teal">
                <Phone size={18} />
                <span>전화걸기</span>
              </a>
              <a href={`sms:${truck.contact_number || '010-7604-8949'}`} className="btn btn-outline">
                <MessageSquare size={18} />
                <span>문자문의</span>
              </a>
            </div>
          </div>

          {/* Specifications Table Grid */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-bright)' }}>
            매물 상세 정보 Spec
          </h3>
          <div className="spec-grid">
            <div className="spec-item">
              <div className="spec-label">구분 / 분류</div>
              <div className="spec-val">{truck.registration_type} / {truck.category}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">제작사 / 모델</div>
              <div className="spec-val">{truck.manufacturer} / {truck.model_name}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">제작년월</div>
              <div className="spec-val">{truck.year_month}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">상태 등급</div>
              <div className="spec-val" style={{ color: 'var(--accent-gold)' }}>{truck.condition_grade}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">위치 (지역)</div>
              <div className="spec-val">{truck.location}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">운행 키로수</div>
              <div className="spec-val">{formatMileage(truck.mileage)}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">엔진 출력</div>
              <div className="spec-val">{truck.engine_power ? `${truck.engine_power} 마력` : '미기재'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">변속기 (밋션)</div>
              <div className="spec-val">{truck.transmission || '미기재'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">할부 / 현금 조건</div>
              <div className="spec-val">{truck.payment_type || '미기재'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">상호 (업체명)</div>
              <div className="spec-val">{truck.company_name}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">연락처</div>
              <div className="spec-val" style={{ fontFamily: 'var(--font-num)' }}>{truck.contact_number}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">조회수 / 등록일</div>
              <div className="spec-val" style={{ fontSize: '0.95rem' }}>
                <Eye size={14} inline /> {truck.views || 0}회 ({truck.created_at})
              </div>
            </div>
          </div>

          {/* Description Block */}
          {truck.description && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-bright)' }}>
                상세 설명
              </h3>
              <div className="glass-panel" style={{ padding: 16, whiteSpace: 'pre-line', color: 'var(--text-main)', lineHeight: 1.7 }}>
                {truck.description}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-navy)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-teal)' }} />
              <span>본인 비밀번호 또는 관리자 마스터 키로 수정/삭제가 가능합니다.</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => onEdit(truck)}>
                <Edit3 size={16} />
                <span>수정하기</span>
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(truck)}>
                <Trash2 size={16} />
                <span>삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
