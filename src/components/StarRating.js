export default function StarRating({ rating = 0, className = "" }) {
  const rounded = Math.round(Number(rating) * 2) / 2;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;

          return (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.62.99-5.8-4.21-4.1 5.82-.85z"
                fill={
                  filled ? "currentColor" : half ? `url(#half-${i})` : "none"
                }
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-xs font-medium text-slate-500">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
}
