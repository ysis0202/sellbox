-- 007_fix_order_no_trigger.sql
-- order_no 트리거 함수 수정 (변수명 충돌 해결)

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS generate_order_no() CASCADE;
DROP FUNCTION IF EXISTS set_order_no() CASCADE;

-- 주문 번호 생성 함수 재생성 (변수명 명확히 구분)
CREATE OR REPLACE FUNCTION generate_order_no()
RETURNS TEXT AS $$
DECLARE
  v_date TEXT;
  v_sequence INTEGER;
  v_order_no TEXT;
BEGIN
  -- 오늘 날짜 (YYYYMMDD)
  v_date := to_char(now(), 'YYYYMMDD');
  
  -- 오늘 날짜의 마지막 주문 번호 찾기
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(orders.order_no FROM 10) AS INTEGER
      )
    ), 0
  ) + 1
  INTO v_sequence
  FROM public.orders
  WHERE orders.order_no LIKE v_date || '-%';
  
  -- 주문 번호 생성: YYYYMMDD-0001 형식
  v_order_no := v_date || '-' || LPAD(v_sequence::TEXT, 4, '0');
  
  RETURN v_order_no;
END;
$$ LANGUAGE plpgsql;

-- 주문 생성 시 order_no 자동 생성 트리거 함수
CREATE OR REPLACE FUNCTION set_order_no()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_no IS NULL OR NEW.order_no = '' THEN
    NEW.order_no := generate_order_no();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 재생성
DROP TRIGGER IF EXISTS trigger_set_order_no ON public.orders;

CREATE TRIGGER trigger_set_order_no
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_no();

-- 확인
COMMENT ON FUNCTION generate_order_no() IS '주문 번호 자동 생성 (YYYYMMDD-0001 형식)';
COMMENT ON FUNCTION set_order_no() IS '주문 삽입 시 order_no 자동 설정';

