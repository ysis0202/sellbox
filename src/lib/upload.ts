// src/lib/upload.ts
// 이미지 업로드 유틸리티

import { supabase } from "./supabase/client";

/**
 * 이미지 파일을 Supabase Storage에 업로드
 * @param file 업로드할 파일
 * @param bucket 버킷 이름 (기본: 'order-images')
 * @param folder 폴더 경로 (선택)
 * @returns 업로드된 파일의 public URL
 */
export async function uploadImage(
  file: File,
  bucket: string = "order-images",
  folder?: string
): Promise<string> {
  try {
    // 파일 확장자 추출
    const fileExt = file.name.split(".").pop();
    
    // 고유한 파일명 생성 (타임스탬프 + 랜덤)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${random}.${fileExt}`;
    
    // 경로 생성
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase()
      .storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    
    if (error) {
      throw error;
    }
    
    // Public URL 가져오기
    const { data: urlData } = supabase()
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}

/**
 * 여러 이미지 파일을 한번에 업로드
 * @param files 업로드할 파일 배열
 * @param bucket 버킷 이름
 * @param folder 폴더 경로
 * @returns 업로드된 파일들의 public URL 배열
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: string = "order-images",
  folder?: string
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, bucket, folder));
  return await Promise.all(uploadPromises);
}

/**
 * 이미지를 리사이징하여 업로드 (클라이언트 측)
 * @param file 원본 파일
 * @param maxWidth 최대 너비
 * @param maxHeight 최대 높이
 * @param quality 품질 (0-1)
 * @returns 리사이징된 파일
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // 비율 유지하면서 리사이징
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context를 가져올 수 없습니다."));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("이미지 변환에 실패했습니다."));
              return;
            }
            
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error("이미지 로드에 실패했습니다."));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error("파일 읽기에 실패했습니다."));
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 파일 검증
 * @param file 검증할 파일
 * @param maxSizeMB 최대 파일 크기 (MB)
 * @returns 검증 결과
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // 파일 타입 검증
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.",
    };
  }
  
  // 파일 크기 검증
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`,
    };
  }
  
  return { valid: true };
}

/**
 * 이미지를 리사이징 후 업로드
 * @param file 업로드할 파일
 * @param bucket 버킷 이름
 * @param folder 폴더 경로
 * @returns 업로드된 파일의 public URL
 */
export async function uploadResizedImage(
  file: File,
  bucket: string = "order-images",
  folder?: string
): Promise<string> {
  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // 이미지 리사이징
  const resizedFile = await resizeImage(file);
  
  // 업로드
  return await uploadImage(resizedFile, bucket, folder);
}

