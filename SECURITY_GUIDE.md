# 🔐 Sellbox 보안 가이드

## 데이터 격리 및 보안

Sellbox는 **RLS (Row Level Security)**를 사용하여 각 사용자의 데이터를 완벽하게 격리합니다.

---

## ✅ 보장되는 보안

### 1. **스토어 격리**
- ✅ 각 사용자는 **자신의 스토어만** 볼 수 있습니다
- ✅ 다른 사용자의 스토어는 **절대** 조회/수정/삭제 불가
- ✅ 스토어 생성 시 자동으로 본인 소유로 설정

### 2. **주문 격리**
- ✅ 각 스토어 소유자는 **자기 스토어의 주문만** 볼 수 있습니다
- ✅ 다른 사람의 주문은 **절대** 접근 불가
- ✅ 주문 수정/삭제도 스토어 소유자만 가능

### 3. **프로필 격리**
- ✅ 각 사용자는 **자신의 프로필만** 조회/수정 가능
- ✅ 다른 사용자의 프로필은 접근 불가

---

## 🛡️ RLS (Row Level Security)란?

데이터베이스 레벨에서 작동하는 보안 메커니즘입니다:

```sql
-- 예시: 스토어 조회 정책
CREATE POLICY "users_can_view_own_stores"
  ON public.stores
  FOR SELECT
  USING (auth.uid() = owner_id);
```

이 정책이 있으면:
- **사용자 A**: 본인 스토어만 조회 가능 ✅
- **사용자 B**: 사용자 A의 스토어 조회 불가 ❌
- **코드에서 실수해도**: 데이터베이스가 자동으로 차단 🛡️

---

## 🔍 보안 시나리오 테스트

### 시나리오 1: 스토어 조회
```
사용자 A (로그인됨)
  ↓
  내 스토어 조회 요청
  ↓
  Database RLS 체크:
  - auth.uid() = owner_id? ✅
  ↓
  사용자 A의 스토어만 반환 ✅
```

### 시나리오 2: 다른 사람 스토어 접근 시도
```
사용자 A (로그인됨)
  ↓
  사용자 B의 스토어 ID로 조회 시도
  ↓
  Database RLS 체크:
  - auth.uid() = owner_id? ❌
  ↓
  접근 거부! 아무것도 반환 안 됨 ❌
```

### 시나리오 3: URL 해킹 시도
```
악의적 사용자가 URL 조작:
/api/stores/other-user-store-id
  ↓
  Database RLS 체크:
  - auth.uid() = owner_id? ❌
  ↓
  404 Not Found (데이터 없음) 🛡️
```

---

## 📊 데이터 구조

### stores 테이블
```sql
┌────────────┬──────────┬─────────────┐
│ id         │ owner_id │ name        │
├────────────┼──────────┼─────────────┤
│ store-1    │ user-A   │ A의 스토어   │ ← user-A만 볼 수 있음
│ store-2    │ user-B   │ B의 스토어   │ ← user-B만 볼 수 있음
│ store-3    │ user-A   │ A의 2번째   │ ← user-A만 볼 수 있음
└────────────┴──────────┴─────────────┘
```

### orders 테이블
```sql
┌────────────┬──────────┬─────────────┐
│ id         │ store_id │ buyer_name  │
├────────────┼──────────┼─────────────┤
│ order-1    │ store-1  │ 홍길동      │ ← store-1 소유자(user-A)만 볼 수 있음
│ order-2    │ store-2  │ 김철수      │ ← store-2 소유자(user-B)만 볼 수 있음
└────────────┴──────────┴─────────────┘
```

---

## 🔧 마이그레이션 실행

Supabase SQL Editor에서 다음 파일을 **순서대로** 실행:

### 1. 프로필 테이블 (이미 실행함)
```sql
-- supabase/migrations/001_create_profiles.sql
```

### 2. ⭐ 스토어 보안 정책 (새로 추가!)
```sql
-- supabase/migrations/002_stores_security.sql
```

**중요**: 이 마이그레이션을 실행해야 완벽한 데이터 격리가 보장됩니다!

---

## ✅ 보안 확인 방법

Supabase SQL Editor에서 실행:

### 1. RLS 활성화 확인
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('stores', 'orders', 'profiles');
```

**결과 예시**:
```
tablename  | rowsecurity
-----------+-------------
stores     | true        ✅
orders     | true        ✅
profiles   | true        ✅
```

### 2. 정책 확인
```sql
SELECT 
  policyname,
  tablename,
  cmd,
  permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**결과 예시**:
```
policyname                        | tablename | cmd    | permissive
----------------------------------+-----------+--------+------------
users_can_view_own_stores         | stores    | SELECT | PERMISSIVE ✅
users_can_create_stores           | stores    | INSERT | PERMISSIVE ✅
users_can_update_own_stores       | stores    | UPDATE | PERMISSIVE ✅
store_owner_can_view_orders       | orders    | SELECT | PERMISSIVE ✅
...
```

---

## 🧪 실제 테스트

### 테스트 1: 본인 스토어만 보이는지
1. 사용자 A로 로그인
2. 스토어 2개 생성
3. 스토어 목록 확인 → 2개만 보임 ✅

### 테스트 2: 다른 사용자로 확인
1. 로그아웃
2. 사용자 B로 로그인
3. 스토어 목록 확인 → 비어있음 ✅

### 테스트 3: 브라우저 콘솔에서 테스트
```javascript
// 사용자 A로 로그인 후
const { data } = await supabase
  .from('stores')
  .select('*');

console.log(data); 
// → 본인 스토어만 표시 ✅
```

---

## 🚨 일반적인 실수

### ❌ 잘못된 방법
```typescript
// RLS 없이 코드로만 필터링
const stores = await supabase
  .from('stores')
  .select('*');
  
// 문제: 코드 실수 시 모든 스토어 노출 가능!
```

### ✅ 올바른 방법
```typescript
// RLS가 있으면 자동으로 필터링됨
const stores = await supabase
  .from('stores')
  .select('*');
  
// RLS가 자동으로: WHERE owner_id = auth.uid() 추가
// 코드 실수해도 안전! 🛡️
```

---

## 🎯 정리

### 현재 보안 상태

| 항목 | 상태 | 설명 |
|------|------|------|
| 코드 레벨 필터링 | ✅ | `getMyStores()` 등에서 `owner_id` 체크 |
| Database RLS | ⚠️ | **002_stores_security.sql 실행 필요!** |
| 프로필 격리 | ✅ | 001에서 이미 설정됨 |

### RLS 마이그레이션 실행 후

| 항목 | 상태 |
|------|------|
| 코드 레벨 필터링 | ✅ |
| Database RLS | ✅ |
| 프로필 격리 | ✅ |
| 스토어 격리 | ✅ |
| 주문 격리 | ✅ |

---

## 🔒 결론

**002_stores_security.sql을 실행하면**:

1. ✅ 각 사용자는 자신의 스토어**만** 볼 수 있습니다
2. ✅ 다른 사람 데이터와 **절대** 겹치지 않습니다
3. ✅ URL 해킹, 코드 실수에도 **안전**합니다
4. ✅ 데이터베이스 레벨에서 **완벽하게 격리**됩니다

**지금 바로 마이그레이션을 실행하세요!** 🚀

