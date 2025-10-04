"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getOrderById } from "@/lib/api/orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Phone } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/types/database";

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ sessionCode: string }>;
}) {
  const { sessionCode } = use(params);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("주문 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderNo = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.order_no);
    toast.success("주문번호가 복사되었습니다!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <main className="max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            주문 완료! 🎉
          </h1>
          <p className="text-gray-600">
            주문이 성공적으로 접수되었습니다
          </p>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl mb-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  주문 정보
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">주문번호</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-gray-800">
                        {order.order_no}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyOrderNo}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">주문자</span>
                    <span className="font-semibold">{order.buyer_name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">연락처</span>
                    <span className="font-semibold">{order.buyer_phone}</span>
                  </div>

                  {order.product_note && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">상품 정보</span>
                      <span className="font-semibold">{order.product_note}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  다음 단계
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-semibold">1.</span>
                    <span>판매자가 주문을 확인합니다</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>입금 정보 안내를 받게 됩니다</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>입금 후 배송이 시작됩니다</span>
                  </li>
                </ol>

                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600">
                    💡 연락처로 판매자의 연락이 갈 수 있으니 확인해주세요!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mt-8"
        >
          <Button
            onClick={() => {
              // 같은 세션으로 다시 주문하기
              window.location.href = `/order/${sessionCode}?continueOrder=true`;
            }}
            className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
          >
            🛒 다시 주문하기
          </Button>
          <p className="text-sm text-gray-500 text-center">
            💡 같은 이름+닉네임으로 주문하면 자동으로 묶입니다
          </p>
        </motion.div>
      </main>
    </div>
  );
}

