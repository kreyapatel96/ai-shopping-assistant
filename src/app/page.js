"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterBar, { PRICE_RANGES } from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import { LoadingGrid, ErrorState, EmptyState } from "@/components/ProductStates";
import PromoSection from "@/components/PromoSection";
import Footer from "@/components/Footer";

const ALL_CATEGORIES = "All";
const PAGE_SIZE = 12;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0].value);
  const [cartCount, setCartCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data.products || []);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }, []);

  // This client-only page fetches on mount; the setState calls inside
  // fetchProducts only run after the awaited fetch resolves, not
  // synchronously during this effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleRetry = useCallback(() => {
    setStatus("loading");
    setErrorMessage("");
    setVisibleCount(PAGE_SIZE);
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return [ALL_CATEGORIES, ...Array.from(unique).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const [min, max] = priceRange.split("-").map(Number);

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === ALL_CATEGORIES || product.category === activeCategory;

      const matchesPrice =
        priceRange === "all" ||
        (product.price >= min && product.price <= max);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, activeCategory, priceRange]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );
  const hasMore = visibleCount < filteredProducts.length;

  const handleAddToCart = useCallback(() => {
    setCartCount((count) => count + 1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handlePriceRangeChange = useCallback((range) => {
    setPriceRange(range);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((count) => count + PAGE_SIZE);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory(ALL_CATEGORIES);
    setPriceRange(PRICE_RANGES[0].value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cartCount={cartCount}
      />

      <main className="flex-1">
        <Hero />

        <section
          id="products"
          className="scroll-mt-20 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Explore Our Products
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Handpicked electronics across every category.
              </p>
            </div>
          </div>

          {status === "success" && (
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              resultCount={filteredProducts.length}
            />
          )}

          <div className="mt-6">
            {status === "loading" && <LoadingGrid />}

            {status === "error" && (
              <ErrorState message={errorMessage} onRetry={handleRetry} />
            )}

            {status === "success" &&
              (filteredProducts.length > 0 ? (
                <>
                  <ProductGrid
                    products={visibleProducts}
                    onAddToCart={handleAddToCart}
                  />

                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
                      >
                        Load More Products
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState onReset={handleResetFilters} />
              ))}
          </div>
        </section>

        <PromoSection />
      </main>

      <Footer />
    </div>
  );
}
