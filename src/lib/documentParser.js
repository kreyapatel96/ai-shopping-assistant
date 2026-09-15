const SUPPORTED_EXTENSIONS = ["pdf", "txt", "md"];

export function isSupportedFile(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

// Loaded lazily so non-PDF requests never pull in pdf-parse's dependencies.
async function parsePdf(buffer) {
  const [{ PDFParse }, pdfWorker] = await Promise.all([
    import("pdf-parse"),
    import("pdfjs-dist/legacy/build/pdf.worker.mjs"),
  ]);

  // Avoids pdfjs-dist's dynamic worker import, which serverless bundlers break.
  if (typeof globalThis.pdfjsWorker === "undefined") {
    globalThis.pdfjsWorker = pdfWorker;
  }

  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

export async function parseDocument(buffer, filename) {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return parsePdf(buffer);
  }

  return buffer.toString("utf-8");
}
