import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'woosung_trucks_data';

// Default initial truck listings preset for instant demo
const DEFAULT_PRESET_TRUCKS = [
  {
    id: "1",
    registration_type: "팝니다",
    category: "추레라",
    year_month: "2022.08",
    condition_grade: "A+",
    manufacturer: "스카니아",
    location: "경기",
    model_name: "스카니아 R540 6X2 트랙터 (최상급)",
    price: 14500,
    company_name: "우성특장차",
    contact_number: "010-7604-8949",
    password_hash: "ws1234",
    main_image_url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    engine_power: 410,
    transmission: "오토",
    payment_type: "할부/현금",
    mileage: 185000,
    reference_images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586191582066-6b2195f32a7e?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "1인 신조 올순정 스카니아 추레라 차량입니다. 무사고 완벽 관리 차량으로 경정비 마친 후 전시 중입니다. 바로 현장 투입 가능합니다.",
    views: 142,
    created_at: "2026.09.05",
    updated_at: "2026.09.05"
  },
  {
    id: "2",
    registration_type: "팝니다",
    category: "덤프테라",
    year_month: "2020.03",
    condition_grade: "A",
    manufacturer: "현대",
    location: "인천",
    model_name: "현대 엑시언트 덤프 25톤",
    price: 9800,
    company_name: "우성물류",
    contact_number: "010-3335-3230",
    password_hash: "ws1234",
    main_image_url: "https://images.unsplash.com/photo-1586191582066-6b2195f32a7e?auto=format&fit=crop&w=1200&q=80",
    engine_power: 400,
    transmission: "하이로",
    payment_type: "현금",
    mileage: 240000,
    reference_images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "엔진 오일 및 미션오일 주기적 교환 차량. 타이어 트레드 85% 이상 남아있습니다. 시운전 적극 강추드립니다.",
    views: 89,
    created_at: "2026.09.02",
    updated_at: "2026.09.02"
  },
  {
    id: "3",
    registration_type: "팝니다",
    category: "트레일러",
    year_month: "2021.11",
    condition_grade: "A-",
    manufacturer: "대우",
    location: "경북",
    model_name: "타타대우 프리마 콤비 트레일러",
    price: 8700,
    company_name: "신선상사",
    contact_number: "010-7604-8949",
    password_hash: "ws1234",
    main_image_url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
    engine_power: 380,
    transmission: "스틱",
    payment_type: "할부",
    mileage: 210000,
    reference_images: [],
    description: "상태 양호한 타타대우 프리마 트레일러입니다. 하체 정비 완료, 가성비 최고 매물입니다.",
    views: 215,
    created_at: "2026.08.31",
    updated_at: "2026.08.31"
  },
  {
    id: "4",
    registration_type: "삽니다",
    category: "추레라",
    year_month: "2018.06",
    condition_grade: "B+",
    manufacturer: "이베코",
    location: "충남",
    model_name: "이베코 스트랄리스 트랙터 (구함)",
    price: 6500,
    company_name: "우성특장",
    contact_number: "010-3335-3230",
    password_hash: "ws1234",
    main_image_url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    engine_power: 360,
    transmission: "오토",
    payment_type: "할부/현금",
    mileage: 350000,
    reference_images: [],
    description: "이베코 스트랄리스 또는 동급 400마력 전후 추레라 급구합니다. 전국 어디든 즉시 현장 출장 매입 가능합니다.",
    views: 178,
    created_at: "2026.08.28",
    updated_at: "2026.08.28"
  },
  {
    id: "5",
    registration_type: "완료",
    category: "덤프테라",
    year_month: "2019.01",
    condition_grade: "B",
    manufacturer: "쌍용",
    location: "전남",
    model_name: "쌍용 대형 덤프 특장차",
    price: 5400,
    company_name: "남도상사",
    contact_number: "010-7604-8949",
    password_hash: "ws1234",
    main_image_url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    engine_power: 340,
    transmission: "스틱",
    payment_type: "현금",
    mileage: 420000,
    reference_images: [],
    description: "매매 계약 완료된 매물입니다. 성원에 감사드립니다.",
    views: 312,
    created_at: "2026.08.20",
    updated_at: "2026.08.20"
  }
];

// Helper to get local storage trucks
const getLocalStorageTrucks = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_TRUCKS));
      return DEFAULT_PRESET_TRUCKS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_PRESET_TRUCKS;
  }
};

const saveLocalStorageTrucks = (trucks) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trucks));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// Safe JSON Fetch helper
const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Network or server offline
  }
  return null;
};

const getTodayDateFormatted = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// ==========================================
// API Methods
// ==========================================

export const apiFetchTrucks = async (filters, sort) => {
  const queryParams = new URLSearchParams({
    search: filters.search || '',
    registration_type: filters.registration_type || '전체',
    category: filters.category || '전체',
    manufacturer: filters.manufacturer || '전체',
    year: filters.year || '전체',
    month: filters.month || '전체',
    location: filters.location || '전체',
    sort: sort || 'latest'
  });

  // 1. Try Express API endpoint
  const expressResult = await safeFetchJson(`/api/trucks?${queryParams.toString()}`);
  if (expressResult && expressResult.success) {
    return expressResult.data;
  }

  // 2. Try Supabase Client
  if (supabase) {
    try {
      let query = supabase.from('trucks').select('*');
      if (filters.registration_type && filters.registration_type !== '전체') {
        query = query.eq('registration_type', filters.registration_type);
      }
      if (filters.category && filters.category !== '전체') {
        query = query.eq('category', filters.category);
      }
      if (filters.manufacturer && filters.manufacturer !== '전체') {
        query = query.eq('manufacturer', filters.manufacturer);
      }
      if (filters.location && filters.location !== '전체') {
        query = query.eq('location', filters.location);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {}
  }

  // 3. Fallback to LocalStorage
  let trucks = getLocalStorageTrucks();

  // In-memory Filter
  let filtered = trucks.filter(item => {
    if (filters.registration_type && filters.registration_type !== '전체' && item.registration_type !== filters.registration_type) return false;
    if (filters.category && filters.category !== '전체' && item.category !== filters.category) return false;
    if (filters.manufacturer && filters.manufacturer !== '전체' && item.manufacturer !== filters.manufacturer) return false;
    if (filters.location && filters.location !== '전체' && item.location !== filters.location) return false;
    if (filters.year && filters.year !== '전체') {
      const itemYear = item.year_month ? item.year_month.split('.')[0] : '';
      if (itemYear !== filters.year) return false;
    }
    if (filters.month && filters.month !== '전체') {
      const itemMonth = item.year_month ? String(parseInt(item.year_month.split('.')[1] || '0', 10)) : '';
      if (itemMonth !== String(parseInt(filters.month, 10))) return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      const target = `${item.model_name || ''} ${item.company_name || ''} ${item.manufacturer || ''} ${item.location || ''} ${item.description || ''}`.toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });

  // Sorting
  if (sort === 'price_asc') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'views_desc') {
    filtered.sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
  } else {
    filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  return filtered;
};

export const apiFetchTruckDetail = async (id) => {
  const result = await safeFetchJson(`/api/trucks/${id}`);
  if (result && result.success && result.data) {
    return result.data;
  }

  const trucks = getLocalStorageTrucks();
  const index = trucks.findIndex(t => String(t.id) === String(id));
  if (index !== -1) {
    trucks[index].views = (trucks[index].views || 0) + 1;
    saveLocalStorageTrucks(trucks);
    return trucks[index];
  }
  return null;
};

export const apiCreateTruck = async (payload) => {
  // 1. Try Express API
  const expressResult = await safeFetchJson('/api/trucks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (expressResult && expressResult.success) {
    return expressResult.data;
  }

  // 2. Try Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase.from('trucks').insert([payload]).select().single();
      if (!error && data) return data;
    } catch (e) {}
  }

  // 3. Fallback to LocalStorage
  const trucks = getLocalStorageTrucks();
  const today = getTodayDateFormatted();
  const newTruck = {
    ...payload,
    id: String(Date.now()),
    created_at: today,
    updated_at: today,
    views: 0
  };
  trucks.unshift(newTruck);
  saveLocalStorageTrucks(trucks);
  return newTruck;
};

export const apiUpdateTruck = async (id, payload, authPassword) => {
  const expressResult = await safeFetchJson(`/api/trucks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, auth_password: authPassword })
  });
  if (expressResult && expressResult.success) {
    return expressResult.data;
  }

  const trucks = getLocalStorageTrucks();
  const index = trucks.findIndex(t => String(t.id) === String(id));
  if (index !== -1) {
    const today = getTodayDateFormatted();
    trucks[index] = {
      ...trucks[index],
      ...payload,
      updated_at: today
    };
    saveLocalStorageTrucks(trucks);
    return trucks[index];
  }
  throw new Error('수정할 매물을 찾을 수 없습니다.');
};

export const apiDeleteTruck = async (id, authPassword, adminMasterKey) => {
  const expressResult = await safeFetchJson(`/api/trucks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auth_password: authPassword })
  });
  if (expressResult && expressResult.success) {
    return true;
  }

  const trucks = getLocalStorageTrucks();
  const targetIndex = trucks.findIndex(t => String(t.id) === String(id));
  if (targetIndex !== -1) {
    const target = trucks[targetIndex];
    const isMasterKey = authPassword === adminMasterKey;
    const isCorrectPassword = target.password_hash === authPassword || target.password === authPassword;

    if (!isMasterKey && !isCorrectPassword) {
      throw new Error('삭제 권한이 없습니다. 비밀번호가 일치하지 않습니다.');
    }

    trucks.splice(targetIndex, 1);
    saveLocalStorageTrucks(trucks);
    return true;
  }
  throw new Error('삭제할 매물을 찾을 수 없습니다.');
};
