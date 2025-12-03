// src/services/logic/loginPageLogic.js

import { login, startRestoreVerify } from "@/api/authApi";

export function initLoginPage() {
  const email = document.getElementById("loginEmail");
  const pw = document.getElementById("loginPassword");
  const btn = document.getElementById("btnLogin");

  const kakao = document.getElementById("btnKakaoLogin");
  const google = document.getElementById("btnGoogleLogin");

  if (btn) {
    btn.onclick = async () => {
      const data = {
        userId: email.value,
        password: pw.value,
      };

      try {
        const res = await login(data);
        const { success, error } = res;

        if (success) {
          window.location.href = "/";
          return;
        }

        if (!success && error?.code === "U410") {
          const ok = window.confirm(
            "탈퇴한 계정입니다.\n복구하시겠습니까? (본인인증 필요)"
          );

          if (ok) {
            try {
              debugger;
              console.log("PASS 복구 요청 시작. 대상 이메일:", email.value);

              const result = await startRestoreVerify(email.value);

              // 💡 디버깅 코드 추가: API 호출 성공 시 응답 확인
              console.log("PASS 복구 요청 API 응답:", result);

              if (result.success) {
                window.location.href = result.data.passAuthUrl;
                return;
              } else {
                alert(
                  result.error?.message ||
                    "복구 인증을 시작할 수 없습니다. (API 응답 실패)"
                );
              }
            } catch (err) {
              // 🚨 디버깅 코드 강화: 에러 객체 전체 출력
              console.error(
                "❌ 복구 요청 중 치명적인 오류 발생 (catch 블록):",
                err
              );

              const msg =
                err.response?.data?.error?.message ||
                err.response?.data?.message ||
                "복구 요청 중 서버 오류가 발생했습니다. (자세한 내용은 콘솔 확인)";
              alert(msg);
            }
          }

          return;
        }

        alert(error?.message || "로그인 실패");
      } catch (error) {
        const msg =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "서버 오류로 로그인에 실패했습니다.";
        alert(msg);
      }
    };
  }

  if (kakao) {
    kakao.onclick = () => {
      window.location.href = "/api/oauth/kakao/auth";
    };
  }

  if (google) {
    google.onclick = () => {
      window.location.href = "/api/oauth/google/auth";
    };
  }
}
