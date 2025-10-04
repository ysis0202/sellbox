"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSessionByCode } from "@/lib/api/sessions";
import { createOrder } from "@/lib/api/orders";
import { uploadResizedImage, validateImageFile } from "@/lib/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, Sparkles, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import type { LiveSession } from "@/types/database";

export default function OrderPage({
  params,
}: {
  params: Promise<{ sessionCode: string }>;
}) {
  const { sessionCode } = use(params);
  const router = useRouter();
  
  // URL 파라미터 체크 (클라이언트 사이드)
  const [continueOrder, setContinueOrder] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(true);
  
  useEffect(() => {
    // URL에서 continueOrder 파라미터 확인
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setContinueOrder(urlParams.get("continueOrder") === "true");
    }
  }, [sessionCode]);
  
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerNickname: "",
    buyerPhone: "",
    buyerContact: "",
    productNote: "",
    buyerPriceInfo: "",
    zipcode: "",
    address1: "",
    address2: "",
    deliveryNote: "",
  });

  useEffect(() => {
    loadSession();
  }, [sessionCode]);

  useEffect(() => {
    // 추가 주문인 경우 저장된 구매자 정보 불러오기
    if (continueOrder) {
      loadSavedBuyerInfo();
    }
  }, [continueOrder]);

  // 이름+닉네임 조합으로 저장된 정보가 있는지 확인
  const checkSavedBuyerInfo = (name: string, nickname: string) => {
    if (!name.trim() || !nickname.trim()) return;
    
    try {
      const buyerKey = `${name.trim()}-${nickname.trim()}`;
      const savedInfo = localStorage.getItem(`buyer_info_${sessionCode}_${buyerKey}`);
      
      if (savedInfo) {
        const info = JSON.parse(savedInfo);
        setFormData({
          ...formData,
          buyerName: info.buyerName || "",
          buyerNickname: info.buyerNickname || "",
          buyerPhone: info.buyerPhone || "",
          buyerContact: info.buyerContact || "",
          zipcode: info.zipcode || "",
          address1: info.address1 || "",
          address2: info.address2 || "",
        });
        
        // 첫 주문 여부 판별
        setIsFirstOrder(!info.address1);
        
        toast.success(`${nickname}님, 다시 오셨네요! 정보를 불러왔습니다 😊`);
      }
    } catch (error) {
      console.error("구매자 정보 불러오기 실패:", error);
    }
  };

  const loadSavedBuyerInfo = () => {
    // continueOrder=true로 접근한 경우, 세션에 저장된 마지막 구매자 정보 불러오기
    try {
      const lastBuyerKey = localStorage.getItem(`last_buyer_${sessionCode}`);
      if (lastBuyerKey) {
        const savedInfo = localStorage.getItem(`buyer_info_${sessionCode}_${lastBuyerKey}`);
        if (savedInfo) {
          const info = JSON.parse(savedInfo);
          setFormData({
            ...formData,
            buyerName: info.buyerName || "",
            buyerNickname: info.buyerNickname || "",
            buyerPhone: info.buyerPhone || "",
            buyerContact: info.buyerContact || "",
            zipcode: info.zipcode || "",
            address1: info.address1 || "",
            address2: info.address2 || "",
          });
          
          // 첫 주문 여부 판별
          setIsFirstOrder(!info.address1);
          
          toast.success(`${info.buyerNickname}님, 다시 오셨네요! 정보를 불러왔습니다 😊`);
        }
      }
    } catch (error) {
      console.error("구매자 정보 불러오기 실패:", error);
    }
  };

  const loadSession = async () => {
    try {
      const sessionData = await getSessionByCode(sessionCode);
      setSession(sessionData);
    } catch (error) {
      console.error("세션 로드 실패:", error);
      toast.error("세션을 찾을 수 없거나 종료되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 이름과 닉네임 모두 입력되면 자동으로 저장된 정보 확인
    if (name === "buyerName" || name === "buyerNickname") {
      const newName = name === "buyerName" ? value : formData.buyerName;
      const newNickname = name === "buyerNickname" ? value : formData.buyerNickname;
      
      if (newName.trim() && newNickname.trim()) {
        checkSavedBuyerInfo(newName, newNickname);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 검증
    const validation = validateImageFile(file, 10); // 10MB
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("세션 정보를 불러올 수 없습니다.");
      return;
    }

    if (!imageFile) {
      toast.error("상품 이미지를 업로드해주세요.");
      return;
    }

    if (!formData.buyerName.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (!formData.buyerNickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    if (!formData.buyerPhone.trim()) {
      toast.error("연락처를 입력해주세요.");
      return;
    }

    // 첫 주문 시 배송 정보 필수
    if (isFirstOrder && !formData.address1.trim()) {
      toast.error("첫 주문 시 배송 정보를 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      // 이미지 업로드
      toast.info("이미지 업로드 중...");
      const imageUrl = await uploadResizedImage(
        imageFile,
        "order-images",
        `session-${session.id}`
      );

      // 주문 생성
      const order = await createOrder({
        sessionId: session.id,
        storeId: session.store_id,
        buyerName: formData.buyerName.trim(),
        buyerNickname: formData.buyerNickname.trim(),
        buyerPhone: formData.buyerPhone.trim(),
        buyerContact: formData.buyerContact.trim() || undefined,
        productImageUrl: imageUrl,
        productNote: formData.productNote.trim() || undefined,
        buyerPriceInfo: formData.buyerPriceInfo.trim() || undefined,
        zipcode: formData.zipcode.trim() || undefined,
        address1: formData.address1.trim() || undefined,
        address2: formData.address2.trim() || undefined,
        deliveryNote: formData.deliveryNote.trim() || undefined,
      });

      // 구매자 정보 저장 (이름+닉네임별로 저장)
      const buyerInfo = {
        buyerName: formData.buyerName.trim(),
        buyerNickname: formData.buyerNickname.trim(),
        buyerPhone: formData.buyerPhone.trim(),
        buyerContact: formData.buyerContact.trim(),
        zipcode: formData.zipcode.trim(),
        address1: formData.address1.trim(),
        address2: formData.address2.trim(),
      };
      
      const buyerKey = `${formData.buyerName.trim()}-${formData.buyerNickname.trim()}`;
      localStorage.setItem(`buyer_info_${sessionCode}_${buyerKey}`, JSON.stringify(buyerInfo));
      
      // 마지막 주문한 구매자 키 저장 (다시 주문하기 기능용)
      localStorage.setItem(`last_buyer_${sessionCode}`, buyerKey);

      toast.success("주문이 완료되었습니다! 🎉");
      
      // 성공 페이지로 이동
      router.push(`/order/${sessionCode}/success?orderId=${order.id}`);
    } catch (error) {
      console.error("주문 생성 실패:", error);
      toast.error("주문 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              세션을 찾을 수 없습니다
            </h2>
            <p className="text-gray-600">
              세션이 종료되었거나 존재하지 않는 세션입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <main className="max-w-lg mx-auto px-4">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">주문하기</h1>
          <p className="text-gray-600">{session.name}</p>
          <Badge className="mt-2 bg-red-500 text-white">LIVE</Badge>
        </motion.div>

        {/* 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 상품 이미지 업로드 */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  📸 상품 이미지 <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!imagePreview ? (
                  <label
                    htmlFor="image-upload"
                    className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        화면 캡처한 사진 업로드
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, WebP (최대 10MB)
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="업로드된 상품"
                      className="w-full h-auto rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleRemoveImage}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 상품 정보 */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">📝 상품 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="productNote">상품 메모</Label>
                  <Textarea
                    id="productNote"
                    name="productNote"
                    placeholder="예: 검정색 / L 사이즈"
                    value={formData.productNote}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="buyerPriceInfo">가격 정보 (선택)</Label>
                  <Input
                    id="buyerPriceInfo"
                    name="buyerPriceInfo"
                    placeholder="예: 35,000원으로 봤어요"
                    value={formData.buyerPriceInfo}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 구매자 정보 */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">👤 구매자 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="buyerName">
                    이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="buyerName"
                    name="buyerName"
                    placeholder="홍길동"
                    value={formData.buyerName}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="buyerNickname">
                    닉네임 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="buyerNickname"
                    name="buyerNickname"
                    placeholder="길동이"
                    value={formData.buyerNickname}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 같은 이름+닉네임으로 주문하면 자동으로 묶입니다
                  </p>
                </div>

                <div>
                  <Label htmlFor="buyerPhone">
                    연락처 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="buyerPhone"
                    name="buyerPhone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.buyerPhone}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="buyerContact">카톡ID / 인스타 (선택)</Label>
                  <Input
                    id="buyerContact"
                    name="buyerContact"
                    placeholder="@instagram 또는 카톡ID"
                    value={formData.buyerContact}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 배송 정보 */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🚚 배송 정보 
                  {isFirstOrder ? (
                    <span className="text-red-500 text-sm">* 최초 1회 필수</span>
                  ) : (
                    <span className="text-gray-400 text-sm">(선택)</span>
                  )}
                </CardTitle>
                {isFirstOrder && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ 첫 주문 시 배송지를 꼭 입력해주세요. 다음부터는 선택사항입니다.
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="address1">
                    주소 {isFirstOrder && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="address1"
                    name="address1"
                    placeholder="서울시 강남구..."
                    value={formData.address1}
                    onChange={handleChange}
                    required={isFirstOrder}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address2">상세 주소</Label>
                  <Input
                    id="address2"
                    name="address2"
                    placeholder="101동 202호"
                    value={formData.address2}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryNote">배송 메모</Label>
                  <Input
                    id="deliveryNote"
                    name="deliveryNote"
                    placeholder="문 앞에 두고 가주세요"
                    value={formData.deliveryNote}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 입금 정보 */}
            {(session.bank_name || session.bank_account) && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">💰 입금 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {session.bank_name && (
                      <p className="font-medium">은행: {session.bank_name}</p>
                    )}
                    {session.bank_account && (
                      <p className="font-medium">
                        계좌: {session.bank_account}
                      </p>
                    )}
                    {session.bank_holder && (
                      <p className="font-medium">
                        예금주: {session.bank_holder}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    ⚠️ 주문 후 위 계좌로 입금해주세요
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 제출 버튼 */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold text-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  주문 중...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  주문하기
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200"
        >
          <p className="text-sm text-amber-800">
            💡 <strong>주문 후:</strong> 판매자가 주문을 확인한 후 입금 안내를
            드립니다. 연락처로 연락이 갈 수 있으니 확인해주세요!
          </p>
        </motion.div>
      </main>
    </div>
  );
}

