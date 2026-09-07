import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import TruckList from './components/TruckList';
import TruckDetailModal from './components/TruckDetailModal';
import TruckFormModal from './components/TruckFormModal';
import AuthPasswordModal from './components/AuthPasswordModal';
import Footer from './components/Footer';
import { PhoneCall, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import {
  apiFetchTrucks,
  apiFetchTruckDetail,
  apiCreateTruck,
  apiUpdateTruck,
  apiDeleteTruck
} from './lib/api';

const ADMIN_MASTER_KEY = 'woosung8949';

export default function App() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sort, setSort] = useState('latest');

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    registration_type: '전체',
    category: '전체',
    manufacturer: '전체',
    year: '전체',
    month: '전체',
    location: '전체'
  });

  // Modal States
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [authModalConfig, setAuthModalConfig] = useState(null); // { actionType: 'edit' | 'delete' | 'admin', truck: Object }
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch Trucks from API / Local Storage
  const fetchTrucks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchTrucks(filters, sort);
      setTrucks(data || []);
    } catch (err) {
      console.error('Failed to fetch trucks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  // Open detail modal & auto increment views
  const handleSelectTruck = async (truck) => {
    try {
      const detail = await apiFetchTruckDetail(truck.id);
      if (detail) {
        setSelectedTruck(detail);
        fetchTrucks();
        return;
      }
    } catch (e) {
      console.error('Detail fetch error:', e);
    }
    setSelectedTruck(truck);
  };

  // Handle Filter Changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      registration_type: '전체',
      category: '전체',
      manufacturer: '전체',
      year: '전체',
      month: '전체',
      location: '전체'
    });
  };

  // Create or Edit Submission
  const handleFormSubmit = async (payload) => {
    if (editingTruck) {
      // Update Post
      await apiUpdateTruck(
        editingTruck.id,
        payload,
        payload.password || ADMIN_MASTER_KEY
      );
      showNotification('게시물이 성공적으로 수정되었습니다.');
    } else {
      // Create Post
      await apiCreateTruck(payload);
      showNotification('신규 특장차 매물이 성공적으로 등록되었습니다.');
    }

    setIsFormOpen(false);
    setEditingTruck(null);
    setSelectedTruck(null);
    fetchTrucks();
  };

  // Confirm Auth Password or Master Key
  const handleAuthConfirm = async (enteredPassword) => {
    if (!authModalConfig) return;
    const { actionType, truck } = authModalConfig;

    if (actionType === 'admin') {
      if (enteredPassword === ADMIN_MASTER_KEY) {
        setIsAdminLoggedIn(true);
        showNotification('관리자 마스터 모드가 활성화되었습니다.', 'success');
        setAuthModalConfig(null);
        return;
      } else {
        throw new Error('관리자 마스터 키가 올바르지 않습니다.');
      }
    }

    if (actionType === 'edit') {
      // Open Edit Form
      setEditingTruck(truck);
      setIsFormOpen(true);
      setAuthModalConfig(null);
      setSelectedTruck(null);
    } else if (actionType === 'delete') {
      // Delete Post via API / Local Storage
      await apiDeleteTruck(truck.id, enteredPassword, ADMIN_MASTER_KEY);
      showNotification('게시물이 성공적으로 삭제되었습니다.', 'success');
      setAuthModalConfig(null);
      setSelectedTruck(null);
      fetchTrucks();
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 84,
          right: 24,
          zIndex: 2000,
          background: notification.type === 'danger' ? '#ef4444' : 'linear-gradient(135deg, #00d294, #10b981)',
          color: notification.type === 'danger' ? '#fff' : '#070f1b',
          padding: '12px 20px',
          borderRadius: 8,
          fontWeight: 800,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Sparkles size={18} />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenForm={() => { setEditingTruck(null); setIsFormOpen(true); }}
        onOpenAdminModal={() => setAuthModalConfig({ actionType: 'admin', truck: null })}
      />

      <main className="app-container">
        {/* Admin Bar if logged in */}
        {isAdminLoggedIn && (
          <div className="glass-panel" style={{ margin: '16px 0 -12px 0', padding: '10px 18px', background: 'rgba(255, 184, 0, 0.15)', border: '1px solid var(--accent-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-gold)', fontWeight: 800 }}>
              <ShieldCheck size={20} />
              <span>관리자 마스터 모드 활성화 중 (모든 게시물 수정/삭제 권한 부여됨)</span>
            </div>
            <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setIsAdminLoggedIn(false)}>
              마스터 모드 해제
            </button>
          </div>
        )}

        {/* Hero Banner */}
        <section className="hero-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Truck size={24} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: 1 }}>
              WOOSUNG COMMERCIAL TRUCK TRADING
            </span>
          </div>
          <h1 className="hero-title">대한민국 특장차·트럭 전문 매매 플랫폼</h1>
          <p className="hero-subtitle">
            추레라, 트레일러, 덤프테라 등 엄선된 정품 특장차 매물을 빠르고 정확하게 거래하세요.
          </p>
          <div className="hero-contacts">
            <a href="tel:010-7604-8949" className="contact-pill">
              <PhoneCall size={16} /> 딜러 권정중 010-7604-8949
            </a>
            <a href="tel:010-3335-3230" className="contact-pill">
              <PhoneCall size={16} /> 010-3335-3230
            </a>
          </div>
        </section>

        {/* Search & Filter */}
        <SearchFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Truck Listings */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="brand-icon" style={{ margin: '0 auto 16px auto', animation: 'spin 1.5s infinite linear' }}>
              <Truck size={28} />
            </div>
            <div>특장차 매물 목록을 실시간 불러오는 중입니다...</div>
          </div>
        ) : (
          <TruckList
            trucks={trucks}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sort={sort}
            setSort={setSort}
            onSelectTruck={handleSelectTruck}
          />
        )}
      </main>

      {/* Footer (Fixed) */}
      <Footer />

      {/* Modals */}
      {selectedTruck && (
        <TruckDetailModal
          truck={selectedTruck}
          onClose={() => setSelectedTruck(null)}
          onEdit={(t) => {
            if (isAdminLoggedIn) {
              setEditingTruck(t);
              setIsFormOpen(true);
              setSelectedTruck(null);
            } else {
              setAuthModalConfig({ actionType: 'edit', truck: t });
            }
          }}
          onDelete={(t) => {
            if (isAdminLoggedIn) {
              handleAuthConfirm(ADMIN_MASTER_KEY);
            } else {
              setAuthModalConfig({ actionType: 'delete', truck: t });
            }
          }}
        />
      )}

      {isFormOpen && (
        <TruckFormModal
          initialData={editingTruck}
          onClose={() => { setIsFormOpen(false); setEditingTruck(null); }}
          onSubmit={handleFormSubmit}
        />
      )}

      {authModalConfig && (
        <AuthPasswordModal
          actionType={authModalConfig.actionType}
          truck={authModalConfig.truck}
          onClose={() => setAuthModalConfig(null)}
          onConfirm={handleAuthConfirm}
        />
      )}
    </div>
  );
}
