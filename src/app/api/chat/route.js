import { generateAssistantReply } from "@/lib/gemini";
import {
  fetchProductCatalog,
  formatCatalogForPrompt,
  findProductsByIds,
} from "@/lib/productCatalog";
import { describeAssistantError } from "@/lib/apiErrors";

export const maxDuration = 30;

export async function POST(request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    if (!message) {
      return Response.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    const origin = new URL(request.url).origin;
    const products = await fetchProductCatalog(origin);
    const catalogText = formatCatalogForPrompt(products);

    const result = await generateAssistantReply({ message, history, catalogText });
    const matchedProducts = findProductsByIds(products, result.productIds);

    return Response.json({
      success: true,
      reply: result.reply,
      inScope: result.inScope,
      products: matchedProducts,
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const { status, message } = describeAssistantError(error);

    return Response.json({ success: false, message }, { status });
  }
}
