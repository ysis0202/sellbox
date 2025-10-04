"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        // 1) 오류 쿼리 우선
        const search = new URLSearchParams(window.location.search);
        const errDesc = search.get("error_description") || search.get("error");
        if (errDesc) {
          toast.error(decodeURIComponent(errDesc));
          return router.replace("/onboard");
        }

        // 2) 최신 플로우: ?code=
        const code = search.get("code");
        if (code) {
          try {
            // @ts-ignore: 런타임 지원
            const { error } = await supabase().auth.exchangeCodeForSession(code);
            if (error) throw error;
          } catch {
            const { error } = await supabase().auth.verifyOtp({
              type: "email",
              token_hash: code,
            });
            if (error) throw error;
          }
          toast.success("로그인 완료!");
          return router.replace("/onboard");
        }

        // 3) 구 플로우: 해시 토큰
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const hp = new URLSearchParams(hash);
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase().auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) throw error;
          toast.success("로그인 완료!");
          return router.replace("/onboard");
        }

        // 4) 이미 세션 있으면 OK
        const { data } = await supabase().auth.getSession();
        if (data.session) toast.success("로그인 완료!");

      } catch (e: any) {
        toast.error(e?.message || "로그인 처리 중 오류");
      } finally {
        router.replace("/onboard");
      }
    };
    run();
  }, [router]);

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">로그인 처리 중…</h1>
      <p className="text-sm text-muted-foreground mt-2">잠시만 기다려 주세요.</p>
    </main>
  );
}
