# 🎁 Sellbox - 라이브 커머스 주문 관리 플랫폼

**유튜브 숏츠, 틱톡 등 라이브 방송 판매자를 위한 스마트 주문 관리 시스템**

실시간 라이브 방송 중 QR 코드/링크로 손쉽게 주문받고, 자동으로 정리된 주문을 한눈에 관리하세요!

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 💡 왜 Sellbox인가?

### 기존 라이브 판매의 문제점
- 📱 구매자가 플랫폼 메시지로 캡처 이미지 전송
- 💬 채팅으로 뒤섞인 주문 내역
- 📝 수동으로 정리해야 하는 주문 정보
- 🏦 계좌번호 반복해서 알려주기
- 📦 배송지 따로 받기

### Sellbox의 해결책 ✨
- ✅ **QR 코드 하나로 모든 주문 접수**
- ✅ **구매자별 자동 그룹핑** (이름 + 닉네임)
- ✅ **실시간 주문 확인** 
- ✅ **자동 입력 기능** (재주문 시)
- ✅ **상태별 주문 관리** (대기 → 입금 → 배송 → 완료)

---

## ✨ 핵심 기능

### 🎥 라이브 세션 관리 (핵심 기능!)
- ✅ **즉시 세션 생성** - 3초 안에 QR 코드 자동 생성
- ✅ **QR 코드 & 링크** - 다운로드, 복사, 공유 원클릭
- ✅ **세션별 주문 집계** - 실시간 주문 수, 조회수 확인
- ✅ **입금 정보 자동 표시** - 구매자에게 자동으로 계좌번호 표시
- ✅ **세션 종료/재개** - 라이브 상황에 맞게 관리

### 🛒 스마트 주문 시스템
- ✅ **이미지 기반 주문** - 화면 캡처 업로드로 간편하게
- ✅ **자동 이미지 리사이징** - 최대 10MB, 자동 최적화
- ✅ **구매자별 식별** - 이름 + 닉네임으로 정확한 구분
- ✅ **자동 정보 저장** - 두 번째 주문부터 정보 자동 입력
- ✅ **스마트 배송 정보** - 첫 주문만 필수, 이후 선택
- ✅ **주문 번호 자동 생성** - 날짜-순번 형식

### 📊 강력한 주문 관리
- ✅ **구매자별 그룹핑** - 같은 이름+닉네임 자동 묶기
- ✅ **다중 주문 한눈에** - 한 사람이 여러 상품 주문해도 깔끔하게
- ✅ **상태별 관리** - 대기 → 확인 → 입금 → 배송 → 완료
- ✅ **원클릭 상태 변경** - 버튼 하나로 단계 진행
- ✅ **통계 대시보드** - 오늘 주문, 대기중, 배송중 한눈에

### 🎨 UI/UX
- ✅ **귀여운 스플래시 화면** - 앱 시작 시 애니메이션
- ✅ **모바일 최적화 네비게이션** - 하단 5개 메뉴 (홈, 세션, 주문, 알림, 프로필)
- ✅ **글래스모피즘 디자인** - 반투명 카드와 백드롭 블러
- ✅ **부드러운 애니메이션** - Framer Motion 활용
- ✅ **반응형 디자인** - 모바일 최적화 (max-w-lg)
- ✅ **다크 모드 지원** - 자동 테마 전환

### 🔐 인증 & 보안
- ✅ **이메일/패스워드 로그인** - Supabase Auth
- ✅ **자동 로그인 옵션** - 체크박스로 선택 가능
- ✅ **프로필 자동 생성** - 회원가입 시 트리거로 자동 생성
- ✅ **RLS (Row Level Security)** - 데이터베이스 레벨 보안
- ✅ **세션 관리** - localStorage + sessionStorage
- 🔄 **소셜 로그인** (준비중) - 카카오톡, 구글

### 🏪 멀티 스토어 시스템
- ✅ **여러 스토어 운영** - 한 계정에서 여러 스토어 관리
- ✅ **스토어 선택** - 원하는 스토어로 쉽게 전환
- ✅ **스토어 생성** - 이름과 핸들(URL) 설정
- ✅ **데이터 격리** - 각 스토어 데이터 완벽 분리
- ✅ **스토어별 권한** - 소유자만 접근 가능

### 👤 프로필 관리
- ✅ **프로필 정보** - 이름, 전화번호, 자기소개
- ✅ **계정 정보 확인** - 가입일, 마지막 수정일
- ✅ **프로필 수정** - 언제든지 정보 업데이트
- ✅ **로그아웃** - 모든 페이지에서 가능

### 📊 대시보드
- ✅ **통계 카드** - 오늘 주문, 매출, 고객, 성장률
- ✅ **빠른 작업** - 자주 사용하는 기능 바로가기
- ✅ **최근 활동** - 활동 내역 확인
- ✅ **스토어 전환** - 대시보드에서 바로 전환

### 🎨 디자인 시스템
- ✅ **커스텀 로고** - 선물 박스 컨셉의 귀여운 로고
- ✅ **그라디언트 배경** - 핑크-퍼플-블루 색상
- ✅ **커스텀 스크롤바** - 브랜드 컬러
- ✅ **마이크로 애니메이션** - 호버, 클릭 효과
- ✅ **이모지 활용** - 친근한 UX

---

## 🚀 시작하기

### 1. 설치

```bash
cd C:\Users\mycom\Desktop\dev\sellbox
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 마이그레이션

Supabase Dashboard → SQL Editor에서 실행:

1. **`supabase/migrations/001_create_profiles.sql`**
   - 프로필 테이블 생성
   - 자동 프로필 생성 트리거

2. **`supabase/migrations/002_stores_security.sql`** ⚠️ 필수!
   - 스토어 보안 정책 (RLS)
   - 주문 보안 정책
   - 데이터 격리 보장

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📱 판매자 플로우

```
📱 앱 시작
  ↓
🔐 로그인/회원가입
  - 이메일 + 패스워드
  - ☑️ 자동 로그인
  ↓
🏪 스토어 선택/생성
  - 여러 스토어 운영 가능
  ↓
📊 대시보드
  - 통계 확인
  - 빠른 작업
  ↓
🎥 라이브 세션 생성
  - 세션 이름 입력
  - 입금 정보 입력
  - QR 코드 자동 생성 ✨
  ↓
📺 라이브 방송 시작
  - QR 코드 화면에 표시
  - 구매자들이 QR 스캔
  ↓
📦 실시간 주문 확인
  - 새 주문 즉시 확인
  - 구매자별로 자동 정리
  ↓
✅ 주문 관리
  - 주문 확인
  - 입금 확인
  - 배송 처리
  - 완료
```

## 🛍️ 구매자 플로우

```
📱 QR 코드 스캔 or 링크 클릭
  ↓
📸 상품 이미지 업로드
  - 화면 캡처한 사진
  ↓
📝 정보 입력
  - 이름 + 닉네임 ⭐
  - 연락처
  - (이전 주문 시 자동 입력!)
  ↓
🏠 배송지 입력
  - 첫 주문: 필수 ⚠️
  - 재주문: 선택
  ↓
💳 입금 정보 확인
  - 자동으로 계좌번호 표시
  ↓
✅ 주문 완료!
  - 주문번호 발급
  - 🛒 다시 주문하기 버튼
    (같은 정보로 다른 상품 주문)
```

---

## 🗂️ 프로젝트 구조

```
sellbox/
├── src/
│   ├── app/
│   │   ├── auth/                    # 로그인/회원가입
│   │   ├── stores/                  # 스토어 선택/생성
│   │   ├── dashboard/               # 메인 대시보드
│   │   ├── sessions/                # 🆕 라이브 세션 관리
│   │   │   ├── page.tsx            # 세션 목록
│   │   │   ├── new/                # 새 세션 생성
│   │   │   └── [id]/               # 세션 상세 (QR 코드)
│   │   ├── order/                   # 🆕 구매자 주문 페이지
│   │   │   └── [sessionCode]/      # 주문 입력
│   │   │       ├── page.tsx        # 주문 폼
│   │   │       └── success/        # 주문 완료
│   │   ├── orders/                  # 🆕 주문 관리 (판매자)
│   │   ├── notifications/           # 알림 (준비중)
│   │   └── profile/                 # 프로필 관리
│   ├── components/
│   │   ├── layout/                  # Header, BottomNav
│   │   └── ui/                      # shadcn/ui 컴포넌트
│   ├── contexts/
│   │   └── StoreContext.tsx         # 스토어 전역 상태
│   ├── lib/
│   │   ├── api/
│   │   │   ├── sessions.ts         # 🆕 세션 API
│   │   │   ├── orders.ts           # 🆕 주문 API
│   │   │   ├── profile.ts          # 프로필 API
│   │   │   └── stores.ts           # 스토어 API
│   │   ├── upload.ts               # 🆕 이미지 업로드
│   │   ├── qr.ts                   # 🆕 QR 코드 생성
│   │   └── supabase/               # Supabase 클라이언트
│   └── types/
│       └── database.ts              # 타입 정의
├── supabase/
│   └── migrations/
│       ├── 001_create_profiles.sql      # 프로필 테이블
│       ├── 002_stores_security.sql      # 스토어 보안
│       ├── 003_live_sessions.sql        # 🆕 세션 & 주문 테이블
│       └── 004_add_buyer_nickname.sql   # 🆕 닉네임 필드
├── public/
│   ├── sellbox-logo.svg             # 메인 로고
│   └── favicon.svg                  # 파비콘
└── SETUP_INSTRUCTIONS.md            # 🆕 상세 설치 가이드
```

---

## 🛡️ 보안 기능

### RLS (Row Level Security)
각 테이블마다 보안 정책 적용:

#### Profiles (프로필)
- ✅ 본인 프로필만 조회/수정 가능

#### Stores (스토어)
- ✅ 본인 스토어만 조회/수정/삭제 가능
- ✅ 다른 사용자 스토어 접근 불가

#### Orders (주문)
- ✅ 본인 스토어의 주문만 조회/수정 가능
- ✅ 공개 주문 생성 허용 (고객용)

### 세션 관리
- **자동 로그인 ✅**: localStorage에 저장 (영구)
- **자동 로그인 ❌**: sessionStorage만 사용 (브라우저 닫으면 삭제)

---

## 🎨 디자인 가이드

### 컬러 팔레트

```css
/* 메인 그라디언트 */
--gradient-main: linear-gradient(to right, #EC4899, #A855F7, #3B82F6);

/* 배경 그라디언트 */
--bg-gradient: linear-gradient(to bottom right, 
  #fce7f3, /* pink-50 */
  #faf5ff, /* purple-50 */
  #eff6ff  /* blue-50 */
);

/* 포인트 컬러 */
--accent-pink: #EC4899;
--accent-purple: #A855F7;
--accent-blue: #3B82F6;
--accent-gold: #F59E0B;
```

### 타이포그래피

- **제목**: font-black (900), 그라디언트 텍스트
- **본문**: font-medium (500), gray-700
- **보조**: font-normal (400), gray-500

### 스페이싱

- **카드 패딩**: p-6 ~ p-8
- **섹션 간격**: mb-6
- **요소 간격**: gap-3 ~ gap-4

---

## 🔧 기술 스택

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Toast**: Sonner

### Backend
- **BaaS**: Supabase
- **Auth**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (준비중)

### Development
- **Package Manager**: npm
- **Linter**: ESLint
- **Build Tool**: Turbopack

---

## 📊 데이터베이스 스키마

### profiles
```sql
- id: UUID (PK, FK to auth.users)
- email: TEXT
- full_name: TEXT
- avatar_url: TEXT
- bio: TEXT
- phone: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### stores
```sql
- id: UUID (PK)
- owner_id: UUID (FK to auth.users)
- name: TEXT
- handle: TEXT (UNIQUE)
- created_at: TIMESTAMPTZ
```

### live_sessions (🆕 라이브 세션)
```sql
- id: UUID (PK)
- store_id: UUID (FK to stores)
- name: TEXT                    # 세션 이름
- description: TEXT             # 설명 (선택)
- session_code: TEXT (UNIQUE)   # 6자리 코드 (자동 생성)
- status: TEXT                  # active, closed
- bank_name: TEXT               # 은행명
- bank_account: TEXT            # 계좌번호
- bank_holder: TEXT             # 예금주
- view_count: INTEGER           # 조회수
- order_count: INTEGER          # 주문 수
- created_at: TIMESTAMPTZ
- closed_at: TIMESTAMPTZ
```

### orders (🆕 주문)
```sql
- id: UUID (PK)
- order_no: TEXT (UNIQUE)         # 자동 생성 (YYYYMMDD-0001)
- session_id: UUID                # FK to live_sessions
- store_id: UUID                  # FK to stores

# 구매자 정보
- buyer_name: TEXT                # 이름 ⭐
- buyer_nickname: TEXT            # 닉네임 ⭐ (이름과 함께 식별)
- buyer_phone: TEXT               # 연락처
- buyer_contact: TEXT             # 카톡ID, 인스타 등

# 상품 정보 (구매자가 등록)
- product_image_url: TEXT         # 캡처 이미지 URL
- product_note: TEXT              # 상품 메모
- buyer_price_info: TEXT          # 구매자가 본 가격

# 결제 & 배송
- amount: NUMERIC                 # 최종 가격 (판매자 확정)
- payment_method: TEXT            # 결제 방법
- payment_proof_url: TEXT         # 입금 증명
- zipcode, address1, address2     # 배송지
- delivery_note: TEXT             # 배송 메모
- ship_courier: TEXT              # 택배사
- ship_tracking_no: TEXT          # 송장번호

# 상태 관리
- status: TEXT                    # pending, confirmed, paid, 
                                  # shipped, completed, cancelled
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- confirmed_at, paid_at, shipped_at, completed_at
```

---

## 🎯 구현 완료 기능

### ✅ Phase 1: 기본 인프라 (완료)
- [x] 스플래시 화면
- [x] 로그인/회원가입 (이메일)
- [x] 자동 로그인 옵션
- [x] 프로필 관리
- [x] 멀티 스토어 시스템
- [x] 스토어 선택/생성
- [x] 대시보드 기본 구조
- [x] 하단 네비게이션
- [x] RLS 보안 정책
- [x] 커스텀 로고 디자인

### ✅ Phase 2: 라이브 커머스 시스템 (완료) 🆕
- [x] 라이브 세션 생성/관리
- [x] QR 코드 자동 생성
- [x] 세션 코드 (6자리) 자동 생성
- [x] QR 코드 다운로드/복사/공유
- [x] 세션 종료/재개 기능
- [x] 실시간 주문 확인

### ✅ Phase 3: 스마트 주문 시스템 (완료) 🆕
- [x] 구매자 주문 페이지 (공개 접근)
- [x] 이미지 업로드 (자동 리사이징)
- [x] 이름 + 닉네임 식별 시스템
- [x] 구매자별 정보 자동 저장
- [x] 자동 정보 불러오기 (재주문 시)
- [x] 첫 주문 시 배송 정보 필수
- [x] 주문 번호 자동 생성
- [x] 주문 완료 페이지

### ✅ Phase 4: 주문 관리 시스템 (완료) 🆕
- [x] 전체 주문 목록
- [x] 구매자별 자동 그룹핑
- [x] 한 구매자의 여러 주문 묶어서 표시
- [x] 상태별 관리 (6단계)
- [x] 원클릭 상태 변경
- [x] 주문 통계 대시보드
- [x] 실시간 새로고침

---

## 🚧 개발 예정 기능

### 🔔 Phase 5: 알림 시스템
- [ ] 실시간 알림
- [ ] 푸시 알림 (PWA)
- [ ] 알림 설정
- [ ] 알림 내역

### 📊 Phase 6: 통계 & 분석
- [ ] 실시간 매출 통계
- [ ] 차트/그래프
- [ ] 기간별 리포트
- [ ] 인기 상품 분석
- [ ] 고객 분석

### 💬 Phase 7: 고객 관리
- [ ] 고객 목록
- [ ] 고객 정보 관리
- [ ] 주문 내역 조회
- [ ] 메모/태그 기능

### 🎨 Phase 8: 스토어 커스터마이징
- [ ] 스토어 테마 설정
- [ ] 로고 업로드
- [ ] 배너 이미지
- [ ] 소개글 작성

### 📱 Phase 9: PWA
- [ ] 오프라인 지원
- [ ] 홈 화면 추가
- [ ] 백그라운드 동기화
- [ ] 푸시 알림

---

## 🧪 테스트 가이드

### 1. 기본 설정 테스트
```bash
# 개발 서버 시작 (네트워크 노출)
npm run dev

# 컴퓨터: http://localhost:3000
# 핸드폰: http://192.168.x.x:3000 (같은 Wi-Fi 필요)
```

### 2. 회원가입 & 스토어 생성
```
1. http://localhost:3000 접속
2. 스플래시 화면 확인
3. 이메일/비밀번호로 회원가입
4. ☑️ 자동 로그인 체크
5. 스토어 이름, 핸들 입력
6. 대시보드 진입 ✅
```

### 3. 라이브 세션 생성 (판매자)
```
1. 하단 네비게이션 → "세션" 탭
2. "새 세션 만들기" 버튼
3. 세션 정보 입력:
   - 이름: "1월 5일 저녁 라이브"
   - 설명: "겨울 신상품"
   - 은행: "토스뱅크"
   - 계좌: "1234-5678-9012"
   - 예금주: "홍길동"
4. "세션 만들기" 클릭
5. QR 코드 자동 생성 확인 ✅
6. [복사] [저장] [공유] 버튼 확인
```

### 4. 주문 테스트 (구매자) - 핸드폰 권장
```
📱 시나리오 A: 첫 주문 (홍길동-길동이)
1. QR 스캔 or 링크 접속
2. 상품 이미지 업로드 (화면 캡처)
3. 상품 메모: "검정색 L 사이즈"
4. 구매자 정보:
   - 이름: "홍길동"
   - 닉네임: "길동이" ⭐
   - 연락처: "010-1234-5678"
5. 배송 정보: "* 최초 1회 필수" 확인
   - 주소 입력 (필수)
6. 주문하기 → 완료 ✅

📱 시나리오 B: 재주문 (같은 사람)
1. 주문 완료 페이지에서 "🛒 다시 주문하기"
2. 정보 자동 입력 확인! ✨
3. 배송 정보: "(선택)" 확인
4. 다른 상품 이미지만 업로드
5. 주문하기 → 완료 ✅

📱 시나리오 C: 다른 구매자 (김철수-철수맘)
1. 같은 QR로 접속
2. 이름: "김철수"
3. 닉네임: "철수맘" ⭐
4. 첫 주문이므로 배송 정보 필수
5. 주문 완료 ✅
```

### 5. 주문 관리 테스트 (판매자)
```
💻 컴퓨터 브라우저:
1. 하단 네비게이션 → "주문" 탭
2. 구매자별 그룹핑 확인:
   - 홍길동 @길동이 (2건) 🎯
   - 김철수 @철수맘 (1건) 🎯
3. 각 주문별로 이미지, 메모 확인
4. 상태 변경 테스트:
   - [주문 확인] 클릭 → "확인완료" 상태
   - [입금 확인] 클릭 → "입금완료" 상태
   - [배송 시작] 클릭 → "배송중" 상태
   - [완료 처리] 클릭 → "완료" 상태
5. 통계 확인 (대기, 입금완료, 배송중)
```

### 6. 자동 정보 불러오기 테스트 ⭐
```
📱 핸드폰:
1. QR 접속
2. 이름: "홍길동" 입력
3. 닉네임: "길동이" 입력
   → 💡 자동으로 연락처, 주소 입력됨!
   → 토스트: "길동이님, 다시 오셨네요!"
4. 상품만 선택하고 주문 완료 ✅
```

### 7. 구매자별 식별 테스트 ⭐
```
📱 같은 이름, 다른 닉네임:
- "홍길동-길동이" → 별도 저장
- "홍길동-홍반장" → 별도 저장
- "김철수-철수맘" → 별도 저장

💻 판매자 화면:
→ 각각 다른 그룹으로 표시됨! ✅
```

---

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다. 

이슈 발견 시 [GitHub Issues](https://github.com/yourusername/sellbox/issues)에 등록해주세요.

---

## 📚 문서

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - 설치 및 설정 가이드
- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - 보안 및 데이터 격리 가이드
- [supabase/README.md](./supabase/README.md) - 데이터베이스 마이그레이션 가이드

---

## 🤝 기여하기

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 변경 로그

### v0.2.0 (2024-10-04)
- ✨ 멀티 스토어 시스템 추가
- ✨ 자동 로그인 체크박스 추가
- 🎨 커스텀 로고 디자인
- 🔒 RLS 보안 정책 강화
- 💄 UI/UX 전면 개선

### v0.1.0 (2024-10-03)
- 🎉 초기 릴리즈
- ✨ 기본 인증 시스템
- ✨ 프로필 관리
- ✨ 대시보드 구조
- 🎨 디자인 시스템 구축

---

## 🌟 핵심 특징

### 1. 🎯 이름 + 닉네임 식별 시스템
**같은 이름도 닉네임으로 구분!**
- 홍길동-길동이 
- 홍길동-홍반장
- 김철수-철수맘
→ 각각 다른 구매자로 관리 ✅

### 2. 🤖 자동 정보 저장
**두 번째 주문부터는 자동!**
- 이름 + 닉네임만 입력
- 연락처, 주소 자동 입력
- 상품만 선택하면 끝 ✨

### 3. 📦 스마트 배송 정보
**첫 주문만 필수!**
- 첫 주문: 배송 정보 필수 ⚠️
- 재주문: 선택사항 (변경 가능)

### 4. 📊 구매자별 그룹핑
**한 사람의 여러 주문을 한눈에!**
- 홍길동 @길동이 (3건)
  - #1 티셔츠
  - #2 바지  
  - #3 모자
→ 묶어서 관리하고 함께 배송 가능 ✅

---

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---

## 👨‍💻 개발자

**Sellbox Team**

- 프로젝트 시작: 2025년 1월
- 개발 환경: Next.js 15 + Supabase
- 컨셉: 라이브 커머스 판매자를 위한 스마트 주문 관리

---

## 🎯 비전

Sellbox는 **라이브 방송 판매자를 위한 최고의 주문 관리 플랫폼**을 목표로 합니다.

- 📱 **즉시 시작**: QR 코드 하나로 3초 만에 준비 완료
- 🤖 **자동화**: 반복 작업은 자동, 판매에만 집중
- 📊 **스마트 관리**: 구매자별 자동 정리, 상태별 관리
- 🔒 **안전한 보안**: 데이터 완벽 보호 (RLS)
- 💪 **확장 가능**: 여러 스토어, 무한 세션

---

## 💡 FAQ

### Q: 회원가입은 어떻게 하나요?
A: 이메일과 비밀번호만 있으면 됩니다. 소셜 로그인(카카오톡, 구글)은 곧 추가될 예정입니다.

### Q: 여러 스토어를 운영할 수 있나요?
A: 네! 한 계정에서 여러 스토어를 만들고 쉽게 전환할 수 있습니다.

### Q: 내 스토어 데이터는 안전한가요?
A: 네! RLS (Row Level Security)로 데이터베이스 레벨에서 완벽하게 격리됩니다.

### Q: 모바일에서도 사용 가능한가요?
A: 네! 모바일 최적화된 반응형 디자인입니다. PWA로 앱처럼 사용 가능합니다 (곧 출시).

### Q: 오프라인에서도 작동하나요?
A: PWA 기능이 추가되면 오프라인에서도 일부 기능을 사용할 수 있습니다.

---

## 🌟 특별 감사

- [Next.js](https://nextjs.org/) - 훌륭한 React 프레임워크
- [Supabase](https://supabase.com/) - 최고의 오픈소스 Firebase 대체제
- [shadcn/ui](https://ui.shadcn.com/) - 아름다운 컴포넌트 라이브러리
- [Framer Motion](https://www.framer.com/motion/) - 부드러운 애니메이션
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크

---

**⭐ 이 프로젝트가 마음에 드신다면 Star를 눌러주세요!**

Made with 💖 by Sellbox Team
