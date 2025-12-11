import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";

export default function OAuthGooglePage() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state") || "login";

        if (!code) {
          alert("Google 인증 코드가 존재하지 않습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const res = await httpClient.get("/oauth/google/callback", {
          params: { code, mode: state },
        });

        if (!res.success) {
          alert(res.error?.message || "구글 로그인에 실패했습니다.");
          navigate("/login", { replace: true });
          return;
        }

        const data = res.data || {};
        const { status, accessToken, refreshToken, accessTokenExpiresIn } = data;

        if (status === "LOGIN") {
          if (accessToken) {
            setTokens({ accessToken, refreshToken, accessTokenExpiresIn });
            const me = await httpClient.get("/users/me");
            if (me.success) setUser(me.data);
          }
          navigate("/", { replace: true });
          return;
        }

        if (status === "NEED_REGISTER") {
          if (state === "connect") {
            alert(
              "해당 소셜 계정으로 가입 이력이 없어 현재 계정과 연결할 수 없습니다."
            );
            navigate("/mypage", { replace: true });
            return;
          }
          navigate("/register/social", {
            state: {
              provider: "google",
              providerUserId: data.providerUserId,
            },
          });
          return;
        }

        if (status === "CONNECT") {
          alert("구글 계정 연동이 완료되었습니다.");
          navigate("/mypage", { replace: true });
          return;
        }

        if (status === "NEED_TRANSFER") {
          const { fromUserId, toUserId } = data;
          alert(
            "계정 이관이 필요합니다. 고객센터로 문의해주세요.\n" +
              `fromUserId: ${fromUserId || ""}, toUserId: ${toUserId || ""}`
          );
          navigate("/mypage", { replace: true });
          return;
        }

        alert("알 수 없는 상태입니다. 다시 시도해주세요.");
        navigate("/login", { replace: true });
      } catch (err) {
        console.error(err);
        alert("Google 인증 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate, setTokens, setUser]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-lg">
      Google 로그인 처리 중...
    </div>
  );
}
