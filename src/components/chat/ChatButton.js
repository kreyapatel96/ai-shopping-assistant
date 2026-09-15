export default function ChatButton({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close chat" : "Open AI shopping assistant"}
      className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white shadow-xl shadow-indigo-300/50 transition hover:scale-105 active:scale-95"
    >
      {open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
          <path
            d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.8-.9L3 20l1.02-4.4A8.5 8.5 0 1121 11.5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
