"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";
import { STARTER_QUESTIONS, WELCOME_MESSAGE } from "@/lib/chatStarters";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isSending]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMessage = { id: createId(), role: "user", text: trimmed };
      const historyForRequest = [...messages, userMessage]
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.text }));

      setMessages((prev) => [...prev, userMessage]);
      setSuggestions([]);
      setInput("");
      setIsSending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history: historyForRequest }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Something went wrong. Please try again.");
        }

        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            text: data.reply,
            products: data.products,
          },
        ]);
        setSuggestions(data.suggestions || []);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            text: error.message || "Something went wrong. Please try again.",
            isError: true,
            retryOf: trimmed,
          },
        ]);
        setSuggestions([]);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending]
  );

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
              <path d="M12 2a4 4 0 00-4 4v1H7a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3v-6a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1zM9 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">ShopAI Assistant</p>
            <p className="text-xs text-slate-400">Ask about products &amp; deals</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <ChatMessage message={{ role: "assistant", text: WELCOME_MESSAGE }} />
            <SuggestionChips items={STARTER_QUESTIONS} onSelect={sendMessage} disabled={isSending} />
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isSending && <TypingIndicator />}

        {!isSending && lastMessage?.isError && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => sendMessage(lastMessage.retryOf)}
              className="rounded-full border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        {!isSending && messages.length > 0 && !lastMessage?.isError && suggestions.length > 0 && (
          <SuggestionChips items={suggestions} onSelect={sendMessage} disabled={isSending} />
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product..."
          disabled={isSending}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
            <path d="M4 12l16-8-6 8 6 8-16-8z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
