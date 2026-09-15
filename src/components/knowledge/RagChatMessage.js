export default function RagChatMessage({ message }) {
  const isUser = message.role === "user";
  const sourceFilenames = message.sources?.length
    ? [...new Set(message.sources.map((s) => s.documentFilename))]
    : [];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : message.isError
            ? "rounded-bl-sm border border-red-200 bg-red-50 text-red-700"
            : "rounded-bl-sm border border-slate-200 bg-white text-slate-700"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {sourceFilenames.length > 0 && (
          <p className="mt-2 truncate text-[11px] text-slate-400">
            📄 {sourceFilenames.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
