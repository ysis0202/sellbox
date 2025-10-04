"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Radio, Calendar, Bell, User } from "lucide-react";

const navItems = [
  { id: "home", label: "홈", icon: Home, path: "/dashboard" },
  { id: "sessions", label: "세션", icon: Radio, path: "/sessions" },
  { id: "orders", label: "주문", icon: Calendar, path: "/orders" },
  { id: "notifications", label: "알림", icon: Bell, path: "/notifications" },
  { id: "profile", label: "프로필", icon: User, path: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // 로그인 페이지나 온보딩에서는 네비게이션 숨기기
  if (pathname === "/auth" || pathname === "/onboard" || pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <motion.button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
                whileTap={{ scale: 0.9 }}
              >
                {/* 활성 상태 표시 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* 아이콘 */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </motion.div>

                {/* 레이블 */}
                <span
                  className={`text-xs mt-1 font-medium transition-colors ${
                    isActive
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.label}
                </span>

                {/* 알림 배지 (나중에 사용) */}
                {item.id === "notifications" && false && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

