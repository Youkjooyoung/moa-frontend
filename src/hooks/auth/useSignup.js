import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";

const BAD_WORDS = [
  "fuck", "shit", "bitch", "asshole", "개새", "개새끼", "씨발", "시발",
  "좆", "병신", "썅", "새끼", "니미", "염병", "지랄", "닥쳐",
];

const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NICKNAME: /^[A-Za-z0-9가-힣]{2,10}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/,
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    phone: "",
    agreeMarketing: false,
    profileImage: null,
    previewUrl: "",
  });

  const [errors, setErrors] = useState({
    email: { message: "", isError: false },
    nickname: { message: "", isError: false },
    phone: { message: "", isError: false },
    password: { message: "", isError: false },
    passwordCheck: { message: "", isError: false },
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nicknameRef = useRef(null);
  const phoneRef = useRef(null);

  const provider = searchParams.get("provider");
  const providerUserId = searchParams.get("providerUserId");
  const isSocial = !!(provider && providerUserId);

  const setErrorMessage = (name, message, isError) => {
    setErrors((prev) => ({
      ...prev,
      [name]: { message, isError },
    }));
  };

  useEffect(() => {
    return () => {
      if (form.previewUrl) {
        URL.revokeObjectURL(form.previewUrl);
      }
    };
  }, [form.previewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, profileImage: file, previewUrl: url }));
    }
  };

  const handleBlur = () => { };

  useEffect(() => {
    if (isSocial) return;

    const checkEmail = async () => {
      if (!form.email) {
        setErrorMessage("email", "", false);
        return;
      }
      if (!REGEX.EMAIL.test(form.email)) {
        setErrorMessage("email", "이메일 형식이 올바르지 않습니다.", true);
        return;
      }

      try {
        const res = await httpClient.post("/users/check", { type: "email", value: form.email });
        const available = res.data?.available ?? res.data?.data?.available;
        if (available) {
          setErrorMessage("email", "사용 가능한 이메일입니다.", false);
        } else {
          setErrorMessage("email", "이미 사용 중입니다.", true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const timer = setTimeout(checkEmail, 400);
    return () => clearTimeout(timer);
  }, [form.email, isSocial]);

  useEffect(() => {
    if (isSocial) return;

    if (!form.password) {
      setErrorMessage("password", "", false);
      return;
    }
    if (!REGEX.PASSWORD.test(form.password)) {
      setErrorMessage("password", "영문+숫자+특수문자 포함 8~20자로 입력하세요.", true);
    } else {
      setErrorMessage("password", "사용 가능한 비밀번호입니다.", false);
    }
  }, [form.password, isSocial]);

  useEffect(() => {
    if (isSocial) return;

    if (!form.passwordCheck) {
      setErrorMessage("passwordCheck", "", false);
      return;
    }
    if (form.password !== form.passwordCheck) {
      setErrorMessage("passwordCheck", "비밀번호가 일치하지 않습니다.", true);
    } else {
      setErrorMessage("passwordCheck", "비밀번호가 일치합니다.", false);
    }
  }, [form.passwordCheck, form.password, isSocial]);

  useEffect(() => {
    const checkNickname = async () => {
      if (!form.nickname) {
        setErrorMessage("nickname", "", false);
        return;
      }
      if (!REGEX.NICKNAME.test(form.nickname)) {
        setErrorMessage("nickname", "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.", true);
        return;
      }
      const lower = form.nickname.toLowerCase();
      if (BAD_WORDS.some((bad) => lower.includes(bad))) {
        setErrorMessage("nickname", "부적절한 단어가 포함될 수 없습니다.", true);
        return;
      }

      try {
        const res = await httpClient.post("/users/check", { type: "nickname", value: form.nickname });
        const available = res.data?.available ?? res.data?.data?.available;
        if (available) {
          setErrorMessage("nickname", "사용 가능한 닉네임입니다.", false);
        } else {
          setErrorMessage("nickname", "이미 사용 중입니다.", true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const timer = setTimeout(checkNickname, 400);
    return () => clearTimeout(timer);
  }, [form.nickname]);

  const handlePassAuth = async () => {
    try {
      const startRes = await httpClient.get("/users/pass/start");
      const { impCode, merchantUid } = startRes.data;

      if (!window.IMP) {
        alert("인증 모듈 로드 실패");
        return;
      }

      window.IMP.init(impCode);
      window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) return;
        try {
          const verifyRes = await httpClient.post("/users/pass/verify", { imp_uid: rsp.imp_uid });
          const { phone, ci, di } = verifyRes.data;

          setForm((prev) => ({ ...prev, phone }));
          sessionStorage.setItem("PASS_CI", ci);
          sessionStorage.setItem("PASS_DI", di);
          setErrorMessage("phone", "본인인증 성공!", false);
        } catch (err) {
          alert("본인인증 검증 오류");
        }
      });
    } catch (err) {
      alert("본인인증 초기화 오류");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSocial) {
      if (!form.email) {
        alert("이메일을 입력하세요.");
        emailRef.current?.focus();
        return;
      }
      if (errors.email.isError) {
        alert("이메일을 확인해주세요.");
        emailRef.current?.focus();
        return;
      }

      if (!form.password) {
        alert("비밀번호를 입력하세요.");
        passwordRef.current?.focus();
        return;
      }
      if (errors.password.isError) {
        alert("비밀번호 형식을 확인해주세요.");
        passwordRef.current?.focus();
        return;
      }

      if (!form.passwordCheck) {
        alert("비밀번호 확인을 입력하세요.");
        passwordCheckRef.current?.focus();
        return;
      }
      if (form.password !== form.passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        passwordCheckRef.current?.focus();
        return;
      }
    }

    if (!form.nickname) {
      alert("닉네임을 입력하세요.");
      nicknameRef.current?.focus();
      return;
    }
    if (errors.nickname.isError) {
      alert("닉네임을 확인해주세요.");
      nicknameRef.current?.focus();
      return;
    }

    if (!form.phone) {
      alert("휴대폰 번호를 입력(본인인증)하세요.");
      phoneRef.current?.focus();
      return;
    }

    const lowerNickname = form.nickname.toLowerCase();
    const hasBadWord = BAD_WORDS.some((bad) => lowerNickname.includes(bad));
    if (hasBadWord) {
      alert("닉네임에 부적절한 단어가 포함되어 있습니다.");
      nicknameRef.current?.focus();
      return;
    }

    const ci = sessionStorage.getItem("PASS_CI");
    const di = sessionStorage.getItem("PASS_DI");
    if (!ci || !di) {
      alert("본인인증이 필요합니다.");
      return;
    }

    let base64 = null;
    if (form.profileImage) {
      base64 = await toBase64(form.profileImage);
    }

    const payload = {
      userId: isSocial ? providerUserId : form.email,
      password: isSocial ? null : form.password,
      passwordConfirm: isSocial ? null : form.passwordCheck,
      nickname: form.nickname,
      phone: form.phone,
      agreeMarketing: form.agreeMarketing,
      profileImageBase64: base64,
      ci,
      di,
      provider: isSocial ? provider : null,
      providerUserId: isSocial ? providerUserId : null,
    };

    try {
      const res = await httpClient.post("/users/add", payload);
      const isSuccess = res.success || res.data?.success;

      if (isSuccess) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        const msg = res.error?.message || res.data?.message || res.message || "회원가입 실패";
        alert(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  return {
    form,
    errors,
    isSocial,
    refs: {
      emailRef,
      passwordRef,
      passwordCheckRef,
      nicknameRef,
      phoneRef,
    },
    handleChange,
    handleBlur,
    handleImageChange,
    handlePassAuth,
    handleSubmit,
  };
};