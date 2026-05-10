import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CreditCard, Info } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";
import { MoaCard } from "@/components/common/MoaPage";

export default function BillingRegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      toast.warning("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    // 자동으로 빌링키 등록 플로우 시작
    const startBillingAuth = async () => {
      try {
        // Toss Payments 빌링 인증 요청
        await requestBillingAuth(user.userId);
      } catch (error) {
        console.error("Billing auth failed:", error);
        const errorInfo = handleApiError(error);
        toast.error(errorInfo.message);

        // 에러 발생 시 원래 예정된 페이지로 이동
        const redirectPath =
          localStorage.getItem("afterBillingRedirect") || "/user/wallet";
        localStorage.removeItem("afterBillingRedirect");
        localStorage.removeItem("billingRegistrationReason");
        navigate(redirectPath);
      }
    };

    startBillingAuth();
  }, [user, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-md">
        <MoaCard className="p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-[var(--theme-primary)]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[var(--theme-text)]">
              {localStorage.getItem("billingRegistrationReason") === "party_join"
                ? "거의 다 됐어요!"
                : "자동 결제 설정 중..."}
            </h2>
            <p className="mb-6 font-medium text-[var(--theme-text-muted)]">
              {localStorage.getItem("billingRegistrationReason") === "party_join"
                ? "파티 가입 완료를 위해 카드를 등록해주세요"
                : "월 구독료 자동 결제를 위해 카드를 등록합니다"}
            </p>
            <div className="rounded-xl border border-[var(--theme-border-light)] bg-[var(--theme-surface-muted)] p-4 text-left">
              <div className="mb-3 flex items-center gap-2 font-semibold text-[var(--theme-primary)]">
                <Info className="w-4 h-4" />
                안내사항
              </div>
              <ul className="space-y-2 text-sm text-[var(--theme-text-muted)]">
                <li className="flex items-start gap-2">
                  <CreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-primary)]" />
                  매월 자동으로 구독료가 결제됩니다
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-primary)]" />
                  결제일은 파티 설정에 따라 다릅니다
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-primary)]" />
                  언제든지 카드 변경이 가능합니다
                </li>
              </ul>
            </div>
          </div>
        </MoaCard>
      </div>
    </div>
  );
}
