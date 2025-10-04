"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getProfile, updateProfile } from "@/lib/api/profile";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { LogOut, Save, User as UserIcon } from "lucide-react";
import type { Profile } from "@/types/database";

export default function ProfilePage() {
  const router = useRouter();
  const { clearCurrentStore } = useStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 폼 필드
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFullName(data.full_name || "");
      setBio(data.bio || "");
      setPhone(data.phone || "");
    } catch (error) {
      console.error("프로필 로드 실패:", error);
      toast.error("프로필을 불러올 수 없습니다.");
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
      });
      toast.success("✨ 프로필이 저장되었습니다!");
      await loadProfile(); // 새로고침
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      toast.error("프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase().auth.signOut();
    clearCurrentStore(); // 스토어 정보 클리어
    localStorage.removeItem("sellbox_remember_me");
    sessionStorage.removeItem("sellbox_temp_session");
    toast.success("로그아웃되었습니다.");
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">프로필 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 pb-20">
      <Header title="프로필" showLogo={false} />

      <main className="max-w-lg mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 프로필 헤더 */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl mb-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {fullName?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {fullName || "사용자"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 프로필 폼 */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl mb-4">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 이름 */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    👤 이름
                  </label>
                  <Input
                    placeholder="홍길동"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* 전화번호 */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    📱 전화번호
                  </label>
                  <Input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* 자기소개 */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    ✍️ 자기소개
                  </label>
                  <Textarea
                    placeholder="자기소개를 입력해주세요..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* 저장 버튼 */}
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-11 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "저장 중..." : "저장하기"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 계정 정보 */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl mb-4">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
                📊 계정 정보
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>가입일:</span>
                  <span>{new Date(profile?.created_at || "").toLocaleDateString("ko-KR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>마지막 수정:</span>
                  <span>{new Date(profile?.updated_at || "").toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 로그아웃 버튼 */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full h-11 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}

