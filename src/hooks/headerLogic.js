import { useEffect, useState } from "react";
import { fetchCurrentUser, logout as requestLogout } from "@/api/authApi";

export function useHeaderLogic() {
  const [user, setUser] = useState(null);
  const [oauthProvider, setOauthProvider] = useState(null);

  // ⭐ 프로필 URL 보정 함수
  const fixProfileImage = (url) => {
    if (!url) return null;

    // 서버가 제공하는 정적 파일: /uploads/** 형태
    if (url.startsWith("/")) {
      return `https://localhost:8443${url}`;
    }
    return url;
  };

  useEffect(() => {
    const path = window.location.pathname;
    const isOAuthCallback = path.startsWith("/oauth/");

    if (isOAuthCallback) {
      return;
    }

    fetchCurrentUser()
      .then((body) => {
        if (body.success && body.data) {
          const u = body.data;
          u.profileImage = fixProfileImage(u.profileImage);

          setUser(u);
          setOauthProvider(u.loginProvider ?? null);
        } else {
          setUser(null);
          setOauthProvider(null);
        }
      })
      .catch(() => {
        setUser(null);
        setOauthProvider(null);
      });
  }, []);

  const logout = async () => {
    try {
      const res = await requestLogout();
      const ok = typeof res.success !== "undefined" ? res.success : true;
      if (!ok && res.error?.message) {
        alert(res.error.message);
      }
    } finally {
      setUser(null);
      setOauthProvider(null);
      window.location.href = "/";
    }
  };

  return { user, oauthProvider, logout, isAdmin: user?.role === "ADMIN" };
}
