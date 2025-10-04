"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getSessionById, closeSession, reopenSession } from "@/lib/api/sessions";
import { getOrdersBySession } from "@/lib/api/orders";
import { generateSessionQRCode, getOrderUrl } from "@/lib/qr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import {
  ArrowLeft,
  Download,
  Copy,
  Radio,
  Eye,
  ShoppingBag,
  Share2,
  RotateCw,
  XCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { LiveSession, Order } from "@/types/database";

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessionData();
  }, [id]);

  const loadSessionData = async () => {
    try {
      const sessionData = await getSessionById(id);
      setSession(sessionData);

      // QR 코드 생성
      const qrUrl = await generateSessionQRCode(sessionData.session_code);
      setQrCodeUrl(qrUrl);

      // 주문 조회
      await loadOrders();
    } catch (error) {
      console.error("세션 로드 실패:", error);
      toast.error("세션을 불러올 수 없습니다.");
      router.push("/sessions");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersData = await getOrdersBySession(id);
      setOrders(ordersData);
    } catch (error) {
      console.error("주문 조회 실패:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    toast.success("새로고침되었습니다");
    setRefreshing(false);
  };

  const handleCopyLink = () => {
    if (!session) return;
    const orderUrl = getOrderUrl(session.session_code);
    navigator.clipboard.writeText(orderUrl);
    toast.success("링크가 복사되었습니다!");
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl || !session) return;

    const link = document.createElement("a");
    link.download = `${session.name}-QR.png`;
    link.href = qrCodeUrl;
    link.click();

    toast.success("QR 코드가 다운로드되었습니다!");
  };

  const handleShare = async () => {
    if (!session) return;
    const orderUrl = getOrderUrl(session.session_code);

    if (navigator.share) {
      try {
        await navigator.share({
          title: session.name,
          text: `${session.name} - 주문하기`,
          url: orderUrl,
        });
      } catch (error) {
        console.log("공유 취소됨");
      }
    } else {
      handleCopyLink();
    }
  };

  const handleToggleStatus = async () => {
    if (!session) return;

    try {
      if (session.status === "active") {
        await closeSession(session.id);
        toast.success("세션이 종료되었습니다");
      } else {
        await reopenSession(session.id);
        toast.success("세션이 재개되었습니다");
      }
      await loadSessionData();
    } catch (error) {
      toast.error("상태 변경에 실패했습니다");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const orderUrl = getOrderUrl(session.session_code);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 pb-8">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-20">
        {/* 뒤로가기 */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="ghost"
            onClick={() => router.push("/sessions")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            세션 목록
          </Button>
        </motion.div>

        {/* 세션 정보 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {session.name}
                    </h1>
                    <Badge
                      className={
                        session.status === "active"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                      }
                    >
                      {session.status === "active" ? "LIVE" : "종료"}
                    </Badge>
                  </div>
                  {session.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {session.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{session.order_count}건 주문</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{session.view_count}회 조회</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleToggleStatus}
                  variant={session.status === "active" ? "destructive" : "default"}
                  className="w-full"
                >
                  {session.status === "active" ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      세션 종료
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      세션 재개
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* QR 코드 */}
        {session.status === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-black/40 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                  📱 구매자용 QR 코드
                </h2>

                {/* QR 이미지 */}
                <div className="bg-white rounded-2xl p-6 mb-4 mx-auto max-w-[300px]">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-full h-auto rounded-xl"
                    />
                  )}
                </div>

                {/* 링크 */}
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    주문 링크
                  </p>
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                    {orderUrl}
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={handleCopyLink} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    복사
                  </Button>
                  <Button onClick={handleDownloadQR} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    저장
                  </Button>
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    공유
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 입금 정보 */}
        {(session.bank_name || session.bank_account) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  💰 입금 정보
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {session.bank_name && (
                    <p>은행: {session.bank_name}</p>
                  )}
                  {session.bank_account && (
                    <p>계좌: {session.bank_account}</p>
                  )}
                  {session.bank_holder && (
                    <p>예금주: {session.bank_holder}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 실시간 주문 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-red-500" />
              실시간 주문 ({orders.length}건)
            </h2>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RotateCw
                className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
              />
              새로고침
            </Button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="border-0 shadow-md bg-white/80 dark:bg-black/30 backdrop-blur-xl hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => router.push(`/orders`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* 상품 이미지 */}
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {order.product_image_url ? (
                            <img
                              src={order.product_image_url}
                              alt="상품"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        {/* 주문 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                              {order.buyer_name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {order.status === "pending"
                                ? "대기"
                                : order.status === "confirmed"
                                ? "확인"
                                : order.status === "paid"
                                ? "입금완료"
                                : order.status === "shipped"
                                ? "배송중"
                                : "완료"}
                            </Badge>
                          </div>

                          {order.product_note && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">
                              {order.product_note}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <span>{order.order_no}</span>
                            <span>•</span>
                            <span>
                              {new Date(order.created_at).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {orders.length > 5 && (
                <Button
                  onClick={() => router.push("/orders")}
                  variant="outline"
                  className="w-full"
                >
                  전체 주문 보기 ({orders.length}건)
                </Button>
              )}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  아직 주문이 없습니다
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  QR 코드를 공유하고 첫 주문을 받아보세요!
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}

