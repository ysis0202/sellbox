"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Calendar } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 pb-20">
      <Header title="주문 관리" showLogo={false} />

      <main className="max-w-lg mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  주문 내역이 없습니다
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  주문이 들어오면 여기에 표시됩니다
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
