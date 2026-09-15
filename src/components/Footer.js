const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: ["All Products", "Headphones", "Laptops", "Smartphones", "Cameras"],
  },
  {
    title: "Support",
    links: ["Help Center", "Track Order", "Returns & Refunds", "Contact Us"],
  },
  {
    title: "Company",
    links: ["About ShopAI", "Careers", "Privacy Policy", "Terms of Service"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.7 4h11.4M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Shop<span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Your AI-powered shopping companion — smarter search, better
              recommendations, and a beautifully simple way to browse.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-white">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 transition hover:text-indigo-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ShopAI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-indigo-400">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-400">
              Terms
            </a>
            <a href="#" className="hover:text-indigo-400">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
