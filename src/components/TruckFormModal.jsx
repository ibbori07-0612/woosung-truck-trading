import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';

const REGISTRATION_TYPES = ['팝니다', '삽니다', '완료'];
const CATEGORIES = ['추레라', '트레일러', '덤프테라'];
const CONDITION_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
const MANUFACTURERS = ['기아', '대우', '미쓰비시', '삼성', '스카니아', '쌍용', '아시아', '이베코', '현대', '기타'];
const LOCATIONS = [
  '서울', '경기', '인천', '강원', '충북', '충남', '세종', '대전',
  '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주', '기타'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => String(currentYear - i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

// 320 ~ 410 (10단위)
const ENGINE_POWERS = Array.from({ length: 10 }, (_, i) => String(320 + i * 10));
const TRANSMISSIONS = ['스틱', '하이로', '오토'];
const PAYMENT_TYPES = ['할부', '현금', '할부/현금'];

export default function TruckFormModal({ initialData, onClose, onSubmit }) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    registration_type: initialData?.registration_type || '팝니다',
    category: initialData?.category || '추레라',
    year: initialData?.year_month ? initialData.year_month.split('.')[0] : YEARS[0],
    month: initialData?.year_month ? initialData.year_month.split('.')[1] || '01' : '01',
    condition_grade: initialData?.condition_grade || 'A+',
    manufacturer: initialData?.manufacturer || '현대',
    location: initialData?.location || '경기',
    model_name: initialData?.model_name || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    company_name: initialData?.company_name || '',
    contact_number: initialData?.contact_number || '010-7604-8949',
    password: '',
    main_image_url: initialData?.main_image_url || '',
    engine_power: initialData?.engine_power ? String(initialData.engine_power) : '',
    transmission: initialData?.transmission || '',
    payment_type: initialData?.payment_type || '',
    mileage: initialData?.mileage ? String(initialData.mileage) : '',
    reference_images: initialData?.reference_images || [],
    description: initialData?.description || ''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(initialData?.main_image_url || '');
  const [refImagePreviews, setRefImagePreviews] = useState(initialData?.reference_images || []);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  // Main Image Upload Handler
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        setErrorMsg('대표 사진은 jpg, jpeg, png 파일만 첨부 가능합니다.');
        return;
      }
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, main_image_url: file.name }));
      setErrorMsg('');
    }
  };

  // Reference Images Upload Handler (Up to 10 photos)
  const handleRefImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + refImagePreviews.length > 10) {
      setErrorMsg('참고 사진은 최대 10장까지 첨부할 수 있습니다.');
      return;
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setRefImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Validate password logic: Alphanumeric 4+ chars
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check
    if (!formData.model_name.trim()) {
      setErrorMsg('모델명을 입력해 주세요.');
      return;
    }
    if (formData.price === '' || isNaN(Number(formData.price))) {
      setErrorMsg('가격을 올바른 숫자로 입력해 주세요.');
      return;
    }
    if (!formData.company_name.trim()) {
      setErrorMsg('상호를 입력해 주세요.');
      return;
    }
    if (!formData.contact_number.trim()) {
      setErrorMsg('연락처를 입력해 주세요.');
      return;
    }

    // Password validation check
    if (!isEdit || formData.password) {
      if (!validatePassword(formData.password)) {
        setErrorMsg('비밀번호는 영문과 숫자를 조합하여 4자 이상 입력해야 합니다.');
        return;
      }
    }

    // Representative Image Check
    if (!mainImagePreview && !formData.main_image_url) {
      setErrorMsg('대표 사진(jpg/jpeg/png) 첨부는 필수입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepared payload
      const payload = {
        ...formData,
        year_month: `${formData.year}.${formData.month.padStart(2, '0')}`,
        price: Number(formData.price),
        engine_power: formData.engine_power ? Number(formData.engine_power) : null,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        main_image_url: mainImagePreview || formData.main_image_url || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
        reference_images: refImagePreviews
      };

      await onSubmit(payload);
    } catch (err) {
      setErrorMsg(err.message || '매물 저장 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '특장차 매물 정보 수정' : '신규 특장차 매물 등록'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errorMsg && (
            <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-red)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: 14 }}>
            1. 필수 입력 항목 (Required)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {/* 구분 */}
            <div className="form-group">
              <label>구분 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <select className="form-select" name="registration_type" value={formData.registration_type} onChange={handleChange} required>
                {REGISTRATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* 분류 */}
            <div className="form-group">
              <label>분류 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* 제작년월 */}
            <div className="form-group">
              <label>제작년월 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="form-select" name="year" value={formData.year} onChange={handleChange} style={{ flex: 1 }}>
                  {YEARS.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select className="form-select" name="month" value={formData.month} onChange={handleChange} style={{ flex: 1 }}>
                  {MONTHS.map(m => <option key={m} value={m}>{parseInt(m, 10)}월</option>)}
                </select>
              </div>
            </div>

            {/* 상태 9단계 */}
            <div className="form-group">
              <label>상태 등급 (A+~C- 9단계) <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <select className="form-select" name="condition_grade" value={formData.condition_grade} onChange={handleChange} required>
                {CONDITION_GRADES.map(g => <option key={g} value={g}>{g} 등급</option>)}
              </select>
            </div>

            {/* 제작사 */}
            <div className="form-group">
              <label>제작사 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <select className="form-select" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required>
                {MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* 위치 */}
            <div className="form-group">
              <label>위치 (전국 18개 지역) <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <select className="form-select" name="location" value={formData.location} onChange={handleChange} required>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* 모델명 */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>모델명 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <input className="form-input" type="text" name="model_name" value={formData.model_name} onChange={handleChange} placeholder="예: 스카니아 R540 6X2 트랙터" required />
            </div>

            {/* 가격 */}
            <div className="form-group">
              <label>가격 <span style={{ color: 'var(--accent-gold)' }}>*</span> (단위: 만원)</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="예: 14500" required style={{ width: '100%' }} />
                <span style={{ position: 'absolute', right: 12, top: 10, color: 'var(--accent-gold)', fontWeight: 700 }}>만원</span>
              </div>
            </div>

            {/* 상호 */}
            <div className="form-group">
              <label>상호 (업체명) <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <input className="form-input" type="text" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="예: 우성특장차" required />
            </div>

            {/* 연락처 */}
            <div className="form-group">
              <label>연락처 <span style={{ color: 'var(--accent-gold)' }}>*</span></label>
              <input className="form-input" type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="예: 010-7604-8949" required />
            </div>

            {/* 비밀번호 */}
            <div className="form-group">
              <label>비밀번호 <span style={{ color: 'var(--accent-gold)' }}>*</span> (영문+숫자 4자 이상)</label>
              <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="영문+숫자 4자 이상" required={!isEdit} />
            </div>
          </div>

          {/* 대표 사진 필수 첨부 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              대표 사진 <span style={{ color: 'var(--accent-gold)' }}>* (jpg, jpeg, png 필수 첨부)</span>
            </label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                <Upload size={16} />
                <span>대표 사진 파일 선택</span>
                <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleMainImageChange} style={{ display: 'none' }} />
              </label>
              {mainImagePreview && (
                <div style={{ width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--accent-gold)' }}>
                  <img src={mainImagePreview} alt="대표사진 미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-bright)', marginBottom: 14 }}>
            2. 선택 입력 항목 (Optional)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {/* 엔진 */}
            <div className="form-group">
              <label>엔진 (320~410 10단위)</label>
              <select className="form-select" name="engine_power" value={formData.engine_power} onChange={handleChange}>
                <option value="">선택 안함</option>
                {ENGINE_POWERS.map(ep => <option key={ep} value={ep}>{ep} 마력</option>)}
              </select>
            </div>

            {/* 밋션 */}
            <div className="form-group">
              <label>밋션 (변속기)</label>
              <select className="form-select" name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="">선택 안함</option>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* 할부/현금차 */}
            <div className="form-group">
              <label>할부 / 현금 조건</label>
              <select className="form-select" name="payment_type" value={formData.payment_type} onChange={handleChange}>
                <option value="">선택 안함</option>
                {PAYMENT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* 운행 키로수 */}
            <div className="form-group">
              <label>운행 키로수 (단위: KM)</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type="number" name="mileage" value={formData.mileage} onChange={handleChange} placeholder="예: 185000" style={{ width: '100%' }} />
                <span style={{ position: 'absolute', right: 12, top: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>KM</span>
              </div>
            </div>
          </div>

          {/* 참고 사진 최대 10장 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              참고 사진 (최대 10장 선택)
            </label>
            <label className="btn btn-outline" style={{ cursor: 'pointer', marginBottom: 12 }}>
              <ImageIcon size={16} />
              <span>참고 사진 추가</span>
              <input type="file" accept="image/*" multiple onChange={handleRefImagesChange} style={{ display: 'none' }} />
            </label>

            {refImagePreviews.length > 0 && (
              <div className="thumbs-row">
                {refImagePreviews.map((img, idx) => (
                  <div key={idx} className="thumb-item" style={{ cursor: 'default' }}>
                    <img src={img} alt={`참고사진 ${idx+1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 상세 설명 */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>상세 설명</label>
            <textarea
              className="form-textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="특장차의 주요 정비 내역, 특징, 사고 유무 등을 자유롭게 기재해 주세요."
            />
          </div>

          {/* Submit Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border-navy)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? '저장 중...' : (isEdit ? '매물 수정완료' : '매물 등록완료')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
