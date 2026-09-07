# 🚛 우성특장차매매 (Woosung Special Truck Trading Platform)

> 대한민국 대표 특장차 매매 전문 플랫폼 웹 애플리케이션입니다.  
> 반응형(Mobile-First) 디자인, 고급스러운 Deep Navy (`#0B192C`) 브랜딩, Supabase 데이터베이스 연동 및 무회원 작성자 비밀번호/관리자 마스터 키 검증 로직을 지원합니다.

---

## 🌟 주요 기능 및 요구사항 구현 (Features)

### 1. 기본 레이아웃 및 브랜딩 (Design & Layout)
- **메인 브랜드 색상**: Deep Navy (`#0B192C`) 바탕의 럭셔리 다크 테마 및 Accent Gold (`#FFB800`) / Teal (`#00D294`) 포인트
- **반응형 웹 (Mobile-First)**: 모바일, 태블릿, 데스크톱 화면 완벽 지원
- **헤더 브랜드 노출**: 상단 '우성특장차매매' 타이틀, 전화 바로가기, 매물 등록 및 관리자 모드 전용 버튼
- **고정 푸터 (Fixed Footer)**:
  * 딜러: **권정중**
  * 연락처: **010-7604-8949**, **010-3335-3230**
  * 팩스: **032-888-3203**
  * 모바일 클릭-투-콜 (Click-to-Call) 빠른 전화 탭바 제공

### 2. 다중 조건 검색 및 뷰 모드 (Search & Filter)
- **텍스트 키워드 검색**: 모델명, 상호, 위치, 상세 설명 실시간 검색
- **세부 조건 선택 필터**:
  * **구분**: 전체 / 삽니다 / 팝니다 / 완료
  * **분류**: 전체 / 추레라 / 트레일러 / 덤프테라
  * **제작사**: 전체 / 기아, 대우, 미쓰비시, 삼성, 스카니아, 쌍용, 아시아, 이베코, 현대, 기타
  * **제작년월**: 최근 20년 (2007년~2026년) / 1월~12월
  * **위치**: 전국 18개 지역 선택 (서울, 경기, 인천, 강원, 충북, 충남, 세종, 대전, 전북, 전남, 광주, 경북, 경남, 대구, 울산, 부산, 제주, 기타)
- **트럭 리스트 뷰 전환**:
  * 갤러리형 (카드 이미지 그립 뷰)
  * 리스트형 (가로형 컴팩트 목록 뷰)
- **정렬 기능**: 최신 등록순 / 가격 낮은순 / 가격 높은순 / 조회수 높은순

### 3. 검증 및 보안 로직 (Auth & Permissions)
- **회원가입 없는 무회원 게시물 등록**: 누구나 매물 글 작성 가능
- **본인 글 수정/삭제 비밀번호**: 작성 시 입력한 **영문+숫자 4자 이상** 비밀번호 검증
- **관리자 마스터 키**: 관리자 마스터 키 (`woosung8949`) 입력 시 모든 게시물 통합 수정/삭제 가능
- **자동 조회수 카운터**: 매물 상세 모달 진입 시 조회수(views) 자동 1 증가

### 4. 엄격한 데이터 필드 조건 (Data Schema)
- **등록일 / 수정일**: `YYYY.MM.DD` 형식 자동 저장
- **필수 항목**: 구분, 분류, 제작년월(연도/월), 상태(A+~C- 9단계), 제작사, 위치(18개 지역), 모델명, 가격(단위 '만원' 자동 부착), 상호, 연락처, 비밀번호, 대표 사진(jpg/jpeg/png 필수)
- **선택 항목**: 엔진(320~410 10단위), 밋션(스틱, 하이로, 오토), 할부/현금차, 운행 키로수(단위 'KM' 자동 부착), 참고 사진(최대 10장), 상세 설명

---

## 🗄️ 데이터베이스 연동 (Database)

### Supabase 데이터베이스 (`https://ewaxcjwygzfvsbuxnyix.supabase.co`)
본 프로젝트에는 프로젝트 루트에 `supabase_schema.sql` 파일이 포함되어 있습니다.  
Supabase 대시보드의 **SQL Editor**에 스크립트를 붙여넣어 실행하면 테이블, 조회수 증가 RPC 함수 및 초기 매물 데이터가 자동으로 생성됩니다.

`.env` 파일 설정 예시:
```env
VITE_SUPABASE_URL=https://ewaxcjwygzfvsbuxnyix.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

PORT=5000
ADMIN_MASTER_KEY=woosung8949
```

*(참고: Supabase 키 미설정 시에도 내장 로컬 DB `data/trucks.json`로 100% 정상 작동하는 하이브리드 백엔드 구조로 구동됩니다.)*

---

## 🚀 실행 방법 (Getting Started)

### 1. 의존성 패키지 설치
```bash
npm install
```

### 2. 백엔드 API 서버 실행 (Express, Port 5000)
```bash
npm run server
```

### 3. 프론트엔드 개발 서버 실행 (Vite, Port 3000)
```bash
npm run dev
```

### 4. 프로덕션 빌드 (Vite Production Build)
```bash
npm run build
```

---

## 📁 프로젝트 구조 (Directory Structure)

```
Woosung/
├── data/
│   └── trucks.json             # 로컬 영속 DB (샘플 매물 데이터 포함)
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # 메인 헤더 & 브랜드 타이틀
│   │   ├── SearchFilter.jsx    # 다중 조건 검색 및 필터링
│   │   ├── TruckList.jsx       # 뷰 모드 전환 및 정렬 컨트롤러
│   │   ├── TruckCard.jsx       # 갤러리/리스트형 트럭 카드
│   │   ├── TruckDetailModal.jsx# 이미지 갤러리 & 매물 상세 정보 모달
│   │   ├── TruckFormModal.jsx  # 매물 등록/수정 유효성 검사 폼
│   │   ├── AuthPasswordModal.jsx # 비밀번호 & 관리자 마스터 키 검증
│   │   └── Footer.jsx          # 고정 푸터 (딜러 권정중 & 연락처)
│   ├── lib/
│   │   └── supabaseClient.js   # Supabase 클라이언트 SDK
│   ├── App.jsx                 # 메인 애플리케이션 상태 관리
│   ├── index.css               # Deep Navy 디자인 시스템 CSS
│   └── main.jsx
├── server.js                   # Express REST API 백엔드 서버
├── supabase_schema.sql         # Supabase DDL SQL 스크립트
├── vite.config.js              # Vite 빌드 & 프록시 설정
├── package.json
└── README.md
```

---

## 📞 딜러 및 사업자 정보 (Contact & Footer Info)

- **담당 딜러**: 권정중
- **연락처**: `010-7604-8949` / `010-3335-3230`
- **팩스**: `032-888-3203`
