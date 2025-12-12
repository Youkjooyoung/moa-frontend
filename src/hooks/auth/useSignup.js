import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useSignupStore } from "@/store/user/addUserStore";
import { signup, checkCommon, checkPhone, fetchCurrentUser } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const BAD_WORDS = ["fuck", "shit", "bitch", "asshole", "ssibal", "jiral"];

const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NICKNAME: /^[A-Za-z0-9\uAC00-\uD7A3]{2,10}$/,
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/,
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const useSignup = ({ mode = "normal", socialInfo } = {}) => {
  const navigate = useNavigate();
  const { form, errors, setField, setErrorMessage, reset } = useSignupStore();
  const isSocial = mode === "social";
  const { setTokens, setUser, clearAuth } = useAuthStore();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nicknameRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    return () => {
      if (form.previewUrl) URL.revokeObjectURL(form.previewUrl);
      reset();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setField("profileImage", file);
      setField("previewUrl", url);
    }
  };

  const handleBlur = () => {};

  /* ==============================
      ?대찓??以묐났/?뺤떇 泥댄겕
     ============================== */
  useEffect(() => {
    if (isSocial) return;

    const checkEmail = async () => {
      if (!form.email) return setErrorMessage("email", "", false);

      if (!REGEX.EMAIL.test(form.email)) {
        return setErrorMessage("email", "?대찓???뺤떇???щ컮瑜댁? ?딆뒿?덈떎.", true);
      }

      setErrorMessage("email", "?뺤씤 以?..", false);

      try {
        const res = await checkCommon({ type: "email", value: form.email });
        const available = res.data?.available ?? res.data?.data?.available;
        setErrorMessage(
          "email",
          available ? "?ъ슜 媛?ν븳 ?대찓?쇱엯?덈떎." : "?대? ?ъ슜 以묒엯?덈떎.",
          !available
        );
      } catch {
        setErrorMessage("email", "以묐났 ?뺤씤 ?ㅽ뙣 (?쒕쾭 ?ㅻ쪟)", false);
      }
    };

    const t = setTimeout(checkEmail, 400);
    return () => clearTimeout(t);
  }, [form.email]);

  /* ==============================
      鍮꾨?踰덊샇 洹쒖튃 寃利?     ============================== */
  useEffect(() => {
    if (isSocial) return;

    if (!form.password) return setErrorMessage("password", "", false);

    if (!REGEX.PASSWORD.test(form.password)) {
      setErrorMessage(
        "password",
        "?곷Ц+?レ옄+?뱀닔臾몄옄 ?ы븿 8~20?먮줈 ?낅젰?댁＜?몄슂.",
        true
      );
    } else {
      setErrorMessage("password", "?ъ슜 媛?ν븳 鍮꾨?踰덊샇?낅땲??", false);
    }
  }, [form.password]);

  /* ==============================
      鍮꾨?踰덊샇 ?쇱튂 寃利?     ============================== */
  useEffect(() => {
    if (isSocial) return;

    if (!form.passwordCheck) return setErrorMessage("passwordCheck", "", false);

    if (form.password !== form.passwordCheck) {
      setErrorMessage("passwordCheck", "鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.", true);
    } else {
      setErrorMessage("passwordCheck", "鍮꾨?踰덊샇媛 ?쇱튂?⑸땲??", false);
    }
  }, [form.passwordCheck, form.password]);

  /* ==============================
      ?됰꽕?꾧?利? 湲덉튃?닿?利?     ============================== */
  useEffect(() => {
    const checkNickname = async () => {
      if (!form.nickname) return setErrorMessage("nickname", "", false);

      if (!REGEX.NICKNAME.test(form.nickname)) {
        return setErrorMessage(
          "nickname",
          "?됰꽕?꾩? 2~10?먯쓽 ?쒓?/?곷Ц/?レ옄留?媛?ν빀?덈떎.",
          true
        );
      }

      if (BAD_WORDS.some((bad) => form.nickname.toLowerCase().includes(bad))) {
        return setErrorMessage(
          "nickname",
          "遺?곸젅???⑥뼱媛 ?ы븿?섏뼱 ?덉뒿?덈떎.",
          true
        );
      }

      setErrorMessage("nickname", "?뺤씤 以?..", false);

      try {
        const res = await checkCommon({
          type: "nickname",
          value: form.nickname,
        });
        const available = res.data?.available ?? res.data?.data?.available;
        setErrorMessage(
          "nickname",
          available ? "?ъ슜 媛?ν븳 ?됰꽕?꾩엯?덈떎." : "?대? ?ъ슜 以묒엯?덈떎.",
          !available
        );
      } catch {
        setErrorMessage("nickname", "以묐났 ?뺤씤 ?ㅽ뙣 (?쒕쾭 ?ㅻ쪟)", false);
      }
    };

    const t = setTimeout(checkNickname, 400);
    return () => clearTimeout(t);
  }, [form.nickname]);

  /* ==============================
      PASS 蹂몄씤?몄쬆
     ============================== */
  const handlePassAuth = async () => {
    try {
      const start = await httpClient.get("/users/pass/start");
      if (!start?.success)
        throw new Error(start?.error?.message || "蹂몄씤?몄쬆 ?쒖옉 ?ㅽ뙣");

      const { impCode, merchantUid } = start.data;

      if (!window.IMP) return alert("?몄쬆 紐⑤뱢 濡쒕뱶 ?ㅽ뙣");

      window.IMP.init(impCode);
      window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) return;

        try {
          const verify = await httpClient.post("/users/pass/verify", {
            imp_uid: rsp.imp_uid,
          });

          if (!verify?.success) {
            throw new Error(verify?.error?.message || "蹂몄씤?몄쬆 ?ㅽ뙣");
          }

          const { phone, ci } = verify.data;

          // ?대??곗쨷蹂?泥댄겕
          const phoneCheck = await checkPhone(phone);
          const available =
            phoneCheck?.data?.available ?? phoneCheck?.data?.data?.available;
          if (!phoneCheck?.success || available === false) {
            throw new Error(
              phoneCheck?.error?.message || "?대? ?깅줉??踰덊샇?낅땲??"
            );
          }

          setField("phone", phone);
          sessionStorage.setItem("PASS_CI", ci);
          setErrorMessage("phone", "蹂몄씤?몄쬆 ?깃났!", false);
        } catch (err) {
          sessionStorage.removeItem("PASS_CI");
          setField("phone", "");
          const message =
            err?.message ||
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "蹂몄씤?몄쬆 ?ㅽ뙣";
          setErrorMessage("phone", message, true);
          alert(message);
        }
      });
    } catch {
      alert("蹂몄씤?몄쬆 ?ㅻ쪟");
    }
  };

  /* ==============================
      理쒖쥌 ?뚯썝媛???쒖텧
     ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSocial) {
      if (!form.email || errors.email.isError)
        return alert("?대찓?쇱쓣 ?뺤씤?댁＜?몄슂.");

      if (!form.password || errors.password.isError)
        return alert("鍮꾨?踰덊샇瑜??뺤씤?댁＜?몄슂.");

      if (!form.passwordCheck || errors.passwordCheck.isError)
        return alert("鍮꾨?踰덊샇 ?쇱튂瑜??뺤씤?댁＜?몄슂.");
    }

    if (!form.nickname || errors.nickname.isError)
      return alert("?됰꽕?꾩쓣 ?뺤씤?댁＜?몄슂.");

    if (!form.phone) return alert("蹂몄씤?몄쬆??吏꾪뻾?댁＜?몄슂.");
    if (errors.phone.isError)
      return alert(errors.phone.message || "?대???踰덊샇瑜??뺤씤?댁＜?몄슂.");

    const ci = sessionStorage.getItem("PASS_CI");
    if (!ci) return alert("蹂몄씤?몄쬆 ?뺣낫瑜?李얠쓣 ???놁뒿?덈떎.");

    const socialEmail = socialInfo?.email || form.email;
    if (isSocial && !socialEmail) {
      return alert("?뚯뀥 ?대찓???뺣낫瑜??뺤씤?????놁뒿?덈떎.");
    }

    let base64 = null;
    if (form.profileImage) base64 = await toBase64(form.profileImage);

    const payload = isSocial
      ? {
          provider: socialInfo.provider,
          providerUserId: socialInfo.providerUserId,
          userId: socialEmail,
          nickname: form.nickname,
          phone: form.phone,
          agreeMarketing: form.agreeMarketing,
          ci,
        }
      : {
          userId: form.email,
          password: form.password,
          passwordConfirm: form.passwordCheck,
          nickname: form.nickname,
          phone: form.phone,
          agreeMarketing: form.agreeMarketing,
          profileImageBase64: base64,
          ci,
        };

    try {
      const res = await signup(payload);
      if (!res?.success) {
        throw new Error(res?.error?.message || "?뚯썝媛???ㅽ뙣");
      }

      const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        expiresIn,
      } = res.data || {};

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

        navigate("/", { replace: true });
        return;
      }

      alert("?몄쬆 硫붿씪??諛쒖넚?섏뿀?듬땲?? ?대찓?쇱쓣 ?뺤씤?댁＜?몄슂.");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err?.message || err?.response?.data?.message || "?뚯썝媛???ㅽ뙣");
    }
  };

  return {
    form,
    errors,
    refs: { emailRef, passwordRef, passwordCheckRef, nicknameRef, phoneRef },
    handleChange,
    handleBlur,
    handleImageChange,
    handlePassAuth,
    handleSubmit,
  };
};
