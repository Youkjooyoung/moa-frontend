// src/hooks/common/useChatBot.js
import { useCallback } from "react";
import { sendChatMessage } from "@/api/chatApi";
import { useChatBotStore } from "@/store/chatBotStore";

const createMessage = (role, content) => {
  const now = new Date().toISOString();
  const id = `${role}-${now}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, role, content, createdAt: now };
};

export const useChatBot = () => {
  const isOpen = useChatBotStore((state) => state.isOpen);
  const messages = useChatBotStore((state) => state.messages);
  const input = useChatBotStore((state) => state.input);
  const loading = useChatBotStore((state) => state.loading);

  const toggleOpenStore = useChatBotStore((state) => state.toggleOpen);
  const setInput = useChatBotStore((state) => state.setInput);
  const pushMessage = useChatBotStore((state) => state.pushMessage);
  const setLoading = useChatBotStore((state) => state.setLoading);

  const toggleChatBot = useCallback(() => {
    const hasMessages = messages.length > 0;
    toggleOpenStore();

    if (!isOpen && !hasMessages) {
      pushMessage(
        createMessage(
          "bot",
          "안녕하세요. MOA 이용을 도와드릴게요. 구독 상품, 파티 찾기, 결제/정산, 계정 문제를 물어보세요."
        )
      );
    }
  }, [isOpen, messages.length, toggleOpenStore, pushMessage]);

  const handleInputChange = useCallback(
    (value) => {
      setInput(value);
    },
    [setInput]
  );

  const sendMessage = useCallback(
    async (forcedMessage) => {
      const text = forcedMessage ?? input.trim();
      if (!text || loading) return;

      pushMessage(createMessage("user", text));

      if (!forcedMessage) setInput("");

      setLoading(true);

      try {
        const chat = await sendChatMessage(text);
        const reply =
          chat?.reply ||
          "답변을 찾지 못했습니다. 구독, 파티, 결제, 계정 중 어떤 문제인지 조금 더 자세히 적어주세요.";

        pushMessage(createMessage("bot", reply));
      } catch (e) {
        pushMessage(
          createMessage(
            "bot",
            "현재 챗봇 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요."
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, pushMessage, setInput, setLoading]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      event.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  return {
    isOpen,
    messages,
    input,
    loading,
    toggleChatBot,
    handleInputChange,
    handleKeyDown,
    sendMessage,
  };
};
