import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  fetchCurrentUser,
  oauthKakaoCallback,
  oauthTransfer,
} from "@/api/authApi";

export default function OAuthKakaoPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const rawMode = params.get("state") || params.get("mode") || "login";
  const mode = rawMode === "connect" ? "connect" : "login";

  const navigate = useNavigate();
  const { setTokens, setUser, clearAuth } = useAuthStore();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (!code) {
      alert("카카오 인증 코드가 존재하지 않습니다.");
      navigate("/login", { replace: true });
      return;
    }

    if (didRunRef.current) return;
    didRunRef.current = true;

    const run = async () => {
      try {
        const res = await oauthKakaoCallback({ code, mode });
        if (!res?.success) {
          throw new Error(res?.error?.message || "카카오 인증에 실패했습니다.");
        }

        const {
          status,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          expiresIn,
          provider,
          providerUserId,
          email,
        } = res.data || {};

        if (status === "SUCCESS") {
          if (accessToken && refreshToken) {
            setTokens({
              accessToken,
              refreshToken,
              accessTokenExpiresIn: accessTokenExpiresIn ?? expiresIn,
            });
            try {
              const meRes = await fetchCurrentUser();
              if (meRes?.success && meRes.data) {
                setUser(meRes.data);
              }
            } catch {
              clearAuth();
            }
          }
          navigate("/", { replace: true });
          return;
        }

        if (status === "NEED_REGISTER") {
          navigate("/register/social", {
            replace: true,
            state: { provider, providerUserId, email },
          });
          return;
        }

        if (status === "NEED_PHONE_CONNECT") {
          navigate("/oauth/phone-connect", {
            replace: true,
            state: { provider, providerUserId },
          });
          return;
        }

        if (status === "NEED_TRANSFER") {
          const ok = window.confirm(
            "이미 다른 계정에 연결된 소셜 계정입니다. 이전하시겠습니까?"
          );
          if (ok) {
            try {
              const transferRes = await oauthTransfer({
                provider,
                providerUserId,
              });
              if (!transferRes?.success) {
                throw new Error(
                  transferRes?.error?.message || "계정 이전에 실패했습니다."
                );
              }
              navigate("/", { replace: true });
              return;
            } catch (err) {
              const message =
                err?.message ||
                err?.response?.data?.message ||
                "계정 이전에 실패했습니다.";
              alert(message);
              navigate("/login", { replace: true });
              return;
            }
          } else {
            navigate("/login", { replace: true });
            return;
          }
        }

        alert("지원하지 않는 상태입니다. 다시 시도해주세요.");
        navigate("/login", { replace: true });
      } catch (err) {
        console.error(err);
        alert(err?.message || "카카오 인증 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [code, mode, navigate, setTokens, setUser, clearAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700 px-8 py-10 text-center space-y-4 shadow-xl">
        <div className="text-lg font-semibold text-slate-50">
          카카오 인증 처리 중...
        </div>
        <div className="text-sm text-slate-400">
          잠시만 기다려주세요. MoA가 동행을 준비하고 있습니다.
        </div>
      </div>
    </div>
  );
}
