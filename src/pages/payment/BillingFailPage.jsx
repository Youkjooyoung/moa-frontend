import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { MoaBadge, MoaButton, MoaCard } from "@/components/common/MoaPage";

export default function BillingFailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorInfo = useMemo(() => {
    const code = searchParams.get("code") || "UNKNOWN_ERROR";
    const message = searchParams.get("message") || "알 수 없는 오류가 발생했습니다.";

    return {
      code,
      message: decodeURIComponent(message),
    };
  }, [searchParams]);

  useEffect(() => {
    localStorage.removeItem("billingRegistrationReason");
    localStorage.removeItem("afterBillingRedirect");
    localStorage.removeItem("pendingPartyJoin");
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <MoaCard className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/15">
          <XCircle className="h-10 w-10" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-[var(--theme-text)]">카드 등록 실패</h1>
        <p className="mb-4 text-sm leading-6 text-[var(--theme-text-muted)]">
          {errorInfo.message}
        </p>
        <MoaBadge tone="neutral">오류 코드: {errorInfo.code}</MoaBadge>

        <div className="my-6 rounded-xl bg-[var(--theme-surface-muted)] p-4 text-left">
          <p className="mb-2 text-sm font-bold text-[var(--theme-text)]">해결 방법</p>
          <ul className="space-y-1 text-sm leading-6 text-[var(--theme-text-muted)]">
            <li>다른 카드로 다시 시도해 주세요.</li>
            <li>카드사 앱에서 온라인 결제 설정을 확인해 주세요.</li>
            <li>문제가 지속되면 고객센터에 문의해 주세요.</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <MoaButton variant="secondary" className="flex-1" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </MoaButton>
          <MoaButton className="flex-1" onClick={() => navigate(-1)}>
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </MoaButton>
        </div>
      </MoaCard>
    </div>
  );
}
