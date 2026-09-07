import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

const REGISTRATION_TYPES = ['전체', '팝니다', '삽니다', '완료'];
const CATEGORIES = ['전체', '추레라', '트레일러', '덤프테라'];
const MANUFACTURERS = ['전체', '기아', '대우', '미쓰비시', '삼성', '스카니아', '쌍용', '아시아', '이베코', '현대', '기타'];
const LOCATIONS = [
  '전체', '서울', '경기', '인천', '강원', '충북', '충남', '세종', '대전',
  '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주', '기타'
];

// Generate recent 20 years (2007 ~ 2026)
const currentYear = new Date().getFullYear();
const YEARS = ['전체', ...Array.from({ length: 20 }, (_, i) => String(currentYear - i))];
const MONTHS = ['전체', ...Array.from({ length: 12 }, (_, i) => String(i + 1))];

export default function SearchFilter({ filters, onFilterChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="glass-panel filter-section">
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="모델명, 상호, 위치, 상세 설명 텍스트 키워드 검색..."
          />
        </div>
        <button className="btn btn-outline" onClick={onReset} title="필터 초기화">
          <RotateCcw size={16} />
          <span>초기화</span>
        </button>
      </div>

      <div className="filter-grid">
        {/* 구분 */}
        <div className="form-group">
          <label>구분</label>
          <select className="form-select" name="registration_type" value={filters.registration_type} onChange={handleChange}>
            {REGISTRATION_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 분류 */}
        <div className="form-group">
          <label>분류</label>
          <select className="form-select" name="category" value={filters.category} onChange={handleChange}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 제작사 */}
        <div className="form-group">
          <label>제작사</label>
          <select className="form-select" name="manufacturer" value={filters.manufacturer} onChange={handleChange}>
            {MANUFACTURERS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* 제작년도 */}
        <div className="form-group">
          <label>제작연도</label>
          <select className="form-select" name="year" value={filters.year} onChange={handleChange}>
            {YEARS.map(y => (
              <option key={y} value={y}>{y === '전체' ? '전체 (최근 20년)' : `${y}년`}</option>
            ))}
          </select>
        </div>

        {/* 제작월 */}
        <div className="form-group">
          <label>제작월</label>
          <select className="form-select" name="month" value={filters.month} onChange={handleChange}>
            {MONTHS.map(m => (
              <option key={m} value={m}>{m === '전체' ? '전체 (1~12월)' : `${m}월`}</option>
            ))}
          </select>
        </div>

        {/* 위치 */}
        <div className="form-group">
          <label>위치 (지역)</label>
          <select className="form-select" name="location" value={filters.location} onChange={handleChange}>
            {LOCATIONS.map(l => (
              <option key={l} value={l}>{l === '전체' ? '전체 (전국 18개 지역)' : l}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
