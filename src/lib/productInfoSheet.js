// Generates a downloadable text "info sheet" for a product from data that
// already exists on it — no new product fields or API changes required.
export function buildProductInfoSheetText(product) {
  const lines = [
    product.name,
    "=".repeat(product.name.length),
    "",
    `Brand: ${product.brand}`,
    `Category: ${product.category}`,
    `Price: ₹${product.price}`,
    `Rating: ${product.rating} / 5`,
    "",
    "Description:",
    product.description || "No description available.",
  ];

  if (product.features?.length) {
    lines.push("", "Key Features:", ...product.features.map((f) => `- ${f}`));
  }

  return lines.join("\n");
}

export function downloadProductInfoSheet(product) {
  const text = buildProductInfoSheetText(product);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const filename = `${product.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-info.txt`;
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
