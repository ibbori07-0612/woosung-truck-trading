# Implementation Plan - 우성특장차매매 (Woosung Special Truck Trading Website)

우성특장차매매 웹사이트 구축 프로젝트입니다. 반응형(Mobile-First) 레이아웃, 고급스러운 Deep Navy (`#0B192C`) 브랜딩 테마, 비밀번호 기반 무회원 게시물 관리 및 관리자 마스터 키 기능, 필터링/검색 및 갤러리/리스트 뷰 전환 기능을 갖춘 풀스택 웹 애플리케이션을 개발합니다.
데이터베이스는 Supabase 프로젝트 (`https://ewaxcjwygzfvsbuxnyix.supabase.co`) 및 로컬 DB 듀얼 지원으로 연동하며, 결과물 및 코드는 **GitHub 저장소**를 생성하여 업로드합니다.

## User Review Required

> [!IMPORTANT]
> - **GitHub 저장소 공유**: 개발 완료 후 코드와 웹사이트 프로젝트를 GitHub 저장소에 푸시하여 GitHub 상에서 코드를 확인 및 배포(GitHub Pages / Vercel 연동 등) 가능하도록 만듭니다.
> - **Supabase 데이터베이스 연동 (`https://ewaxcjwygzfvsbuxnyix.supabase.co`)**:
>   - Supabase SQL 에디터에서 바로 실행 가능한 완벽한 DDL 스크립트 (`supabase_schema.sql`)를 제공합니다.
>   - `.env` 파일에 Supabase Anon Key 및 Service Role Key 연동 설정 기능을 추가합니다.
>   - 키 설정 전이나 오프라인 환경에서도 서비스가 100% 정상 작동하는 하이브리드 백엔드 구조로 작성합니다.
> - **관리자 마스터 키**: 비회원 작성 시스템과 별도로 전체 게시글 수정/삭제가 가능한 관리자 마스터 키 (`woosung8949` 등)가 기본 탑재됩니다.
> - **기본 프리셋 데이터**: 구동 직후 서비스가 풍성해 보이도록 실제 특장차 매물 데이터 샘플(추레라, 트레일러, 덤프테라 등)을 기본 제공합니다.

## Proposed Changes

### Tech Stack & Project Setup

- **Frontend**: React + Vite + `@supabase/supabase-js` + Lucide Icons + Vanilla CSS (Deep Navy `#0B192C` Design System)
- **Backend**: Express.js Server (`server.js`) + Supabase SDK & REST API
- **Database & Storage**: Supabase DB (`https://ewaxcjwygzfvsbuxnyix.supabase.co`) + Local File DB (`data/trucks.json`) & Local Media (`uploads/`)
- **Version Control & GitHub Integration**: GitHub Repository 생성 및 전체 프로젝트 소스 코드 푸시

---

### [Component 1] Supabase Database & Backend Infrastructure (`server/` & `supabase/`)

#### [NEW] [supabase_schema.sql](file:///c:/Users/MINA/Desktop/mina/Woosung/supabase_schema.sql)
- Supabase SQL 에디터용 테이블, 함수, Storage 버킷 및 초기 특장차 매물 샘플 데이터 INSERT문

#### [NEW] [server.js](file:///c:/Users/MINA/Desktop/mina/Woosung/server.js)
- Express REST API 구축 (Port: 5000 또는 3001)
- Supabase Client 연동 및 로컬 DB 하이브리드 핸들링

#### [NEW] [.env.example](file:///c:/Users/MINA/Desktop/mina/Woosung/.env.example) & [.env](file:///c:/Users/MINA/Desktop/mina/Woosung/.env)
- Supabase URL 및 키 연동 환경 변수

---

### [Component 2] Frontend Application (`src/`)

#### [NEW] [index.html](file:///c:/Users/MINA/Desktop/mina/Woosung/index.html) & [src/index.css](file:///c:/Users/MINA/Desktop/mina/Woosung/src/index.css)
- Deep Navy (`#0B192C`), Slate Accent, Warm Gold highlights, Modern Typography (Noto Sans KR / Outfit)
- 반응형 Grid & Flexbox layout system (Mobile-First)

#### [NEW] [src/lib/supabaseClient.js](file:///c:/Users/MINA/Desktop/mina/Woosung/src/lib/supabaseClient.js)
- `@supabase/supabase-js` 클라이언트 초기화 및 API 서비스 모듈

#### [NEW] [src/components/Header.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/Header.jsx)
- 상단 로고 '우성특장차매매', 바로가기 전화 버튼, '매물 등록' 버튼, 관리자 키 모달 열기 버튼

#### [NEW] [src/components/SearchFilter.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/SearchFilter.jsx)
- 텍스트 키워드 검색
- 필터 조건 (구분, 분류, 제작사, 제작년월 20년/1~12월, 위치 18개 지역)

#### [NEW] [src/components/TruckList.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/TruckList.jsx) & [src/components/TruckCard.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/TruckCard.jsx)
- 갤러리형(Card Grid) vs 리스트형(Compact Row List) 전환 뷰
- 정렬 기준 및 9단계 상태 배지 (A+ ~ C-)

#### [NEW] [src/components/TruckDetailModal.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/TruckDetailModal.jsx)
- 대표 사진 및 참고 사진 갤러리 (최대 10장), 상세 정보 표, Quick Action 전화/문자 버튼

#### [NEW] [src/components/TruckFormModal.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/TruckFormModal.jsx)
- 신규 작성 / 기존 글 수정 통합 폼 (필수/선택 입력 항목 유효성 검사 및 대표 이미지 필수 첨부)

#### [NEW] [src/components/AuthPasswordModal.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/AuthPasswordModal.jsx)
- 게시글 수정/삭제 작성자 비밀번호 및 관리자 마스터 키 검증 모달

#### [NEW] [src/components/Footer.jsx](file:///c:/Users/MINA/Desktop/mina/Woosung/src/components/Footer.jsx)
- 고정 푸터 (딜러 권정중 | 연락처: 010-7604-8949, 010-3335-3230 | 팩스: 032-888-3203)

---

### [Component 3] GitHub Repository Push & Documentation

- GitHub MCP 툴을 활용하여 GitHub 저장소(`woosung-truck-trading` 등)를 생성
- 전체 프론트엔드/백엔드 소스 코드 및 `README.md` 프로젝트 설명서 푸시

---

## Verification Plan

### Automated Verification
- Express API 및 React 빌드 구동 확인
- GitHub API를 통한 저장소 생성 및 코드 푸시 검증

### Manual Verification
- 반응형 웹 UI, 다중 검색 필터, 매물 등록/수정/삭제 비밀번호 검증, 푸터 연락처 상시 노출 확인
- GitHub 저장소 링크 및 파일 구조 최종 점검
