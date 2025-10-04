"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/api/profile";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  Plus,
  ArrowRight,
  Store as StoreIcon
} from "lucide-react";
import type { Profile } from "@/types/database";

export default function DashboardPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase().auth.getSession();
      
      if (!session) {
        router.push("/auth");
        return;
      }

      // 자동 로그인 체크 여부 확인
      const isTempSession = sessionStorage.getItem("sellbox_temp_session");
      const isRememberMe = localStorage.getItem("sellbox_remember_me");
      
      if (!isTempSession) {
        if (isRememberMe === "true") {
          // 자동 로그인 체크했음 → sessionStorage 복구
          sessionStorage.setItem("sellbox_temp_session", "true");
        } else {
          // 자동 로그인 체크 안 함 → 로그아웃
          await supabase().auth.signOut();
          router.push("/auth");
          return;
        }
      }

      // 스토어가 선택되지 않았으면 스토어 선택 페이지로
      if (!currentStore) {
        router.push("/stores");
        return;
      }

      const profileData = await getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("인증 확인 실패:", error);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "오늘 주문", value: "0", icon: ShoppingBag, color: "from-pink-500 to-rose-500" },
    { label: "총 매출", value: "₩0", icon: DollarSign, color: "from-purple-500 to-violet-500" },
    { label: "고객 수", value: "0", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "성장률", value: "0%", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
  ];

  const quickActions = [
    { label: "새 세션", icon: Plus, path: "/sessions/new", color: "bg-gradient-to-br from-pink-500 to-rose-500" },
    { label: "세션 관리", icon: StoreIcon, path: "/sessions", color: "bg-gradient-to-br from-purple-500 to-violet-500" },
    { label: "주문 확인", icon: ShoppingBag, path: "/orders", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 pb-20">
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="max-w-lg mx-auto px-4 pt-20">
        {/* 스토어 정보 & 웰컴 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {currentStore?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">
                      {currentStore?.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      @{currentStore?.handle}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/stores")}
                  className="text-purple-600 dark:text-purple-400"
                >
                  <StoreIcon className="w-4 h-4 mr-1" />
                  전환
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            안녕하세요, {profile?.full_name || "판매자"}님! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            오늘도 즐거운 하루 되세요
          </p>
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 빠른 액션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
            빠른 작업
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={() => router.push(action.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl hover:shadow-xl transition-all">
                    <CardContent className="p-4 text-center">
                      <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {action.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* 최근 활동 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              최근 활동
            </h3>
            <Button variant="ghost" size="sm" className="text-purple-600">
              전체보기 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  아직 활동이 없습니다
                </p>
                <Button
                  onClick={() => router.push("/products/new")}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
                >
                  첫 상품 등록하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}

