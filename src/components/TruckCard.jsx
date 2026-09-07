import React from 'react';
import { MapPin, Calendar, Gauge, Eye, Phone } from 'lucide-react';

export default function TruckCard({ truck, viewMode, onClick }) {
  const formatPrice = (val) => {
    if (val === undefined || val === null) return '가격문의';
    return Number(val).toLocaleString();
  };

  const formatMileage = (val) => {
    if (!val) return '미기재';
    return `${Number(val).toLocaleString()} KM`;
  };

  const getBadgeClass = (type) => {
    if (type === '팝니다') return 'badge-sell';
    if (type === '삽니다') return 'badge-buy';
    return 'badge-done';
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80';

  if (viewMode === 'list') {
    return (
      <div className="truck-compact-row" onClick={() => onClick(truck)}>
        <div className="compact-img-wrapper">
          <span className={`badge-reg ${getBadgeClass(truck.registration_type)}`}>
            {truck.registration_type}
          </span>
          <span className="badge-condition">{truck.condition_grade}</span>
          <img
            src={truck.main_image_url || fallbackImage}
            alt={truck.model_name}
            className="card-img"
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>

        <div className="compact-body">
          <div>
            <div className="card-model">{truck.model_name}</div>
            <div className="card-tags">
              <span className="tag-pill">{truck.manufacturer}</span>
              <span className="tag-pill">{truck.category}</span>
              <span className="tag-pill">{truck.year_month}</span>
              <span className="tag-pill"><MapPin size={12} inline /> {truck.location}</span>
              {truck.mileage && <span className="tag-pill"><Gauge size={12} inline /> {formatMileage(truck.mileage)}</span>}
            </div>
            <div className="card-meta">
              <span>상호: {truck.company_name}</span>
              <span>•</span>
              <span>등록일: {truck.created_at}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 16 }}>
            <div className="card-price">
              {formatPrice(truck.price)} <span>만원</span>
            </div>
            <div className="card-meta" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
              <Eye size={14} /> {truck.views || 0}회
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Gallery Grid View Card
  return (
    <div className="truck-card" onClick={() => onClick(truck)}>
      <div className="card-img-wrapper">
        <span className={`badge-reg ${getBadgeClass(truck.registration_type)}`}>
          {truck.registration_type}
        </span>
        <span className="badge-condition">{truck.condition_grade}</span>
        <img
          src={truck.main_image_url || fallbackImage}
          alt={truck.model_name}
          className="card-img"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
      </div>

      <div className="card-body">
        <div className="card-model">{truck.model_name}</div>

        <div className="card-tags">
          <span className="tag-pill">{truck.manufacturer}</span>
          <span className="tag-pill">{truck.category}</span>
          <span className="tag-pill"><Calendar size={12} inline /> {truck.year_month}</span>
          <span className="tag-pill"><MapPin size={12} inline /> {truck.location}</span>
        </div>

        <div className="card-price-row">
          <div>
            <div className="card-meta" style={{ marginBottom: 4 }}>
              <span>{truck.company_name}</span>
            </div>
            <div className="card-meta">
              <span><Eye size={13} inline /> {truck.views || 0}</span>
              <span>•</span>
              <span>{truck.created_at}</span>
            </div>
          </div>
          <div className="card-price">
            {formatPrice(truck.price)} <span>만원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
