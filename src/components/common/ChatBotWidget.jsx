import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useChatBot } from "@/hooks/common/useChatBot";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useThemeStore } from "@/store/themeStore";
import { MessageCircle, ChevronUp, X, Bot, User, Send, Sparkles } from "lucide-react";

const themeColors = {
  classic: {
    primary: "bg-[#635bff] hover:bg-[#5851e8]",
    header: "bg-[#635bff]",
    focus: "focus-visible:ring-[#635bff]",
  },
  dark: {
    primary: "bg-[#635bff] hover:bg-[#5851e8]",
    header: "bg-[#635bff]",
    focus: "focus-visible:ring-[#635bff]",
  },
  pop: {
    primary: "bg-pink-500 hover:bg-pink-600 border border-gray-200",
    header: "bg-pink-500",
    focus: "focus-visible:ring-pink-500",
  },
  christmas: {
    primary: "bg-[#c41e3a] hover:bg-[#a51830]",
    header: "bg-[#c41e3a]",
    focus: "focus-visible:ring-[#c41e3a]",
  },
};

const QUICK_QUESTIONS = [
  "구독 상품은 어떻게 신청해?",
  "파티 참여는 어디서 해?",
  "결제 실패가 나면 어떻게 해?",
  "회원정보는 어디서 수정해?",
];

const ChatBotWidget = () => {
  const location = useLocation();
  const {
    isOpen,
    messages,
    input,
    loading,
    toggleChatBot,
    handleInputChange,
    handleKeyDown,
    sendMessage,
  } = useChatBot();
  const { theme } = useThemeStore();

  const bottomRef = useRef(null);
  const colors = themeColors[theme] || themeColors.classic;
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const toggleScrollTop = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleScrollTop);
    return () => window.removeEventListener("scroll", toggleScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdminRoute) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showScrollTop && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToTop}
            className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
                : theme === "pop"
                  ? "bg-white text-pink-500 border border-gray-200 hover:bg-pink-50"
                  : theme === "christmas"
                    ? "bg-white text-[#c41e3a] border border-gray-200 hover:bg-red-50"
                    : "bg-white text-[#635bff] border border-gray-200 hover:bg-indigo-50"
            }`}
            title="맨 위로"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {isOpen && (
        <Card className="absolute bottom-20 right-0 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-sm">
          <CardHeader className={`flex flex-row items-center justify-between px-4 py-3 ${colors.header} text-white`}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-semibold tracking-tight">MOA AI 도우미</CardTitle>
                <span className="text-[11px] text-white/80">구독, 파티, 결제, 계정 안내</span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-white hover:bg-white/15 hover:text-white"
              onClick={toggleChatBot}
              aria-label="챗봇 닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              {QUICK_QUESTIONS.map((question) => (
                <Button
                  key={question}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => sendMessage(question)}
                  className="h-8 rounded-full border-slate-200 bg-white px-3 text-[11px] text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  {question}
                </Button>
              ))}
            </div>

            <ScrollArea className="min-h-0 flex-1 bg-slate-50/60 px-4 py-3">
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex max-w-[82%] items-end gap-2">
                      {m.role === "bot" && (
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colors.header} text-white`}>
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={`whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                          m.role === "user"
                            ? `${colors.header} rounded-br-sm text-white`
                            : "rounded-bl-sm border border-slate-100 bg-white text-slate-900"
                        }`}
                      >
                        {m.content}
                      </div>

                      {m.role === "user" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                      답변을 준비하고 있어요...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  disabled={loading}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="무엇을 도와드릴까요?"
                  aria-label="챗봇 메시지 입력"
                  className={`h-10 border-slate-200 text-sm ${colors.focus} focus-visible:ring-offset-0`}
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={loading || !input.trim()}
                  onClick={() => sendMessage()}
                  className={`h-10 w-10 rounded-full ${colors.primary} text-white disabled:opacity-50`}
                  aria-label="메시지 보내기"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-[10px] leading-relaxed text-slate-400">
                MOA 이용 안내용 챗봇입니다. 개인정보, 카드번호, 비밀번호는 입력하지 마세요.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOpen && (
        <Button
          type="button"
          size="icon"
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl ${colors.primary}`}
          onClick={toggleChatBot}
          aria-label="MOA 챗봇 열기"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      )}
    </div>
  );
};

export default ChatBotWidget;
