"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getOrdersByStore, updateOrderStatus, getOrderStats } from "@/lib/api/orders";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Image as ImageIcon,
  Phone,
  MapPin,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus } from "@/types/database";

export default function OrdersPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    shipped: 0,
    todayOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, [currentStore]);

  const checkAuthAndLoadOrders = async () => {
    try {
      const { data: { session } } = await supabase().auth.getSession();
      
      if (!session) {
        router.push("/auth");
        return;
      }

      if (!currentStore) {
        router.push("/stores");
        return;
      }

      await loadOrders();
      await loadStats();
    } catch (error) {
      console.error("주문 로드 실패:", error);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!currentStore) return;

    try {
      const ordersData = await getOrdersByStore(currentStore.id);
      setOrders(ordersData);
    } catch (error) {
      console.error("주문 조회 실패:", error);
      toast.error("주문 목록을 불러올 수 없습니다.");
    }
  };

  const loadStats = async () => {
    if (!currentStore) return;

    try {
      const statsData = await getOrderStats(currentStore.id);
      setStats(statsData);
    } catch (error) {
      console.error("통계 조회 실패:", error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("주문 상태가 변경되었습니다");
      await loadOrders();
      await loadStats();
    } catch (error) {
      toast.error("상태 변경에 실패했습니다");
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "대기중";
      case "confirmed": return "확인완료";
      case "paid": return "입금완료";
      case "shipped": return "배송중";
      case "completed": return "완료";
      case "cancelled": return "취소";
      default: return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "confirmed": return "bg-blue-500";
      case "paid": return "bg-green-500";
      case "shipped": return "bg-purple-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  // 동일 구매자 주문 그룹핑 (이름 + 닉네임)
  const groupedOrders = orders.reduce((groups, order) => {
    const key = `${order.buyer_name}-${order.buyer_nickname}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(order);
    return groups;
  }, {} as Record<string, Order[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              📦 주문 관리
            </h1>
            <Button variant="outline" size="sm" onClick={() => { loadOrders(); loadStats(); }}>
              <RotateCw className="w-4 h-4 mr-1" />
              새로고침
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            전체 {stats.total}건 · 오늘 {stats.todayOrders}건
          </p>
        </motion.div>

        {/* 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2 mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">대기</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">입금완료</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{stats.paid}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">배송중</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{stats.shipped}</p>
            </CardContent>
          </Card>
        </motion.div>

          {/* 주문 목록 - 구매자별 그룹핑 */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedOrders).map(([buyerKey, buyerOrders], groupIndex) => {
              const firstOrder = buyerOrders[0];
              const orderCount = buyerOrders.length;
              
              return (
                <motion.div
                  key={buyerKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-xl">
                    <CardContent className="p-4">
                      {/* 구매자 정보 헤더 */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
                              {firstOrder.buyer_name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              @{firstOrder.buyer_nickname}
                            </Badge>
                            {orderCount > 1 && (
                              <Badge className="bg-purple-500 text-white">
                                {orderCount}건
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            {firstOrder.buyer_phone}
                          </div>
                          {firstOrder.address1 && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {firstOrder.address1}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 주문 목록 */}
                      <div className="space-y-3">
                        {buyerOrders.map((order, orderIndex) => (
                          <div key={order.id} className={orderIndex > 0 ? "pt-3 border-t border-gray-100 dark:border-gray-800" : ""}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-mono">#{orderIndex + 1}</span>
                                <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-400 font-mono">{order.order_no}</span>
                            </div>

                            <div className="flex gap-3 mb-2">
                              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {order.product_image_url ? (
                                  <img src={order.product_image_url} alt="상품" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                {order.product_note && (
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{order.product_note}</p>
                                )}
                                {order.buyer_price_info && (
                                  <p className="text-xs text-gray-500">가격: {order.buyer_price_info}</p>
                                )}
                              </div>
                            </div>

                            {/* 상태 변경 버튼 */}
                            <div className="flex gap-2">
                              {order.status === "pending" && (
                                <Button size="sm" onClick={() => handleStatusChange(order.id, "confirmed")} className="flex-1 bg-blue-500 hover:bg-blue-600">
                                  주문 확인
                                </Button>
                              )}
                              {order.status === "confirmed" && (
                                <Button size="sm" onClick={() => handleStatusChange(order.id, "paid")} className="flex-1 bg-green-500 hover:bg-green-600">
                                  입금 확인
                                </Button>
                              )}
                              {order.status === "paid" && (
                                <Button size="sm" onClick={() => handleStatusChange(order.id, "shipped")} className="flex-1 bg-purple-500 hover:bg-purple-600">
                                  배송 시작
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button size="sm" onClick={() => handleStatusChange(order.id, "completed")} className="flex-1 bg-gray-500 hover:bg-gray-600">
                                  완료 처리
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">주문이 없습니다</p>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
