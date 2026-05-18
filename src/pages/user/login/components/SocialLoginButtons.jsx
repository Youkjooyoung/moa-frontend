import kakaoLoginButton from "@/assets/kakao_login_medium_wide.png";
import { Button } from "@/components/ui/button";

function GoogleMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function SocialLoginButtons({ onKakao, onGoogle, loginLoading }) {
  const sharedSize = "h-12 w-full rounded-2xl";
  const baseClass =
    `${sharedSize} border text-[15px] font-bold normal-case tracking-normal shadow-sm transition disabled:opacity-60`;

  return (
    <div className="space-y-3">
      <button
        id="btnKakaoLogin"
        type="button"
        onClick={onKakao}
        disabled={loginLoading}
        className={`${sharedSize} block overflow-hidden border-0 bg-transparent p-0 shadow-sm transition hover:brightness-[0.98] disabled:opacity-60`}
        aria-label="카카오 로그인"
      >
        <img
          src={kakaoLoginButton}
          alt="카카오 로그인"
          className="h-full w-full object-fill"
          draggable="false"
        />
      </button>

      <Button
        id="btnGoogleLogin"
        type="button"
        onClick={onGoogle}
        className={`${baseClass} border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8fafd] hover:text-[#202124] dark:border-white/15 dark:bg-white dark:text-[#3c4043]`}
        disabled={loginLoading}
      >
        <GoogleMark />
        Google로 계속하기
      </Button>
    </div>
  );
}