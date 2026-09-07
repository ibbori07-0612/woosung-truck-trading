-- ============================================================
-- 우성특장차매매 Supabase SQL Schema (https://ewaxcjwygzfvsbuxnyix.supabase.co)
-- ============================================================

-- 1. Create trucks table
CREATE TABLE IF NOT EXISTS public.trucks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_type VARCHAR(20) NOT NULL CHECK (registration_type IN ('팝니다', '삽니다', '완료')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('추레라', '트레일러', '덤프테라')),
    year_month VARCHAR(20) NOT NULL, -- YYYY.MM format
    condition_grade VARCHAR(10) NOT NULL CHECK (condition_grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-')),
    manufacturer VARCHAR(50) NOT NULL CHECK (manufacturer IN ('기아', '대우', '미쓰비시', '삼성', '스카니아', '쌍용', '아시아', '이베코', '현대', '기타')),
    location VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    price INT NOT NULL, -- 단위: 만원
    company_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL, -- 작성자 비밀번호
    main_image_url TEXT NOT NULL,
    
    -- Optional fields
    engine_power INT CHECK (engine_power BETWEEN 320 AND 410),
    transmission VARCHAR(20) CHECK (transmission IN ('스틱', '하이로', '오토')),
    payment_type VARCHAR(50) CHECK (payment_type IN ('할부', '현금', '할부/현금')),
    mileage INT, -- 단위: KM
    reference_images JSONB DEFAULT '[]'::jsonb, -- 참고 사진 최대 10장
    description TEXT,
    
    -- Counter & Timestamps
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create view increment RPC function
CREATE OR REPLACE FUNCTION increment_truck_views(truck_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.trucks
    SET views = views + 1
    WHERE id = truck_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Row Level Security (RLS) policies
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trucks" ON public.trucks
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert trucks" ON public.trucks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update trucks" ON public.trucks
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete trucks" ON public.trucks
    FOR DELETE USING (true);

-- 4. Sample Seed Data for Instant Visual Demo
INSERT INTO public.trucks (
    id, registration_type, category, year_month, condition_grade, manufacturer, location,
    model_name, price, company_name, contact_number, password_hash, main_image_url,
    engine_power, transmission, payment_type, mileage, reference_images, description, views, created_at
) VALUES 
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111', '팝니다', '추레라', '2022.08', 'A+', '스카니아', '경기',
    '스카니아 R540 6X2 트랙터', 14500, '우성특장차', '010-7604-8949', 'ws1234',
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    410, '오토', '할부/현금', 185000,
    '["https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1586191582066-6b2195f32a7e?auto=format&fit=crop&w=1000&q=80"]',
    '1인 신조 올순정 차량입니다. 무사고 점검 완료. 경정비 완료되어 바로 현장 투입 가능합니다.', 142, CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    'a1b2c3d4-e5f6-7890-abcd-222222222222', '팝니다', '덤프테라', '2020.03', 'A', '현대', '인천',
    '현대 엑시언트 25톤 덤프', 9800, '우성물류', '010-3335-3230', 'ws1234',
    'https://images.unsplash.com/photo-1586191582066-6b2195f32a7e?auto=format&fit=crop&w=1200&q=80',
    400, '하이로', '현금', 240000,
    '["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80"]',
    '엔진 오일 및 소모품 주기적 교환. 타이어 상태 85% 이상 남아있습니다.', 89, CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'a1b2c3d4-e5f6-7890-abcd-333333333333', '삽니다', '트레일러', '2021.11', 'A-', '대우', '경북',
    '타타대우 프리마 콤비 트레일러 구합니다', 7500, '신선상사', '010-7604-8949', 'ws1234',
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
    380, '스틱', '할부', 310000,
    '[]',
    '상태 양호한 타타대우 트레일러 급구합니다. 전국 어디든 출장 매입 가능합니다.', 215, CURRENT_TIMESTAMP - INTERVAL '7 days'
),
(
    'a1b2c3d4-e5f6-7890-abcd-444444444444', '완료', '추레라', '2019.05', 'B+', '볼보', '충남',
    '볼보 FH540 6X2 글로브트로터', 11200, '우성특장', '010-3335-3230', 'ws1234',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    410, '오토', '현금', 380000,
    '[]',
    '거래 완료된 매물입니다. 성원에 감사드립니다.', 340, CURRENT_TIMESTAMP - INTERVAL '12 days'
);
