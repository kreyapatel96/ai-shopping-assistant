"use client";

import { useState } from "react";
import DocumentUploadPanel from "@/components/knowledge/DocumentUploadPanel";
import RagChatPanel from "@/components/knowledge/RagChatPanel";

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState([]);
  const hasReadyDocuments = documents.some((doc) => doc.status === "ready");

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Product &amp; Policy Support Assistant
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a product manual or store policy (returns, warranty, shipping), then ask
          questions — answers are retrieved from that exact document and grounded with
          cited sources, never guessed.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="h-112 lg:h-144">
          <DocumentUploadPanel onDocumentsChanged={setDocuments} />
        </div>
        <div className="h-128 lg:h-144">
          <RagChatPanel hasReadyDocuments={hasReadyDocuments} />
        </div>
      </div>
    </div>
  );
}
