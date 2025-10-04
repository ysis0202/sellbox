"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export default function Header({ title = "sellbox", showLogo = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center h-14">
          {/* 로고 */}
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <Image 
                  src="/sellbox-logo.svg" 
                  alt="sellbox" 
                  width={24} 
                  height={24}
                />
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {title}
              </h1>
            </motion.div>
          )}

          {!showLogo && (
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h1>
          )}
        </div>
      </div>
    </header>
  );
}

