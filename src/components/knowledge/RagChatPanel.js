"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RagChatMessage from "./RagChatMessage";
import TypingIndicator from "@/components/chat/TypingIndicator";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function RagChatPanel({ hasReadyDocuments }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
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
      setInput("");
      setIsSending(true);

      try {
        const res = await fetch("/api/rag-chat", {
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
          { id: createId(), role: "assistant", text: data.reply, sources: data.sources },
        ]);
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
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending]
  );

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Support Assistant</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Answers are grounded only in the manuals &amp; policies you&apos;ve uploaded, with
          sources shown.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {hasReadyDocuments
              ? "Ask about a product's manual or a store policy — e.g. \"What's the warranty on this?\" or \"How long do I have to return it?\""
              : "Upload a product manual or policy doc on the left, then ask a question about it here."}
          </div>
        )}

        {messages.map((message) => (
          <RagChatMessage key={message.id} message={message} />
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
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex shrink-0 items-center gap-2 border-t border-slate-200 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
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
