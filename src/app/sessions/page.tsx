"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getSessionsByStore } from "@/lib/api/sessions";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import {
  Plus,
  Radio,
  Eye,
  ShoppingBag,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { LiveSession } from "@/types/database";

export default function SessionsPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadSessions();
  }, [currentStore]);

  const checkAuthAndLoadSessions = async () => {
    try {
      const {
        data: { session },
      } = await supabase().auth.getSession();

      if (!session) {
        router.push("/auth");
        return;
      }

      if (!currentStore) {
        router.push("/stores");
        return;
      }

      const sessionsList = await getSessionsByStore(currentStore.id);
      setSessions(sessionsList);
    } catch (error) {
      console.error("세션 로드 실패:", error);
      toast.error("세션 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = () => {
    router.push("/sessions/new");
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const activeSessions = sessions.filter((s) => s.status === "active");
  const closedSessions = sessions.filter((s) => s.status === "closed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 pb-20">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-20">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🎥 라이브 세션
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            라이브 방송 판매 세션을 관리하세요
          </p>
        </motion.div>

        {/* 새 세션 만들기 버튼 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Button
            onClick={handleCreateSession}
            className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold text-lg shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />새 세션 만들기
          </Button>
        </motion.div>

        {/* 활성 세션 */}
        {activeSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-red-500 animate-pulse" />
              진행 중인 세션
            </h2>
            <div className="space-y-3">
              {activeSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* 상태 아이콘 */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Radio className="w-6 h-6 text-white animate-pulse" />
                        </div>

                        {/* 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                              {session.name}
                            </h3>
                            <Badge className="bg-red-500 text-white text-xs">
                              LIVE
                            </Badge>
                          </div>

                          {session.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                              {session.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3" />
                              {session.order_count}건
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {session.view_count}회
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(session.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* 화살표 */}
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 종료된 세션 */}
        {closedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              종료된 세션
            </h2>
            <div className="space-y-3">
              {closedSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Card
                    className="border-0 shadow-md bg-white/60 dark:bg-black/20 backdrop-blur-xl hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* 상태 아이콘 */}
                        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <Radio className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>

                        {/* 정보 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-700 dark:text-gray-300 truncate mb-1">
                            {session.name}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3" />
                              {session.order_count}건
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {session.view_count}회
                            </span>
                          </div>
                        </div>

                        {/* 화살표 */}
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 빈 상태 */}
        {sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  아직 세션이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  첫 라이브 세션을 만들어보세요!
                </p>
                <Button
                  onClick={handleCreateSession}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  세션 만들기
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

