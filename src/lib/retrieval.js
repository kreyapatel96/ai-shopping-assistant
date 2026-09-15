import { getAllChunks } from "@/lib/documentChunks";
import { embedText, cosineSimilarity } from "@/lib/embeddings";

const TOP_K = 5;
// A sanity floor only — for this embedding model, cosine similarity between
// short texts doesn't cleanly separate "vague but relevant" from "genuinely
// unrelated" (both can land around 0.4-0.47). Real relevance judgment is
// left to the generation step's own "hasAnswer" check, which reads the
// actual chunk text instead of a single distance number.
const MIN_SIMILARITY = 0.2;

// The actual "R" in RAG: embed the question, score it against every stored
// chunk's embedding, and keep only the closest matches.
export async function retrieveRelevantChunks(question) {
  const [questionEmbedding, chunks] = await Promise.all([
    embedText(question),
    getAllChunks(),
  ]);

  return chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))
    .filter((chunk) => chunk.score >= MIN_SIMILARITY)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);
}
