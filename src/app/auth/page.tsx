"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { createProfile } from "@/lib/api/profile";
import Splash from "@/components/Splash";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SPLASH_MS = 2500;

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // 자동 로그인 체크박스
  const [busy, setBusy] = useState(false);

  // 스플래시가 끝났는지 여부
  const [splashDone, setSplashDone] = useState(false);

  // ⏱ 최소 SPLASH_MS는 무조건 보여주고, 그 다음에만 세션 검사
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, SPLASH_MS));
      if (cancelled) return;

      const { data } = await supabase().auth.getSession();
      await new Promise((r) => setTimeout(r, 120)); // 페이드 타이밍 보정

      if (!cancelled && data.session) {
        // 자동 로그인 체크 여부 확인
        const isTempSession = sessionStorage.getItem("sellbox_temp_session");
        const isRememberMe = localStorage.getItem("sellbox_remember_me");
        
        if (!isTempSession) {
          // sessionStorage에 없음 = 브라우저를 새로 열었음
          if (isRememberMe === "true") {
            // 자동 로그인 체크했음 → sessionStorage 복구
            sessionStorage.setItem("sellbox_temp_session", "true");
            router.replace("/stores");
          } else {
            // 자동 로그인 체크 안 함 → 로그아웃
            await supabase().auth.signOut();
            localStorage.removeItem("sellbox_remember_me"); // 정리
            setSplashDone(true);
            return;
          }
        } else {
          router.replace("/stores");
        }
      }
      setSplashDone(true);
    })();

    return () => { cancelled = true; };
  }, [router]);

  const handleAuth = async (mode: "login" | "signup") => {
    const emailValue = email.trim().toLowerCase();
    const passwordValue = password.trim();

    // 유효성 검사
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      toast.error("올바른 이메일을 입력해 주세요.");
      return;
    }
    if (passwordValue.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setBusy(true);

    if (mode === "signup") {
      // 회원가입
      const { data, error } = await supabase().auth.signUp({
        email: emailValue,
        password: passwordValue,
        options: {
          data: {
            full_name: "", // 나중에 프로필에서 설정 가능
          }
        }
      });

      if (error) {
        setBusy(false);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // 프로필이 트리거로 자동 생성되지만, 혹시 모를 경우를 대비해 명시적으로 생성
        try {
          await createProfile({
            id: data.user.id,
            email: emailValue,
            full_name: "",
          });
        } catch (err) {
          console.log("프로필 생성 시도 중 에러 (이미 존재할 수 있음):", err);
        }

        // 자동 로그인 체크 여부에 따라 세션 관리
        if (rememberMe) {
          localStorage.setItem("sellbox_remember_me", "true");
        }
        sessionStorage.setItem("sellbox_temp_session", "true");

        setBusy(false);
        toast.success("🎉 회원가입이 완료되었습니다!");
        
        // 잠시 대기 후 stores로 이동 (프로필 생성 완료 대기)
        setTimeout(() => {
          router.push("/stores");
        }, 500);
      } else {
        setBusy(false);
      }
    } else {
      // 로그인
      const { data, error } = await supabase().auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      });
      setBusy(false);

      if (error) {
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (data.session) {
        // 자동 로그인 체크 여부에 따라 세션 관리
        if (rememberMe) {
          localStorage.setItem("sellbox_remember_me", "true");
        }
        sessionStorage.setItem("sellbox_temp_session", "true");
        
        toast.success("✨ 로그인 성공!");
        router.push("/stores");
      }
    }
  };

  return (
    <>
      <Splash durationMs={SPLASH_MS} onDone={() => { /* 표시만; 리다이렉트는 위 effect에서 처리 */ }} />

      <main className="relative min-h-[100svh] overflow-hidden 
                       bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
                       dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950">
        
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[15%] left-[10%] h-64 w-64 rounded-full bg-gradient-to-br from-pink-300/30 to-rose-200/30 blur-3xl"
            animate={{ 
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[15%] h-80 w-80 rounded-full bg-gradient-to-br from-purple-300/30 to-blue-200/30 blur-3xl"
            animate={{ 
              y: [0, -40, 0],
              x: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* 점 패턴 배경 */}
          <div className="absolute inset-0 bg-dot opacity-40" />
        </div>

        {/* 로그인 카드 (스플래시가 끝나야 표시) */}
        {splashDone && (
          <section className="relative z-10 flex items-center justify-center min-h-[100svh] p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ duration: 0.5, ease: "easeOut" }} 
              className="w-full max-w-[460px]"
            >
              <Card className="shadow-2xl border-2 border-white/60 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-black/40 overflow-hidden">
                <CardContent className="p-8">
                  {/* 헤더 섹션 */}
                  <motion.div 
                    className="flex flex-col items-center mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative mb-4"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-xl" />
                      <div className="relative rounded-2xl p-3 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-purple-900/30 dark:to-blue-900/30 border-2 border-white dark:border-white/20 shadow-lg">
                        <Image src="/sellbox-logo.svg" alt="sellbox" width={56} height={56} />
                      </div>
                    </motion.div>
                    
                    <h1 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                      sellbox
                    </h1>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-300">
                      라이브 커머스 주문·정리·배송
                    </p>
                  </motion.div>

                  {/* 입력 폼 */}
                  <motion.div 
                    className="space-y-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        이메일 주소
                      </label>
                      <Input
                        type="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 text-base border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 rounded-xl transition-all"
                        onKeyDown={(e) => e.key === "Enter" && handleAuth("login")}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        비밀번호
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-base border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 rounded-xl transition-all"
                        onKeyDown={(e) => e.key === "Enter" && handleAuth("login")}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        최소 6자 이상 입력해주세요
                      </p>
                    </div>

                    {/* 자동 로그인 체크박스 */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-2 border-purple-300 dark:border-purple-700 text-purple-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 cursor-pointer"
                      />
                      <label 
                        htmlFor="rememberMe" 
                        className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none"
                      >
                        자동 로그인 (브라우저를 닫아도 로그인 유지)
                      </label>
                    </div>
                  </motion.div>

                  {/* 버튼 그룹 */}
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all" 
                        onClick={() => handleAuth("login")} 
                        disabled={busy}
                      >
                        {busy ? "⏳ 로그인 중…" : "🚀 로그인"}
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="w-full h-12 text-base font-bold rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-md hover:shadow-lg transition-all" 
                        variant="outline" 
                        onClick={() => handleAuth("signup")} 
                        disabled={busy}
                      >
                        {busy ? "⏳ 가입 중…" : "✨ 회원가입"}
                      </Button>
                    </motion.div>

                    {/* 소셜 로그인 준비 (나중에 활성화) */}
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white/90 dark:bg-black/40 text-gray-500 dark:text-gray-400 font-medium">
                          소셜 로그인 (준비중)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 opacity-50 pointer-events-none">
                      <Button 
                        variant="outline" 
                        className="h-11 rounded-xl border-2 font-semibold"
                        disabled
                      >
                        <span className="mr-2">💬</span> 카카오
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-11 rounded-xl border-2 font-semibold"
                        disabled
                      >
                        <span className="mr-2">🔍</span> 구글
                      </Button>
                    </div>
                  </motion.div>

                  {/* 하단 텍스트 */}
                  <motion.p 
                    className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다
                  </motion.p>
                </CardContent>
              </Card>

              {/* 추가 정보 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  🎉 라이브 커머스를 더 쉽고 재미있게!
                </p>
              </motion.div>
            </motion.div>
          </section>
        )}
      </main>
    </>
  );
}
