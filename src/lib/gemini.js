import { GoogleGenAI, Type } from "@google/genai";

const MODEL = "gemini-3.6-flash";

let client = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    inScope: { type: Type.BOOLEAN },
    productIds: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["reply", "inScope", "productIds", "suggestions"],
};

function buildSystemInstruction(catalogText) {
  return `You are "ShopAI Assistant", the AI shopping assistant embedded in the ShopAI electronics store website.

SCOPE:
- Only answer questions about the products in the CATALOG below, shopping guidance (recommendations, comparisons, prices, ratings, features, categories, availability), or how to use this shopping website.
- If the user asks anything unrelated to shopping on this site (general knowledge, coding, personal advice, other topics), politely decline in "reply", explain you can only help with shopping on this site, set "inScope" to false, and leave "productIds" empty.

RULES:
- Never invent products, prices, brands, or specs. Only reference items that appear in CATALOG, using their exact "id".
- When you recommend or directly discuss specific catalog products, list their ids in "productIds" (at most 4, most relevant first). Otherwise leave it an empty array.
- Keep "reply" conversational, concise (2-4 sentences), and helpful.
- Always include 2-4 short natural follow-up questions in "suggestions" the user could tap next, relevant to the current conversation. Avoid repeating earlier suggestions.
- Respond ONLY with a single JSON object matching the required schema. No markdown fences, no commentary outside the JSON.

CATALOG (id | name | brand | category | price | rating | features):
${catalogText}`;
}

function toHistoryContents(history) {
  return history
    .filter((turn) => turn && turn.content)
    .map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: String(turn.content).slice(0, 2000) }],
    }));
}

const RAG_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    answer: { type: Type.STRING },
    hasAnswer: { type: Type.BOOLEAN },
  },
  required: ["answer", "hasAnswer"],
};

function buildRagSystemInstruction(contextText) {
  return `You are a document Q&A assistant. Answer the user's question using ONLY the CONTEXT excerpts below, which were retrieved from uploaded documents.

RULES:
- Do not use outside knowledge. If the context does not contain enough information to answer, say so plainly in "answer" and set "hasAnswer" to false.
- Keep "answer" concise and directly grounded in the context.
- Respond ONLY with a single JSON object matching the required schema. No markdown fences, no commentary outside the JSON.

CONTEXT:
${contextText}`;
}

export async function generateRagAnswer({ question, history = [], contextText }) {
  const ai = getClient();

  const contents = [
    ...toHistoryContents(history),
    { role: "user", parts: [{ text: question }] },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: buildRagSystemInstruction(contextText),
      responseMimeType: "application/json",
      responseSchema: RAG_RESPONSE_SCHEMA,
      temperature: 0.2,
    },
  });

  const raw = response.text?.trim();
  if (!raw) {
    throw new Error("Empty response from the assistant");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse assistant response");
  }

  return {
    answer: typeof parsed.answer === "string" ? parsed.answer : "",
    hasAnswer: parsed.hasAnswer !== false,
  };
}

export async function generateAssistantReply({ message, history = [], catalogText }) {
  const ai = getClient();

  const contents = [
    ...toHistoryContents(history),
    { role: "user", parts: [{ text: message }] },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: buildSystemInstruction(catalogText),
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  });

  const raw = response.text?.trim();
  if (!raw) {
    throw new Error("Empty response from the assistant");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse assistant response");
  }

  return {
    reply: typeof parsed.reply === "string" ? parsed.reply : "",
    inScope: parsed.inScope !== false,
    productIds: Array.isArray(parsed.productIds) ? parsed.productIds.map(String) : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : [],
  };
}
