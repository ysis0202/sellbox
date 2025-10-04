"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getMyStores } from "@/lib/api/stores";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Store as StoreIcon, ChevronRight, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";
import type { Store } from "@/types/database";

export default function StoresPage() {
  const router = useRouter();
  const { setCurrentStore, clearCurrentStore } = useStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadStores();
  }, []);

  const checkAuthAndLoadStores = async () => {
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
          clearCurrentStore();
          router.push("/auth");
          return;
        }
      }

      const storesList = await getMyStores();
      setStores(storesList);

      // 스토어가 없으면 자동으로 생성 페이지로
      if (storesList.length === 0) {
        router.push("/stores/new");
      }
    } catch (error) {
      console.error("스토어 로드 실패:", error);
      toast.error("스토어 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStore = (store: Store) => {
    setCurrentStore(store);
    toast.success(`${store.name} 스토어를 선택했습니다! 🎉`);
    router.push("/dashboard");
  };

  const handleSignOut = async () => {
    await supabase().auth.signOut();
    clearCurrentStore();
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
          <p className="text-gray-600 dark:text-gray-300">스토어 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[20%] right-[15%] h-64 w-64 rounded-full bg-gradient-to-br from-pink-300/30 to-rose-200/30 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] left-[10%] h-80 w-80 rounded-full bg-gradient-to-br from-purple-300/30 to-blue-200/30 blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-dot opacity-40" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* 로그아웃 버튼 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-end mb-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </motion.div>

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mb-4 shadow-lg">
            <StoreIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            스토어 선택
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            운영할 스토어를 선택해주세요
          </p>
        </motion.div>

        {/* 스토어 목록 */}
        <div className="grid gap-4 mb-6">
          <AnimatePresence mode="popLayout">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="border-0 shadow-xl bg-white/90 dark:bg-black/40 backdrop-blur-xl hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
                  onClick={() => handleSelectStore(store)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* 아이콘 */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                          {store.name.charAt(0).toUpperCase()}
                        </div>
                        <motion.div
                          className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0, rotate: -180 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Sparkles className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>

                      {/* 정보 */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {store.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          @{store.handle}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(store.created_at).toLocaleDateString("ko-KR")} 생성
                        </p>
                      </div>

                      {/* 화살표 */}
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 새 스토어 추가 버튼 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: stores.length * 0.1 + 0.2 }}
        >
          <Card 
            className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-white/60 dark:bg-black/20 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-black/30 hover:border-purple-500 transition-all cursor-pointer group"
            onClick={() => router.push("/stores/new")}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Plus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  새 스토어 추가
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  새로운 스토어를 만들어보세요
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 하단 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 여러 스토어를 운영하고 언제든지 전환할 수 있습니다
          </p>
        </motion.div>
      </main>
    </div>
  );
}

