// Product context for the chatbot. This is the single place that turns raw
// `/api/products` data into what the assistant sees. Swapping in
// embeddings/vector search later only means changing this file.

const MAX_CATALOG_ITEMS = 200;

export async function fetchProductCatalog(origin) {
  const res = await fetch(`${origin}/api/products`, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load product catalog");
  }

  return data.products || [];
}

export function formatCatalogForPrompt(products) {
  return products
    .slice(0, MAX_CATALOG_ITEMS)
    .map((product) => {
      const id = product._id ?? "";
      const features = Array.isArray(product.features)
        ? product.features.join(", ")
        : "";
      return `${id} | ${product.name} | ${product.brand} | ${product.category} | ₹${product.price} | rating ${product.rating} | ${features}`;
    })
    .join("\n");
}

export function findProductsByIds(products, ids) {
  const byId = new Map(products.map((product) => [String(product._id), product]));
  return ids.map((id) => byId.get(String(id))).filter(Boolean);
}
