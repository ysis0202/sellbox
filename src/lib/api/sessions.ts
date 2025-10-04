// src/lib/api/sessions.ts
// 라이브 세션 관련 API 함수

import { supabase } from "../supabase/client";
import type { LiveSession } from "@/types/database";

/**
 * 새 라이브 세션 생성
 */
export async function createSession(data: {
  storeId: string;
  name: string;
  description?: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
}): Promise<LiveSession> {
  const { data: session, error } = await supabase()
    .from("live_sessions")
    .insert({
      store_id: data.storeId,
      name: data.name,
      description: data.description,
      bank_name: data.bankName,
      bank_account: data.bankAccount,
      bank_holder: data.bankHolder,
    })
    .select()
    .single();

  if (error) {
    console.error("세션 생성 실패:", error);
    throw new Error("세션 생성에 실패했습니다.");
  }

  return session;
}

/**
 * 스토어의 모든 세션 조회
 */
export async function getSessionsByStore(
  storeId: string
): Promise<LiveSession[]> {
  const { data: sessions, error } = await supabase()
    .from("live_sessions")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("세션 조회 실패:", error);
    throw new Error("세션 목록을 불러올 수 없습니다.");
  }

  return sessions || [];
}

/**
 * 세션 ID로 조회
 */
export async function getSessionById(sessionId: string): Promise<LiveSession> {
  const { data: session, error } = await supabase()
    .from("live_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("세션 조회 실패:", error);
    throw new Error("세션을 찾을 수 없습니다.");
  }

  return session;
}

/**
 * 세션 코드로 조회 (공개)
 */
export async function getSessionByCode(
  sessionCode: string
): Promise<LiveSession> {
  const { data: session, error } = await supabase()
    .from("live_sessions")
    .select("*")
    .eq("session_code", sessionCode)
    .eq("status", "active")
    .single();

  if (error) {
    console.error("세션 조회 실패:", error);
    throw new Error("세션을 찾을 수 없거나 종료되었습니다.");
  }

  // 조회수 증가
  await incrementViewCount(session.id);

  return session;
}

/**
 * 세션 조회수 증가
 */
async function incrementViewCount(sessionId: string): Promise<void> {
  // 현재 조회수를 가져와서 +1
  const { data: session } = await supabase()
    .from("live_sessions")
    .select("view_count")
    .eq("id", sessionId)
    .single();

  if (session) {
    await supabase()
      .from("live_sessions")
      .update({ view_count: (session.view_count || 0) + 1 })
      .eq("id", sessionId);
  }
}

/**
 * 세션 정보 수정
 */
export async function updateSession(
  sessionId: string,
  data: Partial<LiveSession>
): Promise<LiveSession> {
  const { data: session, error } = await supabase()
    .from("live_sessions")
    .update(data)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    console.error("세션 수정 실패:", error);
    throw new Error("세션 수정에 실패했습니다.");
  }

  return session;
}

/**
 * 세션 종료
 */
export async function closeSession(sessionId: string): Promise<LiveSession> {
  const { data: session, error } = await supabase()
    .from("live_sessions")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    console.error("세션 종료 실패:", error);
    throw new Error("세션 종료에 실패했습니다.");
  }

  return session;
}

/**
 * 세션 재개 (closed → active)
 */
export async function reopenSession(sessionId: string): Promise<LiveSession> {
  const { data: session, error } = await supabase()
    .from("live_sessions")
    .update({
      status: "active",
      closed_at: null,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    console.error("세션 재개 실패:", error);
    throw new Error("세션 재개에 실패했습니다.");
  }

  return session;
}

/**
 * 세션 삭제
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const { error } = await supabase()
    .from("live_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    console.error("세션 삭제 실패:", error);
    throw new Error("세션 삭제에 실패했습니다.");
  }
}

/**
 * 활성 세션 개수 조회
 */
export async function getActiveSessionCount(storeId: string): Promise<number> {
  const { count, error } = await supabase()
    .from("live_sessions")
    .select("*", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("status", "active");

  if (error) {
    console.error("활성 세션 개수 조회 실패:", error);
    return 0;
  }

  return count || 0;
}

