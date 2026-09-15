"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StatusBadge from "./StatusBadge";
import { SAMPLE_POLICIES } from "@/lib/samplePolicies";

export default function DocumentUploadPanel({ onDocumentsChanged }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load documents");
      }
      setDocuments(data.documents);
      onDocumentsChanged?.(data.documents);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onDocumentsChanged]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDocuments();
  }, [loadDocuments]);

  const uploadFile = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/documents", { method: "POST", body: formData });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(
        res.status === 504 || res.status === 0
          ? "The upload took too long and timed out. Try a smaller file, or fewer pages."
          : "The server didn't return a valid response. Please try again."
      );
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Upload failed");
    }
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setIsUploading(true);
      setError("");

      try {
        await uploadFile(file);
        await loadDocuments();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile, loadDocuments]
  );

  const handleLoadSamplePolicies = useCallback(async () => {
    setLoadingSamples(true);
    setError("");

    try {
      const existingFilenames = new Set(documents.map((doc) => doc.filename));

      for (const policy of SAMPLE_POLICIES) {
        if (existingFilenames.has(policy.filename)) continue;

        const response = await fetch(policy.path);
        const blob = await response.blob();
        const file = new File([blob], policy.filename, { type: "text/plain" });
        await uploadFile(file);
      }

      await loadDocuments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSamples(false);
    }
  }, [documents, uploadFile, loadDocuments]);

  const handleDelete = useCallback(
    async (id) => {
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      try {
        const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to delete document");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        loadDocuments();
      }
    },
    [loadDocuments]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Product &amp; Policy Docs</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Upload a product manual or store policy (PDF, TXT, MD) for the assistant to
          answer from.
        </p>
      </div>

      <div className="px-5 py-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            "Processing document..."
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
                <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Upload a product manual or policy
            </>
          )}
        </button>

        <button
          type="button"
          disabled={loadingSamples}
          onClick={handleLoadSamplePolicies}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M13 2L3 14h7l-1 8 10-12h-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {loadingSamples ? "Loading sample policies..." : "Load sample store policies"}
        </button>

        <p className="mt-2 text-[11px] text-slate-400">
          Tip: On the shop page, click the download icon on any product card to get its
          info sheet, then upload it here.
        </p>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-slate-400">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{doc.filename}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={doc.status} />
                    {doc.status === "ready" && (
                      <span className="text-xs text-slate-400">{doc.chunkCount} chunks</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(doc._id)}
                  aria-label={`Delete ${doc.filename}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
