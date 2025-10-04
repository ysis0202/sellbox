-- 003_live_sessions.sql
-- 라이브 커머스 세션 관리를 위한 테이블 생성

-- live_sessions 테이블: 라이브 방송 판매 세션
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  session_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  
  -- 입금 정보
  bank_name TEXT,
  bank_account TEXT,
  bank_holder TEXT,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ
);

-- orders 테이블 재설계
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT UNIQUE NOT NULL,
  
  -- 세션 & 스토어
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  
  -- 구매자 정보
  buyer_name TEXT NOT NULL,
  buyer_nickname TEXT NOT NULL, -- 구매자 닉네임 (이름과 함께 식별용)
  buyer_phone TEXT NOT NULL,
  buyer_contact TEXT, -- 카톡ID, 인스타 등
  
  -- 상품 정보 (구매자가 등록)
  product_image_url TEXT NOT NULL, -- 캡처 이미지
  product_note TEXT, -- 구매자 메모
  buyer_price_info TEXT, -- 구매자가 본 가격
  
  -- 가격 & 결제
  amount NUMERIC(10,2), -- 판매자가 확정
  payment_method TEXT DEFAULT '계좌이체',
  payment_proof_url TEXT, -- 입금 증명
  
  -- 배송 정보
  zipcode TEXT,
  address1 TEXT,
  address2 TEXT,
  delivery_note TEXT,
  
  -- 배송 처리
  ship_courier TEXT,
  ship_tracking_no TEXT,
  ship_photo_url TEXT,
  
  -- 상태
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled')
  ),
  
  -- 메모
  seller_note TEXT, -- 판매자 메모
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 인덱스 생성
CREATE INDEX idx_live_sessions_store_id ON public.live_sessions(store_id);
CREATE INDEX idx_live_sessions_session_code ON public.live_sessions(session_code);
CREATE INDEX idx_live_sessions_status ON public.live_sessions(status);

CREATE INDEX idx_orders_session_id ON public.orders(session_id);
CREATE INDEX idx_orders_store_id ON public.orders(store_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- RLS 활성화
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- live_sessions RLS 정책
-- 판매자: 본인 스토어의 세션만 조회/수정 가능
CREATE POLICY "판매자는 본인 스토어의 세션을 조회할 수 있습니다"
  ON public.live_sessions
  FOR SELECT
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "판매자는 본인 스토어에 세션을 생성할 수 있습니다"
  ON public.live_sessions
  FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "판매자는 본인 스토어의 세션을 수정할 수 있습니다"
  ON public.live_sessions
  FOR UPDATE
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "판매자는 본인 스토어의 세션을 삭제할 수 있습니다"
  ON public.live_sessions
  FOR DELETE
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

-- 누구나 session_code로 세션 정보를 조회할 수 있음 (공개 접근)
CREATE POLICY "누구나 활성 세션을 session_code로 조회할 수 있습니다"
  ON public.live_sessions
  FOR SELECT
  USING (status = 'active');

-- orders RLS 정책
-- 판매자: 본인 스토어의 주문만 조회/수정
CREATE POLICY "판매자는 본인 스토어의 주문을 조회할 수 있습니다"
  ON public.orders
  FOR SELECT
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "판매자는 본인 스토어의 주문을 수정할 수 있습니다"
  ON public.orders
  FOR UPDATE
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "판매자는 본인 스토어의 주문을 삭제할 수 있습니다"
  ON public.orders
  FOR DELETE
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

-- 누구나 주문 생성 가능 (구매자)
CREATE POLICY "누구나 주문을 생성할 수 있습니다"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- 주문 번호 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_order_no()
RETURNS TEXT AS $$
DECLARE
  today TEXT;
  seq_num INTEGER;
  order_no TEXT;
BEGIN
  today := to_char(now(), 'YYYYMMDD');
  
  -- 오늘 날짜의 마지막 주문 번호 찾기
  SELECT COALESCE(
    MAX(
      CAST(
        substring(order_no FROM length(today) + 2)
        AS INTEGER
      )
    ), 0
  ) + 1
  INTO seq_num
  FROM public.orders
  WHERE order_no LIKE today || '-%';
  
  order_no := today || '-' || lpad(seq_num::TEXT, 4, '0');
  RETURN order_no;
END;
$$ LANGUAGE plpgsql;

-- 주문 생성 시 order_no 자동 생성 트리거
CREATE OR REPLACE FUNCTION set_order_no()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_no IS NULL OR NEW.order_no = '' THEN
    NEW.order_no := generate_order_no();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_no
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_no();

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 세션의 주문 수 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_session_order_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.live_sessions
    SET order_count = order_count + 1
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.live_sessions
    SET order_count = GREATEST(order_count - 1, 0)
    WHERE id = OLD.session_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_order_count
  AFTER INSERT OR DELETE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_session_order_count();

-- 짧은 세션 코드 생성 함수 (6자리 영숫자)
CREATE OR REPLACE FUNCTION generate_session_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 혼동되는 문자 제외
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    -- 중복 확인
    SELECT EXISTS(SELECT 1 FROM public.live_sessions WHERE session_code = result)
    INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 세션 생성 시 session_code 자동 생성 트리거
CREATE OR REPLACE FUNCTION set_session_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_code IS NULL OR NEW.session_code = '' THEN
    NEW.session_code := generate_session_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_session_code
  BEFORE INSERT ON public.live_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_session_code();

-- 초기 데이터 확인
COMMENT ON TABLE public.live_sessions IS '라이브 방송 판매 세션';
COMMENT ON TABLE public.orders IS '고객 주문 정보';

