-- Storage 정책 확인 쿼리
-- Supabase SQL Editor에서 실행하세요

SELECT 
  policyname as "정책 이름",
  cmd as "작업",
  qual as "조건",
  with_check as "체크"
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%order-images%'
ORDER BY cmd;

-- 예상 결과:
-- 1. Anyone can upload order images (INSERT)
-- 2. Anyone can view order images (SELECT)
-- 3. Authenticated users can delete order images (DELETE)
-- 4. Authenticated users can update order images (UPDATE)

