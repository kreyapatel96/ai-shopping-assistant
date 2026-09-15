"use client";

import Image from "next/image";
import StarRating from "./StarRating";
import { formatPrice } from "@/lib/format";
import { downloadProductInfoSheet } from "@/lib/productInfoSheet";

export default function ProductCard({ product, onAddToCart }) {
  const { name, brand, category, price, rating, image, features = [] } =
    product;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}

        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
          {brand}
        </p>

        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {name}
        </h3>

        <StarRating rating={rating} />

        {features.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(price)}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => downloadProductInfoSheet(product)}
              aria-label={`Download info sheet for ${name}`}
              title="Download info sheet"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path
                  d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
