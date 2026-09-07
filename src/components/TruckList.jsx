import React from 'react';
import TruckCard from './TruckCard';
import { LayoutGrid, List, ArrowUpDown, Truck } from 'lucide-react';

export default function TruckList({ trucks, viewMode, setViewMode, sort, setSort, onSelectTruck }) {
  return (
    <div>
      <div className="list-controls">
        <div className="result-count">
          등록 매물 <span className="count-highlight">{trucks.length}</span> 건
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.88rem' }}
            >
              <option value="latest">최신 등록순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="views_desc">조회수 높은순</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="갤러리형 (카드)"
            >
              <LayoutGrid size={16} />
              <span>갤러리</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="리스트형 (목록)"
            >
              <List size={16} />
              <span>리스트</span>
            </button>
          </div>
        </div>
      </div>

      {trucks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Truck size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <h3 style={{ color: 'var(--text-bright)', marginBottom: 6 }}>조회된 특장차 매물이 없습니다.</h3>
          <p>검색어나 필터 조건을 변경해 보세요.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'truck-grid' : 'truck-list-compact'}>
          {trucks.map(truck => (
            <TruckCard
              key={truck.id}
              truck={truck}
              viewMode={viewMode}
              onClick={onSelectTruck}
            />
          ))}
        </div>
      )}
    </div>
  );
}
