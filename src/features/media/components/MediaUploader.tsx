"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";

interface MediaUploaderProps {
  uploading: boolean;
  progress: number;
  uploadLabel: string;
  onUpload: (files: File[]) => void | Promise<void>;
}

export function MediaUploader({ uploading, progress, uploadLabel, onUpload }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => inputRef.current?.click();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    await onUpload(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
        multiple
      />
      <Button onClick={triggerUpload} disabled={uploading} loading={uploading} size="md">
        {uploading ? "Uploading…" : "Upload files"}
      </Button>
      {uploading && (
        <div
          className="w-full bg-surface-2 border border-border rounded-full h-2.5 overflow-hidden mt-3"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuetext={`${progress}%${uploadLabel ? ` — ${uploadLabel}` : ""}`}
          aria-label="Upload progress"
        >
          <div
            className="bg-accent h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}
