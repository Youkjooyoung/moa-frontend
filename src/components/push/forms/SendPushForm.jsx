import { Send, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const sendFormThemeStyles = {
    default: {
        // Neo/Pop 스타일 - 핑크, 시안 계열 (깔끔한 흰색 배경)
        buttonBg: 'bg-pink-500 hover:bg-pink-600',
        warningBg: 'bg-cyan-50 border-cyan-200',
        warningText: 'text-cyan-700',
        sendAllButton: 'border-pink-300 text-pink-600 hover:bg-pink-50 hover:text-pink-700',
        titleText: 'text-pink-600',
        labelText: 'text-slate-700',
        inputFocus: 'focus:ring-pink-500 focus:border-pink-500',
        headerBg: 'bg-white',
    },
    christmas: {
        buttonBg: 'bg-[#c41e3a] hover:bg-red-700',
        warningBg: 'bg-green-50 border-green-200',
        warningText: 'text-green-800',
        sendAllButton: 'border-[#c41e3a] text-[#c41e3a] hover:bg-red-50 hover:text-red-700',
        titleText: 'text-[#c41e3a]',
        labelText: 'text-[#c41e3a]',
        inputFocus: 'focus:ring-[#c41e3a] focus:border-[#c41e3a]',
        headerBg: 'bg-red-50',
    },
};

const SendPushForm = ({
    sendForm = { title: "", content: "" },
    selectedCount = 0,
    isLoading = false,
    onFormChange,
    onSend,
    onSendToAll,
}) => {
    const { theme } = useThemeStore();
    const themeStyle = sendFormThemeStyles[theme] || sendFormThemeStyles.pop;

    const handleSend = () => {
        if (onSend && typeof onSend === "function") {
            onSend();
        }
    };

    const handleSendToAll = () => {
        if (onSendToAll && typeof onSendToAll === "function") {
            onSendToAll();
        }
    };

    return (
        <div className={`h-full flex flex-col p-4 ${themeStyle.headerBg}`}>
            <div className="mb-3">
                <p className={`text-sm font-medium ${themeStyle.titleText}`}>메시지 작성</p>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <label className={`text-sm font-medium ${themeStyle.labelText} mb-1.5 block`}>
                        제목
                    </label>
                    <Input
                        value={sendForm.title || ""}
                        onChange={(e) => onFormChange && onFormChange("title", e.target.value)}
                        placeholder="푸시 알림 제목"
                        className={themeStyle.inputFocus}
                    />
                </div>

                <div>
                    <label className={`text-sm font-medium ${themeStyle.labelText} mb-1.5 block`}>
                        내용
                    </label>
                    <Textarea
                        value={sendForm.content || ""}
                        onChange={(e) => onFormChange && onFormChange("content", e.target.value)}
                        placeholder="푸시 알림 내용을 입력하세요"
                        rows={4}
                        className={themeStyle.inputFocus}
                    />
                </div>

                <div className={`p-3 rounded-lg border ${themeStyle.warningBg}`}>
                    <p className={`text-xs ${themeStyle.warningText}`}>
                        💡 선택한 모든 수신자에게 동일한 메시지가 발송됩니다.
                    </p>
                </div>

                <div className="space-y-2 pt-2">
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || selectedCount === 0}
                        className={`w-full ${themeStyle.buttonBg}`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 mr-1" />
                        )}
                        {selectedCount}명에게 발송
                    </Button>

                    <Button
                        onClick={handleSendToAll}
                        disabled={isLoading || !sendForm.title || !sendForm.content}
                        variant="outline"
                        className={`w-full ${themeStyle.sendAllButton}`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Users className="w-4 h-4 mr-1" />
                        )}
                        전체 발송 (관리자 제외)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SendPushForm;