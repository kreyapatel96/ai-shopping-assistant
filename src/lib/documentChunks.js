import clientPromise from "@/lib/mongodb";

/**
 * @typedef {Object} ChunkRecord
 * @property {string} documentId
 * @property {string} documentFilename
 * @property {number} chunkIndex
 * @property {string} text
 * @property {number[]} embedding
 * @property {Date} createdAt
 */

async function getCollection() {
  const client = await clientPromise;
  return client.db("ai-shopping-assistant").collection("document_chunks");
}

export async function insertChunks(chunks) {
  if (chunks.length === 0) return;
  const collection = await getCollection();
  await collection.insertMany(
    chunks.map((chunk) => ({ ...chunk, createdAt: new Date() }))
  );
}

export async function getAllChunks() {
  const collection = await getCollection();
  return collection
    .find({}, { projection: { embedding: 1, text: 1, documentId: 1, documentFilename: 1, chunkIndex: 1 } })
    .toArray();
}

export async function deleteChunksByDocumentId(documentId) {
  const collection = await getCollection();
  await collection.deleteMany({ documentId: String(documentId) });
}
