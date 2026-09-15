import { deleteDocument } from "@/lib/documents";
import { deleteChunksByDocumentId } from "@/lib/documentChunks";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteChunksByDocumentId(id);
    await deleteDocument(id);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return Response.json(
      { success: false, message: "Failed to delete document" },
      { status: 500 }
    );
  }
}
