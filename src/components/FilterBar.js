"use client";

import { useState } from "react";

export const PRICE_RANGES = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹5,000", value: "0-5000" },
  { label: "₹5,000 - ₹15,000", value: "5000-15000" },
  { label: "₹15,000 - ₹25,000", value: "15000-25000" },
  { label: "Above ₹25,000", value: "25000-Infinity" },
];

const VISIBLE_LIMIT = 6;

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  resultCount,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const canCollapse = categories.length > VISIBLE_LIMIT + 1;
  const visibleCategories =
    showAllCategories || !canCollapse
      ? categories
      : categories.slice(0, VISIBLE_LIMIT);
  const hiddenCount = categories.length - visibleCategories.length;

  return (
    <div id="categories" className="scroll-mt-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          {visibleCategories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {category}
              </button>
            );
          })}

          {canCollapse && (
            <button
              type="button"
              onClick={() => setShowAllCategories((v) => !v)}
              className="shrink-0 rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              {showAllCategories ? "Show less" : `+${hiddenCount} more`}
            </button>
          )}
        </div>

        <select
          value={priceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">{resultCount}</span>{" "}
        product{resultCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}
