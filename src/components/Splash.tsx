"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = { onDone?: () => void; durationMs?: number };

export default function Splash({ onDone, durationMs = 2500 }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      onDone?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden
                     bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* 귀여운 떠다니는 원형 배경들 */}
          <motion.div
            className="absolute top-[10%] left-[15%] h-32 w-32 rounded-full bg-gradient-to-br from-pink-400/40 to-rose-300/40 blur-2xl"
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[60%] right-[10%] h-40 w-40 rounded-full bg-gradient-to-br from-purple-400/40 to-violet-300/40 blur-2xl"
            animate={{ 
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-[20%] left-[20%] h-36 w-36 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-300/30 blur-2xl"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* 로고와 텍스트 애니메이션 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 15,
              delay: 0.1
            }}
            className="flex flex-col items-center gap-6 relative z-10"
          >
            {/* 로고 컨테이너 */}
            <motion.div
              animate={{ 
                rotate: [0, -3, 3, -2, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
              className="relative"
            >
              {/* 로고 배경 그림자/글로우 */}
              <motion.div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-500 dark:via-purple-500 dark:to-blue-500 opacity-60 blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* 로고 카드 */}
              <div className="relative rounded-3xl p-8 shadow-2xl bg-white/95 dark:bg-white/10 backdrop-blur-xl border-2 border-white/50 dark:border-white/20">
                <Image 
                  src="/sellbox-logo.svg" 
                  alt="sellbox" 
                  width={96} 
                  height={96} 
                  className="relative z-10" 
                />
              </div>
            </motion.div>

            {/* 앱 이름 애니메이션 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.h1
                className="text-4xl font-black tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                sellbox
              </motion.h1>
              
              {/* 서브 타이틀 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-medium text-purple-600 dark:text-purple-300"
              >
                라이브 커머스의 모든 것
              </motion.p>
            </motion.div>

            {/* 로딩 도트 애니메이션 */}
            <motion.div 
              className="flex gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* 추가 장식 요소들 */}
          <motion.div
            className="absolute top-[25%] right-[25%] w-3 h-3 rounded-full bg-yellow-400/60"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[35%] left-[30%] w-2 h-2 rounded-full bg-pink-400/60"
            animate={{
              y: [0, 30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
