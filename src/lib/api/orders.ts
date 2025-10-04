// src/lib/api/orders.ts
// 주문 관련 API 함수

import { supabase } from "../supabase/client";
import type { Order, OrderStatus } from "@/types/database";

/**
 * 새 주문 생성 (구매자용)
 */
export async function createOrder(data: {
  sessionId: string;
  storeId: string;
  buyerName: string;
  buyerNickname: string;
  buyerPhone: string;
  buyerContact?: string;
  productImageUrl: string;
  productNote?: string;
  buyerPriceInfo?: string;
  zipcode?: string;
  address1?: string;
  address2?: string;
  deliveryNote?: string;
}): Promise<Order> {
  const { data: order, error } = await supabase()
    .from("orders")
    .insert({
      session_id: data.sessionId,
      store_id: data.storeId,
      buyer_name: data.buyerName,
      buyer_nickname: data.buyerNickname,
      buyer_phone: data.buyerPhone,
      buyer_contact: data.buyerContact,
      product_image_url: data.productImageUrl,
      product_note: data.productNote,
      buyer_price_info: data.buyerPriceInfo,
      zipcode: data.zipcode,
      address1: data.address1,
      address2: data.address2,
      delivery_note: data.deliveryNote,
    })
    .select()
    .single();

  if (error) {
    console.error("주문 생성 실패 - 상세 정보:");
    console.error("- 에러 메시지:", error.message);
    console.error("- 에러 상세:", error.details);
    console.error("- 에러 힌트:", error.hint);
    console.error("- 에러 코드:", error.code);
    console.error("- 전체 에러:", JSON.stringify(error, null, 2));
    throw new Error(`주문 생성 실패: ${error.message || '알 수 없는 오류'}`);
  }

  return order;
}

/**
 * 주문 ID로 조회
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const { data: order, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("주문 조회 실패:", error);
    throw new Error("주문을 찾을 수 없습니다.");
  }

  return order;
}

/**
 * 스토어의 모든 주문 조회
 */
export async function getOrdersByStore(storeId: string): Promise<Order[]> {
  const { data: orders, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("주문 조회 실패:", error);
    throw new Error("주문 목록을 불러올 수 없습니다.");
  }

  return orders || [];
}

/**
 * 세션의 모든 주문 조회
 */
export async function getOrdersBySession(sessionId: string): Promise<Order[]> {
  const { data: orders, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("주문 조회 실패:", error);
    throw new Error("주문 목록을 불러올 수 없습니다.");
  }

  return orders || [];
}

/**
 * 주문 상태별 조회
 */
export async function getOrdersByStatus(
  storeId: string,
  status: OrderStatus
): Promise<Order[]> {
  const { data: orders, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("주문 조회 실패:", error);
    throw new Error("주문 목록을 불러올 수 없습니다.");
  }

  return orders || [];
}

/**
 * 주문 정보 수정
 */
export async function updateOrder(
  orderId: string,
  data: Partial<Order>
): Promise<Order> {
  const { data: order, error } = await supabase()
    .from("orders")
    .update(data)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("주문 수정 실패:", error);
    throw new Error("주문 수정에 실패했습니다.");
  }

  return order;
}

/**
 * 주문 상태 변경
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  const updateData: any = { status };

  // 상태별 타임스탬프 자동 설정
  switch (status) {
    case "confirmed":
      updateData.confirmed_at = new Date().toISOString();
      break;
    case "paid":
      updateData.paid_at = new Date().toISOString();
      break;
    case "shipped":
      updateData.shipped_at = new Date().toISOString();
      break;
    case "completed":
      updateData.completed_at = new Date().toISOString();
      break;
  }

  return await updateOrder(orderId, updateData);
}

/**
 * 입금 증명 사진 업로드
 */
export async function uploadPaymentProof(
  orderId: string,
  proofUrl: string
): Promise<Order> {
  return await updateOrder(orderId, {
    payment_proof_url: proofUrl,
  });
}

/**
 * 배송 정보 입력
 */
export async function updateShippingInfo(
  orderId: string,
  data: {
    courier?: string;
    trackingNo?: string;
    photoUrl?: string;
  }
): Promise<Order> {
  return await updateOrder(orderId, {
    ship_courier: data.courier,
    ship_tracking_no: data.trackingNo,
    ship_photo_url: data.photoUrl,
  });
}

/**
 * 주문 삭제
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const { error } = await supabase().from("orders").delete().eq("id", orderId);

  if (error) {
    console.error("주문 삭제 실패:", error);
    throw new Error("주문 삭제에 실패했습니다.");
  }
}

/**
 * 주문 통계 조회
 */
export async function getOrderStats(storeId: string): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  paid: number;
  shipped: number;
  completed: number;
  cancelled: number;
  todayOrders: number;
  todayRevenue: number;
}> {
  const { data: orders, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("store_id", storeId);

  if (error) {
    console.error("통계 조회 실패:", error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      paid: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
      todayOrders: 0,
      todayRevenue: 0,
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) =>
    o.created_at.startsWith(today)
  );

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders.reduce(
      (sum, o) => sum + (o.amount || 0),
      0
    ),
  };
}

/**
 * 최근 주문 조회
 */
export async function getRecentOrders(
  storeId: string,
  limit: number = 10
): Promise<Order[]> {
  const { data: orders, error } = await supabase()
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("최근 주문 조회 실패:", error);
    throw new Error("최근 주문을 불러올 수 없습니다.");
  }

  return orders || [];
}

