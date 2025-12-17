import { useThemeStore } from "@/store/themeStore";

const authThemeStyles = {
  default: {
    cardClass: 'bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    inputClass: 'w-full border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] p-3 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus:outline-none',
    btnClass: 'w-full bg-white text-black border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] font-black py-3 text-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
    labelColor: 'text-slate-900',
  },
  christmas: {
    cardClass: 'bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(196,30,58,0.15)]',
    inputClass: 'w-full border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(196,30,58,0.08)] p-3 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus:outline-none focus:ring-[#c41e3a] focus:border-[#c41e3a]',
    btnClass: 'w-full bg-[#c41e3a] text-white border border-[#c41e3a] rounded-2xl shadow-[4px_4px_12px_rgba(196,30,58,0.15)] font-black py-3 text-lg hover:bg-red-700 active:translate-x-[2px] active:translate-y-[2px]',
    labelColor: 'text-slate-900',
  },
};

export function ResetPwdForm() {
  const { theme } = useThemeStore();
  const themeStyle = authThemeStyles[theme] || authThemeStyles.pop;

  return (
    <div
      id="resetFormArea"
      className={`${themeStyle.cardClass} space-y-4 pt-4 hidden p-5`}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="space-y-1">
          <label className={`font-black text-sm ${themeStyle.labelColor}`}>새 비밀번호</label>
          <input
            id="resetNewPassword"
            type="password"
            autoComplete="new-password"
            className={themeStyle.inputClass}
            placeholder="8~20자/ 영문·숫자·특수문자 조합"
          />
        </div>

        <div className="space-y-1">
          <label className={`font-black text-sm ${themeStyle.labelColor}`}>
            새 비밀번호 확인
          </label>
          <input
            id="resetNewPasswordCheck"
            type="password"
            autoComplete="new-password"
            className={themeStyle.inputClass}
            placeholder="같은 비밀번호를 입력해 주세요"
          />
        </div>

        <button id="btnResetPwd" type="submit" className={themeStyle.btnClass}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
