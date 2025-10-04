// src/lib/qr.ts
// QR 코드 생성 유틸리티

import QRCode from "qrcode";

/**
 * QR 코드 이미지 생성 (Data URL)
 * @param text QR 코드로 만들 텍스트 (URL 등)
 * @param options QR 코드 옵션
 * @returns Data URL (이미지)
 */
export async function generateQRCode(
  text: string,
  options?: {
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 400,
      margin: 2,
      color: {
        dark: options?.color?.dark || "#000000",
        light: options?.color?.light || "#ffffff",
      },
      errorCorrectionLevel: "H",
    });

    return dataUrl;
  } catch (error) {
    console.error("QR 코드 생성 실패:", error);
    throw new Error("QR 코드 생성에 실패했습니다.");
  }
}

/**
 * QR 코드를 Canvas에 그리기
 * @param canvas Canvas 요소
 * @param text QR 코드로 만들 텍스트
 */
export async function drawQRCodeOnCanvas(
  canvas: HTMLCanvasElement,
  text: string
): Promise<void> {
  try {
    await QRCode.toCanvas(canvas, text, {
      width: canvas.width,
      margin: 2,
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("QR 코드 그리기 실패:", error);
    throw new Error("QR 코드 생성에 실패했습니다.");
  }
}

/**
 * 주문 URL 생성
 * @param sessionCode 세션 코드
 * @returns 주문 페이지 URL
 */
export function getOrderUrl(sessionCode: string): string {
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || "https://sellbox.app";
  
  return `${baseUrl}/order/${sessionCode}`;
}

/**
 * 세션용 QR 코드 생성 (그라디언트 스타일)
 * @param sessionCode 세션 코드
 * @returns QR 코드 Data URL
 */
export async function generateSessionQRCode(sessionCode: string): Promise<string> {
  const orderUrl = getOrderUrl(sessionCode);
  
  return await generateQRCode(orderUrl, {
    width: 500,
    color: {
      dark: "#7C3AED", // purple-600
      light: "#FFFFFF",
    },
  });
}

