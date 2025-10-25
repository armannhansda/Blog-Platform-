"use client";

import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import the preview to avoid SSR issues
const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({
  content,
  className = "",
}: MarkdownViewerProps) {
  return (
    <div
      data-color-mode="light"
      className={`w-full prose dark:prose-invert max-w-none ${className}`}
    >
      <MarkdownPreview source={content} />
    </div>
  );
}
