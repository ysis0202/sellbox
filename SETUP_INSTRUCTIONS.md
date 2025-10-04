# 🎁 Sellbox 설치 가이드

라이브 커머스 주문 관리 시스템 Sellbox의 설치 및 설정 가이드입니다.

## 📋 목차

1. [Supabase 설정](#1-supabase-설정)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [데이터베이스 마이그레이션](#3-데이터베이스-마이그레이션)
4. [Storage 설정](#4-storage-설정)
5. [개발 서버 실행](#5-개발-서버-실행)
6. [테스트](#6-테스트)

---

## 1. 🗄️ Supabase 설정

### 1.1 프로젝트 생성

1. https://supabase.com 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `sellbox`
   - Database Password: 안전한 비밀번호 설정
   - Region: 가까운 리전 선택 (예: Northeast Asia - Seoul)
4. "Create new project" 클릭 (약 2분 소요)

### 1.2 API 키 확인

1. 프로젝트 대시보드 → Settings → API
2. 다음 값들을 복사해두기:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

---

## 2. 🔐 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 앱 URL (프로덕션용)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

> ⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

---

## 3. 🗃️ 데이터베이스 마이그레이션

### 3.1 마이그레이션 파일 실행

Supabase Dashboard → SQL Editor에서 다음 파일들을 **순서대로** 실행:

#### ✅ Step 1: 프로필 테이블 생성

`supabase/migrations/001_create_profiles.sql` 파일 내용 복사 → SQL Editor에 붙여넣기 → Run

**포함 내용:**
- `profiles` 테이블 생성
- 자동 프로필 생성 트리거
- RLS 정책

#### ✅ Step 2: 스토어 보안 정책

`supabase/migrations/002_stores_security.sql` 파일 내용 복사 → Run

**포함 내용:**
- `stores` 테이블 RLS 정책
- 데이터 격리 보장

#### ✅ Step 3: 라이브 세션 & 주문 테이블

`supabase/migrations/003_live_sessions.sql` 파일 내용 복사 → Run

**포함 내용:**
- `live_sessions` 테이블 (라이브 방송 세션)
- `orders` 테이블 (주문 정보)
- 세션 코드 자동 생성
- 주문 번호 자동 생성
- RLS 정책

#### ✅ Step 4: 구매자 닉네임 필드 추가

`supabase/migrations/004_add_buyer_nickname.sql` 파일 내용 복사 → Run

**포함 내용:**
- `buyer_nickname` 필드 추가
- 이름+닉네임 식별 시스템

#### ✅ Step 5: Storage 버킷 생성 ⚠️ 중요!

`supabase/migrations/005_create_storage_bucket.sql` 파일 내용 복사 → Run

**포함 내용:**
- `order-images` 버킷 자동 생성
- Storage RLS 정책
- 익명 업로드 허용 (구매자용)

> **주의**: 이 마이그레이션을 실행하지 않으면 **"Bucket not found"** 오류가 발생합니다!

### 3.2 확인

SQL Editor에서 다음 쿼리로 확인:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 예상 결과: profiles, stores, live_sessions, orders
```

---

## 4. 📦 Storage 설정

### 방법 1: SQL 마이그레이션으로 자동 생성 (추천 ⭐)

위의 **Step 5: `005_create_storage_bucket.sql`**를 실행하면 자동으로 생성됩니다!

### 방법 2: Dashboard에서 수동 생성

SQL 마이그레이션이 실패하거나 수동으로 생성하고 싶다면:

1. **Supabase Dashboard → Storage**
2. **"New bucket"** 클릭
3. 버킷 생성:
   - **Name**: `order-images`
   - **Public**: ✅ **체크 필수!** (구매자가 업로드한 이미지를 판매자가 볼 수 있어야 함)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
4. **"Create bucket"** 클릭

### 4.2 Storage 정책 확인

Storage → `order-images` → Policies에서 다음 정책이 있는지 확인:

- ✅ **Anyone can upload order images** (INSERT)
- ✅ **Anyone can view order images** (SELECT)
- ✅ **Authenticated users can delete** (DELETE)
- ✅ **Authenticated users can update** (UPDATE)

> **없다면**: `005_create_storage_bucket.sql` 파일을 다시 실행하세요!

---

## 5. 🚀 개발 서버 실행

### 5.1 의존성 설치

```bash
npm install
```

### 5.2 개발 서버 시작

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속!

---

## 6. 🧪 테스트

### 6.1 회원가입 & 로그인

1. http://localhost:3000 접속
2. 스플래시 화면 확인
3. 이메일/비밀번호로 회원가입
4. ✅ 자동 로그인 체크
5. 로그인 성공

### 6.2 스토어 생성

1. 스토어 이름 입력 (예: "내 상점")
2. 핸들 입력 (예: "myshop")
3. 스토어 생성 완료

### 6.3 라이브 세션 생성

1. 하단 네비게이션 → 세션
2. "새 세션 만들기" 버튼
3. 세션 정보 입력:
   - 이름: "1월 5일 저녁 라이브"
   - 설명: "겨울 신상품 특가"
   - 입금 정보: 은행명, 계좌번호, 예금주
4. "세션 만들기" → 성공!

### 6.4 QR 코드 확인

1. 생성된 세션 클릭
2. QR 코드 자동 생성 확인
3. 링크 복사 또는 QR 다운로드

### 6.5 구매자 주문 테스트 (시크릿 모드)

1. 시크릿 모드로 브라우저 열기
2. QR 코드 링크로 접속 (예: `http://localhost:3000/order/ABC123`)
3. 상품 이미지 업로드
4. 구매자 정보 입력
5. 주문하기 → 성공!

### 6.6 판매자 주문 확인

1. 일반 브라우저로 돌아가기
2. 세션 상세 페이지에서 실시간 주문 확인
3. 또는 하단 네비게이션 → 주문 → 전체 주문 확인
4. 주문 상태 변경 테스트:
   - 대기중 → 주문 확인
   - 확인완료 → 입금 확인
   - 입금완료 → 배송 시작
   - 배송중 → 완료 처리

---

## 🎯 주요 기능

### ✅ 완성된 기능

1. **라이브 세션 관리**
   - 세션 생성/종료/재개
   - QR 코드 자동 생성
   - 세션별 주문 집계

2. **주문 관리**
   - 구매자가 상품 캡처 이미지 업로드
   - 주문 상태 관리 (대기 → 확인 → 입금 → 배송 → 완료)
   - 주문 번호 자동 생성

3. **이미지 업로드**
   - 자동 리사이징
   - Supabase Storage 연동
   - 최대 10MB 제한

4. **멀티 스토어**
   - 한 계정에서 여러 스토어 운영
   - 데이터 완벽 격리

### 🔄 선택사항 (나중에 추가 가능)

- 실시간 주문 알림 (Supabase Realtime)
- 입금 증명 사진 업로드
- 배송 정보 관리
- 통계 대시보드

---

## 🐛 트러블슈팅

### 문제 1: "Bucket not found" 오류 ⚠️

**증상**: 주문 시 이미지 업로드 실패, 콘솔에 "Bucket not found" 오류

**원인**: Storage 버킷이 생성되지 않음

**해결 방법**:

#### 방법 A: SQL로 생성 (빠름)
```sql
-- Supabase Dashboard → SQL Editor에서 실행
-- 005_create_storage_bucket.sql 파일 내용 전체 복사해서 실행
```

#### 방법 B: Dashboard에서 수동 생성
1. Supabase Dashboard → **Storage**
2. **[Create a new bucket]** 클릭
3. 설정:
   - Name: `order-images`
   - Public: ✅ **체크 필수!**
   - File size limit: `10 MB`
4. **[Create bucket]** 클릭

#### 방법 C: 버킷 존재 확인
```sql
-- SQL Editor에서 버킷 확인
SELECT * FROM storage.buckets WHERE id = 'order-images';
```

결과가 없으면 → 위 방법 A 또는 B로 생성

### 문제 2: 이미지 업로드는 되는데 보이지 않음

**원인**: Public 설정이 안 되어 있음

**해결**:
1. Storage → `order-images` → Settings
2. "Public bucket" 체크
3. Save

### 문제 2: 주문 생성 시 RLS 오류

**원인**: RLS 정책이 제대로 적용되지 않음

**해결**:
```sql
-- 주문 생성 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- 정책이 없으면 마이그레이션 파일 재실행
```

### 문제 3: 세션 코드가 생성되지 않음

**원인**: 트리거 함수가 실행되지 않음

**해결**:
```sql
-- 트리거 확인
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_set_session_code';

-- 003_live_sessions.sql 재실행
```

---

## 📚 참고 문서

- [README.md](./README.md) - 프로젝트 개요
- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - 보안 가이드
- [supabase/README.md](./supabase/README.md) - DB 가이드

---

## 💡 다음 단계

설치가 완료되었다면:

1. **프로덕션 배포**: Vercel 또는 다른 호스팅 서비스에 배포
2. **도메인 연결**: 커스텀 도메인 설정
3. **환경 변수**: 프로덕션 환경 변수 설정
4. **이메일 확인**: Supabase Auth에서 이메일 인증 활성화

---

**🎉 설치 완료! 즐거운 개발 되세요!**

Made with 💖 by Sellbox Team

