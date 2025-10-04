"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Package, Plus } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950 pb-20">
      <Header title="상품 관리" showLogo={false} />

      <main className="max-w-lg mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  등록된 상품이 없습니다
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  첫 번째 상품을 등록해보세요!
                </p>
                <Button
                  onClick={() => router.push("/products/new")}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  상품 등록하기
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

