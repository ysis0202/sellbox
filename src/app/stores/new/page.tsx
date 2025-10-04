"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createStore } from "@/lib/api/stores";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Store as StoreIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewStorePage() {
  const router = useRouter();
  const { setCurrentStore } = useStore();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("스토어 이름을 입력해주세요.");
      return;
    }
    if (!handle.trim()) {
      toast.error("스토어 핸들을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const newStore = await createStore({ name, handle });
      
      // 새로 만든 스토어를 현재 스토어로 설정
      setCurrentStore(newStore);
      
      toast.success("🎉 스토어가 생성되었습니다!", {
        description: `${newStore.name} 스토어에서 활동을 시작하세요!`,
      });
      
      // 대시보드로 이동
      router.push("/dashboard");
    } catch (error: any) {
      console.error("스토어 생성 실패:", error);
      toast.error(error.message || "스토어 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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

      <main className="relative z-10 max-w-lg mx-auto px-4 py-12">
        {/* 뒤로 가기 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
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
            새 스토어 만들기
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            나만의 멋진 스토어를 시작해보세요! ✨
          </p>
        </motion.div>

        {/* 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              {/* 스토어 이름 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <span className="text-lg">🏪</span>
                  스토어 이름
                </label>
                <Input
                  placeholder="예: 지혜의 라이브샵"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 rounded-xl"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  고객에게 보여질 스토어 이름입니다
                </p>
              </div>

              {/* 스토어 핸들 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <span className="text-lg">🔗</span>
                  스토어 핸들 (URL)
                </label>
                <Input
                  placeholder="예: jihye-shop"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 rounded-xl font-mono"
                />
                {handle && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-purple-600 dark:text-purple-400 font-medium"
                  >
                    🌐 공개 URL: <code className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">/{handle}</code>
                  </motion.p>
                )}
              </div>

              {/* 생성 버튼 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {loading ? "생성 중..." : "스토어 만들기"}
                </Button>
              </motion.div>

              {/* 안내 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>💡</span>
                  <div className="space-y-1">
                    <p>• 핸들은 영문 소문자, 숫자, 하이픈(-)만 사용 가능</p>
                    <p>• 스토어는 나중에 언제든지 추가할 수 있습니다</p>
                    <p>• 여러 스토어를 운영하고 쉽게 전환할 수 있어요</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 하단 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            🎨 친구들과 함께하는 라이브 커머스
          </p>
        </motion.div>
      </main>
    </div>
  );
}

