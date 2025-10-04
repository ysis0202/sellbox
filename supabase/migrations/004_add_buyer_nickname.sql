-- 004_add_buyer_nickname.sql
-- 구매자 닉네임 필드 추가

-- orders 테이블에 buyer_nickname 컬럼 추가
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS buyer_nickname TEXT NOT NULL DEFAULT '';

-- 기존 데이터에 대한 처리 (buyer_name을 닉네임으로 사용)
UPDATE public.orders 
SET buyer_nickname = buyer_name 
WHERE buyer_nickname = '';

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_orders_buyer_name_nickname 
ON public.orders(buyer_name, buyer_nickname);

COMMENT ON COLUMN public.orders.buyer_nickname IS '구매자 닉네임 (이름과 함께 식별용)';

