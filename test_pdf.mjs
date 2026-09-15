import * as pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";
console.log("has WorkerMessageHandler:", !!pdfWorker.WorkerMessageHandler);

globalThis.pdfjsWorker = pdfWorker;

import { PDFParse } from "pdf-parse";
import { readFile } from "fs/promises";

const buffer = await readFile("/tmp/test_doc.pdf");
const parser = new PDFParse({ data: buffer });
const result = await parser.getText();
await parser.destroy();
console.log("TEXT:", result.text.slice(0, 200));
