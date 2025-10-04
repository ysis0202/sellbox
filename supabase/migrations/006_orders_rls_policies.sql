-- 006_orders_rls_policies.sql
-- 주문 테이블 RLS 정책 추가

-- 1. RLS 활성화 (아직 안 되어 있다면)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 주문 생성 가능 (익명 구매자 포함) ⭐ 핵심!
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- 3. 스토어 소유자만 자기 스토어의 주문 조회 가능
CREATE POLICY "Store owners can view their store orders"
ON public.orders FOR SELECT
USING (
  store_id IN (
    SELECT id FROM public.stores 
    WHERE owner_id = auth.uid()
  )
);

-- 4. 스토어 소유자만 자기 스토어의 주문 업데이트 가능
CREATE POLICY "Store owners can update their store orders"
ON public.orders FOR UPDATE
USING (
  store_id IN (
    SELECT id FROM public.stores 
    WHERE owner_id = auth.uid()
  )
);

-- 5. 스토어 소유자만 자기 스토어의 주문 삭제 가능
CREATE POLICY "Store owners can delete their store orders"
ON public.orders FOR DELETE
USING (
  store_id IN (
    SELECT id FROM public.stores 
    WHERE owner_id = auth.uid()
  )
);

-- 정책 확인
COMMENT ON POLICY "Anyone can create orders" ON public.orders 
IS '익명 구매자도 주문 생성 가능 (로그인 불필요)';

-- ========================================
-- live_sessions 테이블 RLS 정책
-- ========================================

-- 1. RLS 활성화
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 활성 세션 조회 가능 (세션 코드로 접근)
CREATE POLICY "Anyone can view active sessions"
ON public.live_sessions FOR SELECT
USING (status = 'active');

-- 3. 스토어 소유자만 자기 스토어의 세션 생성 가능
CREATE POLICY "Store owners can create sessions"
ON public.live_sessions FOR INSERT
WITH CHECK (
  store_id IN (
    SELECT id FROM public.stores 
    WHERE owner_id = auth.uid()
  )
);

-- 4. 스토어 소유자만 자기 스토어의 세션 업데이트 가능
CREATE POLICY "Store owners can update their sessions"
ON public.live_sessions FOR UPDATE
USING (
  store_id IN (
    SELECT id FROM public.stores 
    WHERE owner_id = auth.uid()
  )
);

-- 5. 스토어 소유자만 자기 스토어의 세션 삭제 가능
CREATE POLICY "Store owners can delete their sessions"
ON public.live_sessions FOR DELETE
USING (
  store_id IN (
    SELECT id FROM public.stores 
    WHERE owner_id = auth.uid()
  )
);

