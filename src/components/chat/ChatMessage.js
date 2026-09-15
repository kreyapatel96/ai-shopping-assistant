import ProductMiniCard from "./ProductMiniCard";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

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

        {message.products && message.products.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.products.map((product) => (
              <ProductMiniCard key={product._id ?? product.name} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
