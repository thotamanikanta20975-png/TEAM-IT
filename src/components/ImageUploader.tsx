"use client";

import { upload } from "@imagekit/next";
import Image from "next/image";
import { useRef, useState } from "react";

type ImageUploaderProps = {
  folder?: string;
  label?: string;
  onUploaded: (url: string, fileId: string) => void;
};

export function ImageUploader({ folder, label = "Add a photo", onUploaded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    try {
      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) throw new Error("Failed to get upload auth params");
      const authParams = await authRes.json();

      const result = await upload({
        file,
        fileName: file.name,
        folder,
        ...authParams,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      if (result.url && result.fileId) {
        setPreviewUrl(result.url);
        onUploaded(result.url, result.fileId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      {previewUrl ? (
        <div className="relative h-20 w-20 flex-none overflow-hidden rounded-[var(--radius)] border border-border">
          <Image src={previewUrl} alt="" fill sizes="80px" className="object-cover" />
        </div>
      ) : (
        <div className="flex h-20 w-20 flex-none items-center justify-center rounded-[var(--radius)] border border-dashed border-border text-text-dim">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="M21 15l-5-5-4 4-2-2-5 5" />
          </svg>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="w-fit cursor-pointer rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2 text-sm text-text hover:border-accent">
          {previewUrl ? "Replace photo" : label}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="sr-only"
          />
        </label>
        {progress !== null && (
          <span className="font-mono text-xs text-text-dim">Uploading… {progress}%</span>
        )}
        {error && (
          <span role="alert" className="text-xs text-accent-3">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
