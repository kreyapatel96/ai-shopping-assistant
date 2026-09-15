import { PDFParse } from "pdf-parse";
import * as pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";

// pdf-parse (via pdfjs-dist) resolves its worker with a runtime dynamic
// import path, which Next.js's server bundler breaks. Pre-registering the
// worker module globally makes pdfjs use it directly instead.
if (typeof globalThis.pdfjsWorker === "undefined") {
  globalThis.pdfjsWorker = pdfWorker;
}

const SUPPORTED_EXTENSIONS = ["pdf", "txt", "md"];

export function isSupportedFile(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

export async function parseDocument(buffer, filename) {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  // txt / md
  return buffer.toString("utf-8");
}
