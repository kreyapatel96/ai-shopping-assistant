export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.5), transparent 40%), radial-gradient(circle at 80% 30%, rgba(217,70,239,0.4), transparent 45%), radial-gradient(circle at 50% 90%, rgba(56,189,248,0.35), transparent 45%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Powered by AI recommendations
        </span>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Shop smarter with your{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
            AI Shopping Assistant
          </span>
        </h1>

        <p className="max-w-xl text-base text-slate-300 sm:text-lg">
          Discover top-rated headphones, laptops, cameras, and more —
          curated, compared, and ready for you to explore in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#products"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Shop All Products
          </a>
          <a
            href="#categories"
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Browse Categories
          </a>
        </div>

        <div className="mt-4 grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8 text-white">
          <div>
            <p className="text-2xl font-bold sm:text-3xl">90+</p>
            <p className="text-xs text-slate-400 sm:text-sm">Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold sm:text-3xl">9</p>
            <p className="text-xs text-slate-400 sm:text-sm">Categories</p>
          </div>
          <div>
            <p className="text-2xl font-bold sm:text-3xl">4.6★</p>
            <p className="text-xs text-slate-400 sm:text-sm">Avg. rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
