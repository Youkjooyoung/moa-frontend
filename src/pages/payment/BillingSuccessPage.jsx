import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Wallet } from "lucide-react";
import httpClient from "../../api/httpClient";
import { handlePaymentError, handleNetworkError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";
import { MoaButton, MoaCard } from "@/components/common/MoaPage";

export default function BillingSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("카드 등록 중...");

    useEffect(() => {
        registerBillingKey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const registerBillingKey = async () => {
        // Show warning toast if processing takes too long
        const timeoutId = setTimeout(() => {
            toast.warning('처리가 지연되고 있습니다. 잠시만 기다려주세요...');
        }, 5000);

        try {
            // Toss Payments에서 전달하는 파라미터
            const authKey = searchParams.get("authKey");

            if (!authKey) {
                throw new Error("빌링키 정보가 없습니다.");
            }

            // 백엔드를 통해 안전하게 빌링키 발급 (카드 저장까지 백엔드에서 처리)
            await httpClient.post("/users/me/billing-key/issue", {
                authKey
            });

            clearTimeout(timeoutId);

            // 파티 가입 플로우인지 확인
            const reason = localStorage.getItem("billingRegistrationReason");
            const redirectPath = localStorage.getItem("afterBillingRedirect");
            const pendingPartyJoin = localStorage.getItem("pendingPartyJoin");

            if (reason === "party_join_new_flow" && pendingPartyJoin) {
                // 파티 가입 자동 처리
                setMessage("결제 진행 중...");
                try {
                    const { partyId, amount } = JSON.parse(pendingPartyJoin);
                    await httpClient.post(`/parties/${partyId}/join`, {
                        useExistingCard: true,
                        amount,
                        paymentMethod: "CARD"
                    });

                    setStatus("success");
                    setMessage("파티 가입이 완료되었습니다! 🎉");
                    toast.success("파티 가입 완료! 파티 페이지로 이동합니다.");

                    // localStorage 정리
                    localStorage.removeItem("billingRegistrationReason");
                    localStorage.removeItem("afterBillingRedirect");
                    localStorage.removeItem("pendingPartyJoin");

                    setTimeout(() => {
                        navigate(`/party/${partyId}`);
                    }, 1500);
                } catch (joinError) {
                    console.error("Party join failed:", joinError);
                    setStatus("error");
                    setMessage(joinError.response?.data?.error?.message || "파티 가입에 실패했습니다.");
                    toast.error("카드는 등록되었지만 파티 가입에 실패했습니다. 다시 시도해주세요.");

                    // localStorage 정리
                    localStorage.removeItem("billingRegistrationReason");
                    localStorage.removeItem("afterBillingRedirect");
                    localStorage.removeItem("pendingPartyJoin");

                    setTimeout(() => {
                        navigate(redirectPath || "/party");
                    }, 2000);
                }
            } else if (reason === "party_join") {
                // 기존 플로우 (OTT 정보 확인 후 빌링키 등록)
                setStatus("success");
                setMessage("월 구독료 자동 결제가 설정되었습니다!");
                toast.success("자동 결제 설정 완료! 파티에 참여했습니다.");

                localStorage.removeItem("billingRegistrationReason");
                localStorage.removeItem("afterBillingRedirect");

                setTimeout(() => {
                    navigate(redirectPath || "/user/wallet");
                }, 2000);
            } else {
                // 일반 카드 등록
                setStatus("success");
                setMessage("카드가 성공적으로 등록되었습니다!");
                toast.success("카드가 성공적으로 등록되었습니다!");

                localStorage.removeItem("billingRegistrationReason");
                localStorage.removeItem("afterBillingRedirect");

                setTimeout(() => {
                    navigate(redirectPath || "/user/wallet");
                }, 2000);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Billing key registration failed:", error);

            // Handle different error types
            const errorInfo = error.response
                ? handlePaymentError(error)
                : handleNetworkError(error);

            setStatus("error");
            setMessage(errorInfo.message);

            // Show error toast with action if available
            if (errorInfo.canRetry) {
                toast.errorWithAction(
                    errorInfo.message,
                    '다시 시도',
                    () => {
                        setStatus("processing");
                        setMessage("카드 등록 중...");
                        registerBillingKey();
                    }
                );
            } else if (errorInfo.actionUrl) {
                toast.errorWithAction(
                    errorInfo.message,
                    errorInfo.action,
                    () => navigate(errorInfo.actionUrl)
                );
            } else {
                toast.error(errorInfo.message);
            }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
            <div className="relative z-10 w-full max-w-md">
                <MoaCard className="p-8">
                    {status === "processing" && (
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-[var(--theme-primary)]" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-[var(--theme-text)]">
                                {message}
                            </h2>
                            <p className="font-medium text-[var(--theme-text-muted)]">잠시만 기다려주세요...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/15">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-[var(--theme-text)]">
                                {message}
                            </h2>
                            <p className="font-medium text-[var(--theme-text-muted)]">페이지로 이동합니다...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/15">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-[var(--theme-text)]">
                                카드 등록 실패
                            </h2>
                            <p className="mb-6 font-medium text-[var(--theme-text-muted)]">{message}</p>
                            <MoaButton onClick={() => navigate("/user/wallet")}>
                                <Wallet className="w-5 h-5" />
                                지갑으로 돌아가기
                            </MoaButton>
                        </div>
                    )}
                </MoaCard>
            </div>
        </div>
    );
}
