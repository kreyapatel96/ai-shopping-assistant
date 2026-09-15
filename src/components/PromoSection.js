const PERKS = [
  {
    title: "Free Shipping",
    description: "On all orders over ₹999, delivered to your doorstep.",
    icon: (
      <path
        d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Secure Payments",
    description: "Your transactions are protected end-to-end.",
    icon: (
      <path
        d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Easy Returns",
    description: "7-day hassle-free returns on eligible items.",
    icon: (
      <path
        d="M4 4v6h6M4.5 12a8 8 0 108-9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "AI Recommendations",
    description: "Personalized picks based on what you love.",
    icon: (
      <path
        d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1M12 8a4 4 0 100 8 4 4 0 000-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function PromoSection() {
  return (
    <section id="promo" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-10 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Season Sale — Up to 30% Off Electronics
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-indigo-100 sm:text-base">
            Grab the best deals on headphones, laptops, cameras and more
            before the offer ends.
          </p>
          <a
            href="#products"
            className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5"
          >
            Explore Deals
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5.5 w-5.5"
                >
                  {perk.icon}
                </svg>
              </div>
              <p className="font-semibold text-slate-800">{perk.title}</p>
              <p className="text-sm text-slate-500">{perk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
