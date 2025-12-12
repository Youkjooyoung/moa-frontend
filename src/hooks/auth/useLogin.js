import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "@/store/user/loginStore";
import { useAuthStore } from "@/store/authStore";
import {
  login as apiLogin,
  startPassAuth,
  verifyPassAuth,
} from "@/api/authApi";
import { purgeLoginPasswords } from "@/store/authStore";

const loadIamport = () =>
  new Promise((resolve, reject) => {
    if (window.IMP) {
      resolve(window.IMP);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.IMP);
    script.onerror = reject;
    document.body.appendChild(script);
  });

export const PASSWORD_STORAGE_KEYS = [
  "login-password",
  "password",
  "pwd",
  "user-password",
  "pwd-remember",
];

export const purgeLoginPasswordKeys = (primaryStorage, secondaryStorage) => {
  const storages = [primaryStorage, secondaryStorage].filter(Boolean);
  storages.forEach((storage) => {
    PASSWORD_STORAGE_KEYS.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {
        /* ignore */
      }
    });
  });
};

export const applyRememberEmail = (storage, email, remember) => {
  try {
    if (remember) {
      storage.setItem("login-email", email);
    } else {
      storage.removeItem("login-email");
    }
  } catch (e) {
    console.warn("이메일 저장 실패", e);
  }
};

export const useLoginPageLogic = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpToken,
    setField,
    resetOtp,
  } = useLoginStore();
  const { setTokens } = useAuthStore();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpMode, setOtpMode] = useState("otp");
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleUnlockByCertification = useCallback(async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일을 입력해주세요.",
      }));
      return;
    }

    try {
      const IMP = await loadIamport();
      if (!IMP) {
        alert("본인인증 모듈 로드 실패");
        return;
      }

      const startRes = await startPassAuth();
      if (!startRes.success) {
        alert(startRes.error?.message || "본인인증 시작 실패");
        return;
      }

      const { impCode, merchantUid } = startRes.data;
      IMP.init(impCode);

      IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) {
          alert("본인인증이 취소되었거나 실패했습니다.");
          return;
        }

        try {
          const verifyRes = await verifyPassAuth({
            imp_uid: rsp.imp_uid,
            userId: trimmedEmail,
          });

          if (!verifyRes.success) {
            alert(verifyRes.error?.message || "본인인증 검증 실패");
            return;
          }

          alert("본인인증 완료! 계정 잠금이 해제되었습니다.");
        } catch (e) {
          console.error(e);
          alert("본인인증 검증 중 오류가 발생했습니다.");
        }
      });
    } catch (e) {
      console.error(e);
      alert("본인인증 진행 중 오류가 발생했습니다.");
    }
  }, [email]);

  const handleEmailLogin = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nextErrors = { email: "", password: "", otp: "" };

    if (!trimmedEmail) nextErrors.email = "이메일을 입력해주세요.";
    if (!trimmedPassword) nextErrors.password = "비밀번호를 입력해주세요.";

    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    if (loginLoading) return;

    try {
      setLoginLoading(true);
      const response = await apiLogin({
        userId: trimmedEmail,
        password: trimmedPassword,
      });

      if (!response.success) {
        alert(response.error?.message || "로그인에 실패했습니다.");
        return;
      }

      const data = response.data;

      if (data.otpRequired) {
        setField("otpRequired", true);
        setField("otpModalOpen", true);
        setField("otpToken", data.otpToken);
        setField("otpUserId", trimmedEmail);
        setField("otpCode", "");
        setOtpMode("otp");
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = data;
      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");
      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      applyRememberEmail(localStorage, trimmedEmail, remember);
      purgeLoginPasswordKeys(localStorage, sessionStorage);
      setField("password", "");
      resetOtp();
      localStorage.setItem("remember", remember ? "true" : "false");

      navigate("/", { replace: true });
    } catch (error) {
      const apiError = error?.response?.data?.error;
      const code = apiError?.code;
      const message = apiError?.message || "로그인 중 오류가 발생했습니다.";

      if (code === "E403" && message.includes("로그인 5회 실패")) {
        const start = window.confirm(
          "로그인 5회 실패로 계정이 잠겼습니다.\n본인인증으로 즉시 해제하시겠습니까?"
        );
        if (start) {
          await handleUnlockByCertification();
        }
        return;
      }

      alert(code ? `[${code}] ${message}` : message);
    } finally {
      setLoginLoading(false);
    }
  }, [
    email,
    password,
    remember,
    loginLoading,
    navigate,
    setField,
    setTokens,
    resetOtp,
    handleUnlockByCertification,
  ]);

  const handleOtpConfirm = useCallback(async () => {
    if (otpLoading) return;

    if (otpMode === "otp" && (!otpCode || otpCode.length !== 6)) {
      setErrors((prev) => ({
        ...prev,
        otp: "6자리 OTP 코드를 입력해주세요.",
      }));
      return;
    }

    try {
      setOtpLoading(true);

      const url =
        otpMode === "otp"
          ? "/auth/login/otp-verify"
          : "/auth/login/backup-verify";

      const res = await httpClient.post(url, {
        code: otpCode,
        otpToken,
        userId: email.trim(),
      });

      if (!res.success) {
        alert(res.error?.message || "OTP 인증 실패");
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = res.data;
      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");
      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      resetOtp();
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      alert("OTP 인증 처리 중 오류가 발생했습니다.");
    } finally {
      setOtpLoading(false);
    }
  }, [
    otpCode,
    otpToken,
    otpMode,
    otpLoading,
    email,
    resetOtp,
    setTokens,
    navigate,
  ]);

  useEffect(() => {
    setField("password", "");
    setField("otpCode", "");
    resetOtp();
    setErrors({ email: "", password: "", otp: "" });
    purgeLoginPasswords();

    const savedRemember = localStorage.getItem("remember") === "true";
    const savedEmail = localStorage.getItem("login-email");

    if (savedRemember && savedEmail) {
      setField("email", savedEmail);
      setField("remember", true);
    } else {
      setField("email", "");
      setField("remember", false);
    }

    purgeLoginPasswordKeys(localStorage, sessionStorage);
  }, [setField, resetOtp]);

  return {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpMode,
    loginLoading,
    otpLoading,
    errors,

    setField,

    handleEmailLogin,
    handleOtpConfirm,
    handleUnlockByCertification,

    handleEmailChange: (value) => {
      setErrors((prev) => ({ ...prev, email: "" }));
      setField("email", value);
    },

    handlePasswordChange: (value) => {
      setErrors((prev) => ({ ...prev, password: "" }));
      setField("password", value);
    },

    handleKakaoLogin: () => {
      const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
      if (!window.Kakao) {
        alert("카카오 SDK 로드 실패");
        return;
      }
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
      }
      window.Kakao.Auth.authorize({
        redirectUri,
        state: "login",
      });
    },

    handleGoogleLogin: async () => {
      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
      const res = await httpClient.get("/oauth/google/auth", {
        params: { mode: "login", redirectUri },
      });
      if (res.success) {
        window.location.href = res.data.url;
      }
    },

    handleOtpChange: (value) => {
      setErrors((prev) => ({ ...prev, otp: "" }));
      if (otpMode === "otp") {
        setField("otpCode", value.replace(/\D/g, "").slice(0, 6));
      } else {
        setField("otpCode", value.trim().toUpperCase());
      }
    },

    closeOtpModal: () => {
      resetOtp();
      setErrors((prev) => ({ ...prev, otp: "" }));
    },

    switchToOtpMode: () => {
      setField("otpCode", "");
      setErrors((prev) => ({ ...prev, otp: "" }));
    },

    switchToBackupMode: () => {
      setField("otpCode", "");
      setErrors((prev) => ({ ...prev, otp: "" }));
    },
  };
};
