import { useThemeStore } from "@/store/themeStore";

const authThemeStyles = {
  default: {
    cardClass: 'bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    btnClass: 'bg-white text-black px-12 py-3 rounded-2xl text-lg font-black border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    textColor: 'text-gray-700',
  },
  christmas: {
    cardClass: 'bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
    btnClass: 'bg-[#c41e3a] text-white px-12 py-3 rounded-2xl text-lg font-black border border-[#c41e3a] shadow-[4px_4px_12px_rgba(196,30,58,0.15)] hover:bg-red-700 active:translate-x-[2px] active:translate-y-[2px]',
    textColor: 'text-gray-700',
  },
};

export function ResetPwdGuide() {
  const { theme } = useThemeStore();
  const themeStyle = authThemeStyles[theme] || authThemeStyles.pop;

  return (
    <div className={`${themeStyle.cardClass} space-y-4 p-5`}>
      <p id="resetGuide" className={`${themeStyle.textColor} text-center leading-relaxed`}>
        PASS 버튼을 눌러 본인 인증을 진행해주세요
        <br />
        인증이 완료되면 비밀번호를 입력하실 수 있습니다.
      </p>

      <div className="flex justify-center">
        <button id="btnResetPassAuth" type="button" className={themeStyle.btnClass}>
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
