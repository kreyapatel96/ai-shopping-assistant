const CHUNK_SIZE = 1000; // characters
const CHUNK_OVERLAP = 150; // characters

// Splits text into overlapping chunks so a fact split across a boundary
// still appears whole in at least one chunk.
export function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    chunks.push(normalized.slice(start, end).trim());

    if (end === normalized.length) break;
    start = end - overlap;
  }

  return chunks.filter(Boolean);
}
