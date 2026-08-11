import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bot, ChevronUp, MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBot } from "@/hooks/common/useChatBot";
import { useI18n } from "@/hooks/useI18n";

const QUICK_QUESTIONS = [
  "chatbot.quick.subscription",
  "chatbot.quick.party",
  "chatbot.quick.payment",
  "chatbot.quick.settlement",
];

export default function ChatBotWidget() {
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
  const { t } = useI18n();

  const bottomRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const toggleScrollTop = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    return () => window.removeEventListener("scroll", toggleScrollTop);
  }, []);

  if (isAdminRoute) return null;

  return (
    <div className="fixed bottom-[env(safe-area-inset-bottom)] right-6 z-50 flex flex-col items-end gap-3">
      {showScrollTop && !isOpen && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] text-[var(--theme-text-muted)] shadow-[var(--theme-shadow)] transition hover:-translate-y-0.5 hover:text-[var(--theme-primary)]"
          aria-label={t("chatbot.scrollTop")}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {isOpen && (
        <section className="absolute bottom-0 right-0 flex h-[min(560px,calc(100vh-2rem))] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.75rem] border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] shadow-[var(--theme-shadow)]">
          <header className="flex items-center justify-between border-b border-[var(--theme-border-light)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--theme-text)]">{t("chatbot.title")}</h2>
                <p className="text-xs font-medium text-[var(--theme-text-muted)]">
                  {t("chatbot.subtitle")}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)]"
              onClick={toggleChatBot}
              aria-label={t("chatbot.close")}
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="flex flex-wrap gap-2 border-b border-[var(--theme-border-light)] bg-[var(--theme-surface-muted)] px-4 py-3">
            {QUICK_QUESTIONS.map((questionKey) => (
              <button
                key={questionKey}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(t(questionKey))}
                className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg-card)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-text-muted)] transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] disabled:opacity-50"
              >
                {t(questionKey)}
              </button>
            ))}
          </div>

          <ScrollArea className="min-h-0 flex-1 bg-[var(--theme-bg)] px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm font-medium leading-6 shadow-[var(--theme-shadow-soft)] ${
                      message.role === "user"
                        ? "rounded-br-md bg-[var(--theme-primary)] text-white"
                        : "rounded-bl-md border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] text-[var(--theme-text)]"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] px-4 py-3 text-sm font-medium text-[var(--theme-text-muted)] shadow-[var(--theme-shadow-soft)]">
                    {t("chatbot.loading")}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <footer className="border-t border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                disabled={loading}
                onChange={(event) => handleInputChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.placeholder")}
                aria-label={t("chatbot.placeholder")}
                className="h-11 rounded-2xl border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 text-sm font-medium text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus-visible:ring-[var(--theme-focus-ring)]"
              />
              <Button
                type="button"
                size="icon"
                disabled={loading || !input.trim()}
                onClick={() => sendMessage()}
                className="h-11 w-11 rounded-2xl bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)] disabled:opacity-50"
                aria-label={t("chatbot.send")}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs font-medium leading-5 text-[var(--theme-text-muted)]">
              {t("chatbot.privacy")}
            </p>
          </footer>
        </section>
      )}

      {!isOpen && (
        <Button
          type="button"
          size="icon"
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white shadow-[var(--theme-shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--theme-primary-hover)]"
          onClick={toggleChatBot}
          aria-label={t("chatbot.open")}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
