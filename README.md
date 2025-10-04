# 🎁 Sellbox - 라이브 커머스 플랫폼

친근하고 귀여우면서도 세련된 라이브 커머스 플랫폼입니다.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ 주요 기능

### 🎨 UI/UX
- ✅ **귀여운 스플래시 화면** - 앱 시작 시 애니메이션
- ✅ **카카오톡 스타일 네비게이션** - 하단 5개 메뉴 (홈, 상품, 주문, 알림, 프로필)
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

## 📱 사용자 플로우

```
앱 시작
  ↓
🎨 스플래시 화면 (2.5초)
  ↓
🔐 로그인/회원가입
  - 이메일 + 패스워드
  - ☑️ 자동 로그인 체크 가능
  ↓
🏪 스토어 선택
  - 기존 스토어 선택
  - ➕ 새 스토어 생성
  ↓
📊 대시보드
  ├─ 홈: 통계 & 빠른 작업
  ├─ 상품: 상품 관리 (준비중)
  ├─ 주문: 주문 관리 (준비중)
  ├─ 알림: 알림 확인 (준비중)
  └─ 프로필: 내 정보 수정
```

---

## 🗂️ 프로젝트 구조

```
sellbox/
├── src/
│   ├── app/
│   │   ├── auth/              # 로그인/회원가입
│   │   ├── stores/            # 스토어 선택/생성
│   │   ├── dashboard/         # 메인 대시보드
│   │   ├── products/          # 상품 관리 (준비중)
│   │   ├── orders/            # 주문 관리 (준비중)
│   │   ├── notifications/     # 알림 (준비중)
│   │   └── profile/           # 프로필 관리
│   ├── components/
│   │   ├── layout/            # Header, BottomNav
│   │   └── ui/                # shadcn/ui 컴포넌트
│   ├── contexts/
│   │   └── StoreContext.tsx   # 스토어 전역 상태
│   ├── lib/
│   │   ├── api/               # API 함수들
│   │   └── supabase/          # Supabase 클라이언트
│   └── types/
│       └── database.ts        # 타입 정의
├── supabase/
│   └── migrations/            # 데이터베이스 마이그레이션
├── public/
│   ├── sellbox-logo.svg       # 메인 로고
│   └── favicon.svg            # 파비콘
└── docs/                      # 문서들
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

### orders (준비중)
```sql
- id: UUID (PK)
- store_id: UUID (FK to stores)
- order_no: TEXT
- buyer_name: TEXT
- buyer_phone: TEXT
- items_json: JSONB
- amount: NUMERIC
- status: order_status
- created_at: TIMESTAMPTZ
```

---

## 🎯 구현 완료 기능

### ✅ Phase 1: MVP (완료)
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

---

## 🚧 개발 예정 기능

### 🔄 Phase 2: 소셜 로그인
- [ ] 카카오톡 로그인
- [ ] 구글 로그인
- [ ] OAuth 연동
- [ ] 소셜 프로필 동기화

### 📦 Phase 3: 상품 관리
- [ ] 상품 등록/수정/삭제
- [ ] 상품 이미지 업로드
- [ ] 상품 카테고리
- [ ] 재고 관리
- [ ] 상품 검색/필터

### 📋 Phase 4: 주문 관리
- [ ] 주문 목록 조회
- [ ] 주문 상태 변경
- [ ] 주문 상세 정보
- [ ] 배송 정보 입력
- [ ] 주문 통계

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

### 1. 회원가입 & 로그인 테스트
```
1. http://localhost:3000 접속
2. 스플래시 화면 확인 (2.5초)
3. 이메일/비밀번호 입력
4. ☑️ 자동 로그인 체크
5. 회원가입 버튼 클릭
6. 스토어 선택 페이지로 이동 확인
```

### 2. 자동 로그인 테스트
```
체크 ✅:
1. 로그인 시 자동 로그인 체크
2. 브라우저 닫기
3. 브라우저 다시 열기
4. 자동으로 스토어 선택 페이지로 이동 ✅

체크 ❌:
1. 로그인 시 자동 로그인 체크 안 함
2. 브라우저 닫기
3. 브라우저 다시 열기
4. 로그인 페이지로 이동 (자동 로그아웃) ✅
```

### 3. 멀티 스토어 테스트
```
1. 스토어 선택 페이지에서 + 버튼
2. 새 스토어 생성
3. 대시보드 상단에서 "전환" 버튼
4. 다른 스토어 선택
5. 선택한 스토어로 전환 확인
```

### 4. 보안 테스트
```
1. 사용자 A로 스토어 생성
2. 로그아웃
3. 사용자 B로 로그인
4. 사용자 A의 스토어가 안 보이는지 확인 ✅
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

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---

## 👨‍💻 개발자

**Sellbox Team**

- 프로젝트 시작: 2024년 10월
- 개발 환경: Next.js + Supabase
- 컨셉: 친근하고 귀여운 라이브 커머스

---

## 🎯 비전

Sellbox는 **누구나 쉽게 시작할 수 있는** 라이브 커머스 플랫폼을 목표로 합니다.

- 🎨 **친근한 디자인**: 어렵지 않게, 즐겁게
- 🚀 **빠른 시작**: 5분 안에 스토어 오픈
- 💪 **강력한 기능**: 필요한 모든 것을 한 곳에
- 🔒 **안전한 보안**: 데이터 완벽 보호

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
