import { supabase } from "@/lib/supabase/client";
import type { Store } from "@/types/database";

/**
 * 현재 사용자의 모든 스토어 조회
 */
export async function getMyStores() {
  const { data: { user } } = await supabase().auth.getUser();
  
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase()
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("스토어 목록 조회 실패:", error);
    throw error;
  }

  return data as Store[];
}

/**
 * 스토어 생성
 */
export async function createStore(input: { name: string; handle: string }) {
  const { data: { user } } = await supabase().auth.getUser();
  
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 핸들 정규화
  const normalizedHandle = input.handle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  // 핸들 유효성 검사
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(normalizedHandle)) {
    throw new Error("핸들은 영문 소문자/숫자/하이픈만 가능하며 하이픈으로 시작/끝날 수 없습니다.");
  }

  // 중복 체크
  const { data: existing, error: checkError } = await supabase()
    .from("stores")
    .select("id")
    .eq("handle", normalizedHandle)
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) throw new Error("이미 사용 중인 핸들입니다.");

  // 생성
  const { data, error } = await supabase()
    .from("stores")
    .insert({
      owner_id: user.id,
      name: input.name.trim(),
      handle: normalizedHandle,
    })
    .select()
    .single();

  if (error) {
    console.error("스토어 생성 실패:", error);
    throw error;
  }

  return data as Store;
}

/**
 * 스토어 정보 조회
 */
export async function getStore(storeId: string) {
  const { data, error } = await supabase()
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .single();

  if (error) {
    console.error("스토어 조회 실패:", error);
    throw error;
  }

  return data as Store;
}

/**
 * 스토어 수정
 */
export async function updateStore(storeId: string, updates: { name?: string; handle?: string }) {
  const { data: { user } } = await supabase().auth.getUser();
  
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 핸들 업데이트 시 정규화
  let normalizedHandle: string | undefined;
  if (updates.handle) {
    normalizedHandle = updates.handle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(normalizedHandle)) {
      throw new Error("핸들은 영문 소문자/숫자/하이픈만 가능합니다.");
    }

    // 중복 체크 (자기 자신 제외)
    const { data: existing, error: checkError } = await supabase()
      .from("stores")
      .select("id")
      .eq("handle", normalizedHandle)
      .neq("id", storeId)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) throw new Error("이미 사용 중인 핸들입니다.");
  }

  const { data, error } = await supabase()
    .from("stores")
    .update({
      ...(updates.name && { name: updates.name.trim() }),
      ...(normalizedHandle && { handle: normalizedHandle }),
    })
    .eq("id", storeId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("스토어 수정 실패:", error);
    throw error;
  }

  return data as Store;
}

/**
 * 스토어 삭제
 */
export async function deleteStore(storeId: string) {
  const { data: { user } } = await supabase().auth.getUser();
  
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { error } = await supabase()
    .from("stores")
    .delete()
    .eq("id", storeId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("스토어 삭제 실패:", error);
    throw error;
  }
}

