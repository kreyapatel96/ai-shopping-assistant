import { chunkText } from "@/lib/chunking";
import {
  createDocument,
  listDocuments,
  markDocumentFailed,
  markDocumentReady,
} from "@/lib/documents";
import { insertChunks } from "@/lib/documentChunks";
import { isSupportedFile, parseDocument } from "@/lib/documentParser";
import { embedTexts } from "@/lib/embeddings";
import { describeAssistantError } from "@/lib/apiErrors";

// Parsing + chunking + embedding a document can take longer than the
// platform's default serverless timeout (e.g. Vercel's 10s default).
export const maxDuration = 60;

export async function GET() {
  try {
    const documents = await listDocuments();
    return Response.json({ success: true, documents });
  } catch (error) {
    console.error("List documents error:", error);
    return Response.json(
      { success: false, message: "Failed to load documents" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json(
      { success: false, message: "No file provided" },
      { status: 400 }
    );
  }

  if (!isSupportedFile(file.name)) {
    return Response.json(
      { success: false, message: "Only PDF, TXT, and MD files are supported" },
      { status: 400 }
    );
  }

  const document = await createDocument(file.name);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseDocument(buffer, file.name);
    const chunks = chunkText(text);

    if (chunks.length === 0) {
      throw new Error("No readable text found in this file");
    }

    const embeddings = await embedTexts(chunks);

    await insertChunks(
      chunks.map((chunkContent, index) => ({
        documentId: String(document._id),
        documentFilename: file.name,
        chunkIndex: index,
        text: chunkContent,
        embedding: embeddings[index],
      }))
    );

    await markDocumentReady(document._id, chunks.length);

    return Response.json({
      success: true,
      document: { ...document, status: "ready", chunkCount: chunks.length },
    });
  } catch (error) {
    console.error("Document processing error:", error);
    await markDocumentFailed(document._id, error.message);

    if (error?.status === 429) {
      const { status, message } = describeAssistantError(error);
      return Response.json({ success: false, message }, { status });
    }

    return Response.json(
      { success: false, message: `Failed to process "${file.name}": ${error.message}` },
      { status: 500 }
    );
  }
}
