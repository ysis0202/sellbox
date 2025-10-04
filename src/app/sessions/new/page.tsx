"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createSession } from "@/lib/api/sessions";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewSessionPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bankName: "",
    bankAccount: "",
    bankHolder: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentStore) {
      toast.error("스토어를 선택해주세요.");
      router.push("/stores");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("세션 이름을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const session = await createSession({
        storeId: currentStore.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        bankName: formData.bankName.trim() || undefined,
        bankAccount: formData.bankAccount.trim() || undefined,
        bankHolder: formData.bankHolder.trim() || undefined,
      });

      toast.success("세션이 생성되었습니다! 🎉");
      router.push(`/sessions/${session.id}`);
    } catch (error) {
      console.error("세션 생성 실패:", error);
      toast.error("세션 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* 뒤로가기 */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
        </motion.div>

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            새 라이브 세션 만들기
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            라이브 방송을 시작할 준비를 하세요
          </p>
        </motion.div>

        {/* 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">세션 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 세션 이름 */}
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    세션 이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="예: 1월 5일 저녁 라이브"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    설명 (선택)
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="예: 겨울 신상품 특가 세일!"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    💰 입금 정보 (선택)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    구매자에게 표시될 계좌 정보입니다
                  </p>

                  {/* 은행명 */}
                  <div>
                    <Label htmlFor="bankName" className="text-gray-700 dark:text-gray-300">
                      은행명
                    </Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      type="text"
                      placeholder="예: 토스뱅크"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  {/* 계좌번호 */}
                  <div>
                    <Label htmlFor="bankAccount" className="text-gray-700 dark:text-gray-300">
                      계좌번호
                    </Label>
                    <Input
                      id="bankAccount"
                      name="bankAccount"
                      type="text"
                      placeholder="예: 1234-5678-9012"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  {/* 예금주 */}
                  <div>
                    <Label htmlFor="bankHolder" className="text-gray-700 dark:text-gray-300">
                      예금주
                    </Label>
                    <Input
                      id="bankHolder"
                      name="bankHolder"
                      type="text"
                      placeholder="예: 홍길동"
                      value={formData.bankHolder}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        생성 중...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        세션 만들기
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>팁:</strong> 세션을 만들면 QR 코드와 링크가 자동으로 생성됩니다.
            구매자들에게 공유하여 주문을 받으세요!
          </p>
        </motion.div>
      </main>
    </div>
  );
}

