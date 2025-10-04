import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

/**
 * 현재 로그인한 사용자의 프로필 조회
 */
export async function getProfile() {
  const { data: { user } } = await supabase().auth.getUser();
  
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("프로필 조회 실패:", error);
    throw error;
  }

  return data as Profile;
}

/**
 * 프로필 업데이트
 */
export async function updateProfile(updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>) {
  const { data: { user } } = await supabase().auth.getUser();
  
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase()
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("프로필 업데이트 실패:", error);
    throw error;
  }

  return data as Profile;
}

/**
 * 프로필 생성 (회원가입 시 트리거로 자동 생성되지만, 수동으로도 가능)
 */
export async function createProfile(profile: {
  id: string;
  email: string;
  full_name?: string;
}) {
  const { data, error } = await supabase()
    .from("profiles")
    .insert({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || "",
    })
    .select()
    .single();

  if (error) {
    // 이미 존재하는 경우 무시
    if (error.code === "23505") {
      console.log("프로필이 이미 존재합니다.");
      return null;
    }
    console.error("프로필 생성 실패:", error);
    throw error;
  }

  return data as Profile;
}

