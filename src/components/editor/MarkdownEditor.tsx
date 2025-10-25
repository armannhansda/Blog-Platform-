"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import the editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  initialValue?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  height?: number;
}

export function MarkdownEditor({
  initialValue = "",
  onChange,
  placeholder = "Write your content here...",
  height = 400,
}: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (val: string | undefined) => {
    setValue(val || "");
    onChange(val);
  };

  return (
    <div data-color-mode="light" className="w-full">
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        textareaProps={{
          placeholder: placeholder,
        }}
      />
    </div>
  );
}
