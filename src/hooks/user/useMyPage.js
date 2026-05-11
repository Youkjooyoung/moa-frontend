import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { useOtpStore } from "@/store/user/otpStore";
import { otpHandlers } from "@/hooks/user/useOtp";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function getLoginProviderLabel(user) {
  if (!user) return "EMAIL";

  const raw =
    user.loginProvider ||
    user.provider ||
    user.lastLoginType ||
    (user.oauthConnections || []).find((connection) => connection.provider && !connection.releaseDate)
      ?.provider;

  const provider = (raw || "").toString().toLowerCase();

  if (provider === "kakao") return "KAKAO";
  if (provider === "google") return "GOOGLE";
  return "EMAIL";
}

export const useMyPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { enabled, modalOpen, qrUrl, code, loading, setEnabled } = useOtpStore();
  const otpActionHandlers = otpHandlers();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await httpClient.get("/users/me");
        const { success, data } = res;

        if (!success || !data) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(data);
        setEnabled(!!data.otpEnabled);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    if (!user) fetchUserData();
  }, [user, setUser, setEnabled, navigate]);

  useEffect(() => {
    setEnabled(!!user?.otpEnabled);
  }, [user, setEnabled]);

  const marketingAgreed = user
    ? user.agreeMarketing ?? user.marketing ?? false
    : false;

  const shortId = user?.userId?.split("@")[0] || user?.userId || "";
  const isAdmin = user?.role === "ADMIN";

  const googleOAuth = (user?.oauthConnections || []).find(
    (connection) => connection.provider?.toLowerCase() === "google" && !connection.releaseDate
  );

  const kakaoOAuth = (user?.oauthConnections || []).find(
    (connection) => connection.provider?.toLowerCase() === "kakao" && !connection.releaseDate
  );

  const googleConn = Boolean(
    (user?.loginProvider || "").toLowerCase() === "google" || googleOAuth
  );

  const kakaoConn = Boolean(
    (user?.loginProvider || "").toLowerCase() === "kakao" || kakaoOAuth
  );

  const handlers = {
    oauthConnect: async (provider) => {
      const res = await httpClient.get(`/oauth/${provider}/auth`, {
        params: { mode: "connect" },
      });

      const body = res?.data;
      const url =
        typeof body === "string"
          ? body
          : body?.url || body?.data?.url || body?.redirectUrl;

      if (!url) {
        alert("계정 연결을 시작할 수 없습니다.");
        return;
      }

      window.location.assign(url);
    },

    oauthRelease: async (oauthId) => {
      if (!oauthId) {
        alert("현재 로그인에 사용 중인 계정은 해제할 수 없습니다.");
        return;
      }

      const res = await httpClient.post("/oauth/release", { oauthId });

      if (res.success) {
        await useAuthStore.getState().fetchSession();
      } else {
        alert("소셜 계정 연결 해제에 실패했습니다.");
      }
    },

    formatDate,
  };

  const handleGoogleClick = () => {
    if (googleOAuth) {
      return handlers.oauthRelease(googleOAuth.oauthId);
    }
    return handlers.oauthConnect("google");
  };

  const handleKakaoClick = () => {
    if ((user?.loginProvider || "").toLowerCase() === "kakao") {
      alert("현재 로그인에 사용 중인 카카오 계정은 해제할 수 없습니다.");
      return;
    }

    if (kakaoOAuth) {
      return handlers.oauthRelease(kakaoOAuth.oauthId);
    }

    return handlers.oauthConnect("kakao");
  };

  const handleOtpModalChange = (isOpen) => {
    if (!isOpen) otpActionHandlers.closeModal();
  };

  return {
    state: {
      user,
      isAdmin,
      shortId,
      marketingAgreed,
      googleConn,
      kakaoConn,
      loginProvider: getLoginProviderLabel(user),
      otp: {
        enabled: !!(user?.otpEnabled ?? enabled),
        modalOpen,
        qrUrl,
        code,
        loading,
      },
    },
    actions: {
      navigate,
      ...handlers,
      otp: otpActionHandlers,
      handleGoogleClick,
      handleKakaoClick,
      handleOtpModalChange,
    },
  };
};
