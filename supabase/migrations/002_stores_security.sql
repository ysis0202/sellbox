-- ============================================
-- Stores 테이블 보안 정책 (RLS)
-- ============================================
-- 이 마이그레이션은 스토어 데이터를 완벽하게 격리합니다.
-- 각 사용자는 자신의 스토어만 보고 관리할 수 있습니다.

-- RLS 활성화 (이미 활성화되어 있어도 안전)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있다면 삭제 (멱등성 보장)
DROP POLICY IF EXISTS "users_can_view_own_stores" ON public.stores;
DROP POLICY IF EXISTS "users_can_create_stores" ON public.stores;
DROP POLICY IF EXISTS "users_can_update_own_stores" ON public.stores;
DROP POLICY IF EXISTS "users_can_delete_own_stores" ON public.stores;

-- 1. 조회 정책: 자신의 스토어만 볼 수 있음
CREATE POLICY "users_can_view_own_stores"
  ON public.stores
  FOR SELECT
  USING (auth.uid() = owner_id);

-- 2. 생성 정책: 로그인한 사용자는 스토어를 만들 수 있음 (자신 소유로만)
CREATE POLICY "users_can_create_stores"
  ON public.stores
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- 3. 수정 정책: 자신의 스토어만 수정 가능
CREATE POLICY "users_can_update_own_stores"
  ON public.stores
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. 삭제 정책: 자신의 스토어만 삭제 가능
CREATE POLICY "users_can_delete_own_stores"
  ON public.stores
  FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- Orders 테이블 보안 강화
-- ============================================
-- 주문도 스토어 소유자만 볼 수 있도록 보장

-- RLS 활성화 확인
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "owner can read" ON public.orders;
DROP POLICY IF EXISTS "owner can write" ON public.orders;
DROP POLICY IF EXISTS "public can create order" ON public.orders;
DROP POLICY IF EXISTS "store_owner_can_view_orders" ON public.orders;
DROP POLICY IF EXISTS "store_owner_can_update_orders" ON public.orders;
DROP POLICY IF EXISTS "store_owner_can_delete_orders" ON public.orders;

-- 1. 조회 정책: 스토어 소유자만 자기 스토어의 주문을 볼 수 있음
CREATE POLICY "store_owner_can_view_orders"
  ON public.orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = orders.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- 2. 생성 정책: 공개 주문 생성 허용 (고객이 주문할 수 있도록)
CREATE POLICY "public_can_create_orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (store_id IS NOT NULL);

-- 3. 수정 정책: 스토어 소유자만 자기 스토어의 주문을 수정할 수 있음
CREATE POLICY "store_owner_can_update_orders"
  ON public.orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = orders.store_id
      AND stores.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = orders.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- 4. 삭제 정책: 스토어 소유자만 자기 스토어의 주문을 삭제할 수 있음
CREATE POLICY "store_owner_can_delete_orders"
  ON public.orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE stores.id = orders.store_id
      AND stores.owner_id = auth.uid()
    )
  );

-- ============================================
-- 검증 쿼리 (선택사항)
-- ============================================
-- 다음 쿼리로 정책이 올바르게 적용되었는지 확인할 수 있습니다:

-- 1. stores 테이블 RLS 확인
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'stores';

-- 2. stores 테이블 정책 확인
-- SELECT policyname, tablename, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE schemaname = 'public' AND tablename = 'stores';

-- 3. orders 테이블 정책 확인
-- SELECT policyname, tablename, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE schemaname = 'public' AND tablename = 'orders';

