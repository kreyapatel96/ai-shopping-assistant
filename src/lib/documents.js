import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

/**
 * @typedef {Object} DocumentRecord
 * @property {string} filename
 * @property {Date} uploadedAt
 * @property {"processing"|"ready"|"failed"} status
 * @property {number} chunkCount
 * @property {string} [errorMessage]
 */

async function getCollection() {
  const client = await clientPromise;
  return client.db("ai-shopping-assistant").collection("documents");
}

export async function createDocument(filename) {
  const collection = await getCollection();
  const doc = {
    filename,
    uploadedAt: new Date(),
    status: "processing",
    chunkCount: 0,
  };
  const result = await collection.insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function markDocumentReady(id, chunkCount) {
  const collection = await getCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "ready", chunkCount } }
  );
}

export async function markDocumentFailed(id, errorMessage) {
  const collection = await getCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "failed", errorMessage } }
  );
}

export async function listDocuments() {
  const collection = await getCollection();
  return collection.find({}).sort({ uploadedAt: -1 }).toArray();
}

export async function getDocument(id) {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function deleteDocument(id) {
  const collection = await getCollection();
  await collection.deleteOne({ _id: new ObjectId(id) });
}
