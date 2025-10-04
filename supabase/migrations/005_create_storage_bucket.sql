-- Create storage bucket for order images
-- 주문 이미지 저장을 위한 Storage 버킷 생성

-- 1. order-images 버킷 생성 (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-images',
  'order-images',
  true,  -- public bucket (공개 접근 가능)
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS 정책 설정

-- 2-1. 누구나 이미지 업로드 가능 (익명 구매자 포함)
CREATE POLICY "Anyone can upload order images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'order-images');

-- 2-2. 누구나 이미지 조회 가능 (공개 버킷)
CREATE POLICY "Anyone can view order images"
ON storage.objects FOR SELECT
USING (bucket_id = 'order-images');

-- 2-3. 인증된 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete order images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'order-images' 
  AND auth.role() = 'authenticated'
);

-- 2-4. 인증된 사용자만 업데이트 가능
CREATE POLICY "Authenticated users can update order images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'order-images' 
  AND auth.role() = 'authenticated'
);

