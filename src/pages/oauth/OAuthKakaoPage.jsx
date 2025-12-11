import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { fetchCurrentUser } from "@/api/authApi";

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
        const res = await httpClient.get("/oauth/kakao/callback", {
          params: { code, mode },
        });

        if (!res.success) {
          alert(res.error?.message || "카카오 인증에 실패했습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const {
          status,
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          provider,
          providerUserId,
          fromUserId,
          toUserId,
        } = res.data || {};

        if (status === "LOGIN") {
          if (accessToken) {
            setTokens({
              accessToken,
              refreshToken,
              accessTokenExpiresIn,
            });

            try {
              const meRes = await fetchCurrentUser();
              if (meRes.success) setUser(meRes.data);
            } catch (e) {
              console.error(e);
              clearAuth();
            }
          }
          navigate("/", { replace: true });
          return;
        }

        if (status === "NEED_REGISTER" && provider && providerUserId) {
          if (mode === "connect") {
            alert(
              "해당 소셜 계정으로 가입 이력이 없어 현재 계정과 연결할 수 없습니다."
            );
            navigate("/mypage", { replace: true });
            return;
          }
          navigate("/register/social", {
            replace: true,
            state: { provider, providerUserId },
          });
          return;
        }

        if (status === "CONNECT") {
          alert("카카오 계정 연동이 완료되었습니다.");
          navigate("/mypage", { replace: true });
          return;
        }

        if (
          status === "NEED_TRANSFER" &&
          provider &&
          providerUserId &&
          fromUserId
        ) {
          const ok = window.confirm(
            "이 카카오 계정은 이미 다른 아이디에 연결되어 있습니다.\n계정 이전을 진행하시겠습니까?"
          );

          if (ok) {
            try {
              const transferRes = await httpClient.post("/oauth/transfer", {
                provider,
                providerUserId,
                fromUserId,
              });

              if (!transferRes.success) {
                alert(
                  transferRes.error?.message || "계정 이전에 실패했습니다."
                );
                navigate("/mypage", { replace: true });
                return;
              }

              try {
                const meRes = await fetchCurrentUser();
                if (meRes.success) setUser(meRes.data);
              } catch (e) {
                console.error(e);
                clearAuth();
              }

              alert("계정 이전이 완료되었습니다.");
              navigate("/mypage", { replace: true });
              return;
            } catch (e) {
              console.error(e);
              alert(
                e.response?.data?.error?.message ||
                  e.response?.data?.message ||
                  "계정 이전 처리 중 오류가 발생했습니다."
              );
              navigate("/mypage", { replace: true });
              return;
            }
          } else {
            navigate("/mypage", { replace: true });
            return;
          }
        }

        alert("알 수 없는 상태입니다. 다시 시도해주세요.");
        navigate("/login", { replace: true });
      } catch (err) {
        console.error(err);
        alert(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "카카오 인증 처리 중 오류가 발생했습니다."
        );
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
          잠시만 기다려 주세요. MoA와 연동을 준비하고 있습니다.
        </div>
      </div>
    </div>
  );
}
