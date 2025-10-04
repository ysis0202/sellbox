# Supabase 마이그레이션

## 데이터베이스 설정

### 1. 마이그레이션 실행

Supabase 대시보드에서 SQL Editor를 열고 다음 파일들을 순서대로 실행하세요:

1. `migrations/001_create_profiles.sql` - 사용자 프로필 테이블 생성

### 2. 실행 방법

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New query** 버튼 클릭
5. 마이그레이션 파일 내용을 복사해서 붙여넣기
6. **Run** 버튼 클릭

### 3. 테이블 구조

#### profiles
- `id` (UUID) - auth.users.id 참조, Primary Key
- `email` (TEXT) - 사용자 이메일
- `full_name` (TEXT) - 사용자 이름
- `avatar_url` (TEXT) - 프로필 이미지 URL
- `bio` (TEXT) - 자기소개
- `phone` (TEXT) - 전화번호
- `created_at` (TIMESTAMPTZ) - 생성일
- `updated_at` (TIMESTAMPTZ) - 수정일

### 4. 자동 기능

- ✅ 회원가입 시 프로필 자동 생성 (trigger)
- ✅ 프로필 수정 시 updated_at 자동 업데이트
- ✅ RLS (Row Level Security) 활성화 - 본인만 조회/수정 가능
- ✅ 사용자 삭제 시 프로필 자동 삭제 (CASCADE)

### 5. 확인 방법

SQL Editor에서 다음 쿼리로 확인:

```sql
-- 테이블 확인
SELECT * FROM public.profiles;

-- 트리거 확인
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

