import { generateRagAnswer } from "@/lib/gemini";
import { retrieveRelevantChunks } from "@/lib/retrieval";
import { describeAssistantError } from "@/lib/apiErrors";

export const maxDuration = 30;

function formatContext(chunks) {
  return chunks
    .map(
      (chunk, i) =>
        `[${i + 1}] (from "${chunk.documentFilename}")\n${chunk.text}`
    )
    .join("\n\n");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const question = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    if (!question) {
      return Response.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    const relevantChunks = await retrieveRelevantChunks(question);

    if (relevantChunks.length === 0) {
      return Response.json({
        success: true,
        reply:
          "I couldn't find anything relevant in the uploaded documents to answer that. Try uploading a document first, or rephrase your question.",
        sources: [],
      });
    }

    const result = await generateRagAnswer({
      question,
      history,
      contextText: formatContext(relevantChunks),
    });

    const sources = result.hasAnswer
      ? relevantChunks.map((chunk) => ({
          documentFilename: chunk.documentFilename,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          score: Number(chunk.score.toFixed(3)),
        }))
      : [];

    return Response.json({
      success: true,
      reply: result.answer,
      sources,
    });
  } catch (error) {
    console.error("RAG chat error:", error);
    const { status, message } = describeAssistantError(error);

    return Response.json({ success: false, message }, { status });
  }
}
