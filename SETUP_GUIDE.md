# 🎉 Sellbox 설정 가이드

친근하고 귀여운 라이브 커머스 플랫폼 Sellbox입니다!

## 📋 목차
1. [Supabase 설정](#1-supabase-설정)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [데이터베이스 마이그레이션](#3-데이터베이스-마이그레이션)
4. [개발 서버 실행](#4-개발-서버-실행)

---

## 1. 🗄️ Supabase 설정

### 1.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 비밀번호, 리전 선택
4. 프로젝트 생성 완료 대기 (약 2분)

### 1.2 API 키 확인

1. 생성된 프로젝트 대시보드 접속
2. 왼쪽 메뉴에서 **Settings** → **API** 클릭
3. 다음 두 값을 복사해두기:
   - `Project URL` (예: https://xxxxx.supabase.co)
   - `anon public` key

---

## 2. 🔐 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

---

## 3. 🗃️ 데이터베이스 마이그레이션

### 3.1 SQL Editor에서 실행

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **New query** 버튼 클릭
3. `supabase/migrations/001_create_profiles.sql` 파일 내용 복사
4. 붙여넣기 후 **Run** 버튼 클릭

### 3.2 마이그레이션 내용

이 마이그레이션은 다음을 생성합니다:

#### 📊 profiles 테이블
- 사용자 프로필 정보 저장
- 회원가입 시 자동 생성 (트리거 사용)
- RLS (Row Level Security) 활성화
- 본인만 조회/수정 가능

#### 필드 구성
| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | 사용자 ID (auth.users 참조) |
| `email` | TEXT | 이메일 |
| `full_name` | TEXT | 이름 |
| `avatar_url` | TEXT | 프로필 이미지 URL |
| `bio` | TEXT | 자기소개 |
| `phone` | TEXT | 전화번호 |
| `created_at` | TIMESTAMPTZ | 생성일 |
| `updated_at` | TIMESTAMPTZ | 수정일 |

### 3.3 확인

SQL Editor에서 다음 쿼리로 확인:

```sql
-- 테이블 확인
SELECT * FROM public.profiles;

-- 트리거 확인
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

---

## 4. 🚀 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속!

---

## 🎨 주요 기능

### 1️⃣ 스플래시 화면
- 앱 실행 시 로고와 이름이 귀여운 애니메이션으로 등장
- 부드러운 그라디언트 배경
- 떠다니는 버블 효과

### 2️⃣ 로그인/회원가입
- 이메일 + 비밀번호 인증
- 회원가입 시 프로필 자동 생성
- 소셜 로그인 준비 (카카오톡, 구글)

### 3️⃣ 프로필 관리
- 이름, 전화번호, 자기소개 수정
- 프로필 정보는 나중에 활용 가능
- 계정 정보 확인

### 4️⃣ 스토어 생성
- 나만의 라이브 커머스 스토어 생성
- 고유한 핸들(URL) 설정
- 주문 관리 기능 (TODO)

---

## 🔧 트러블슈팅

### 문제: 로그인 후 바로 onboard로 이동
**원인**: 이전 세션이 남아있음

**해결**:
1. 브라우저 개발자 도구(F12) 열기
2. Application 탭 → Local Storage
3. `sb-` 로 시작하는 항목 삭제
4. 페이지 새로고침

또는 **시크릿 모드**로 테스트

### 문제: 회원가입 후 프로필이 생성되지 않음
**원인**: 트리거가 제대로 실행되지 않음

**해결**:
1. Supabase SQL Editor에서 다음 확인:
```sql
SELECT * FROM public.profiles WHERE email = 'your-email@example.com';
```
2. 트리거 재실행:
```sql
-- 마이그레이션 파일 다시 실행
```

### 문제: RLS 정책 오류
**원인**: RLS 정책이 제대로 적용되지 않음

**해결**:
```sql
-- RLS 상태 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- RLS 재활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

---

## 📚 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui
- **애니메이션**: Framer Motion
- **백엔드**: Supabase (Auth, Database)
- **토스트**: Sonner

---

## 🎯 다음 단계

### 즉시 사용 가능
- ✅ 회원가입/로그인
- ✅ 프로필 관리
- ✅ 스토어 생성

### 추가 예정 (TODO)
- [ ] 소셜 로그인 (카카오톡, 구글)
- [ ] 주문 관리 시스템
- [ ] 실시간 알림
- [ ] 프로필 이미지 업로드
- [ ] 스토어 커스터마이징

---

## 💡 팁

1. **개발 시**: `Confirm email` 설정을 OFF로 (빠른 테스트)
2. **프로덕션**: `Confirm email` 설정을 ON으로 (보안)
3. **테스트**: 시크릿 모드 사용 추천
4. **디버깅**: 브라우저 콘솔과 Supabase 로그 확인

---

## 📞 문의

문제가 발생하면:
1. 브라우저 콘솔 확인
2. Supabase 대시보드의 Logs 확인
3. 이 가이드의 트러블슈팅 섹션 참고

---

**즐거운 개발 되세요! 🎉✨**

