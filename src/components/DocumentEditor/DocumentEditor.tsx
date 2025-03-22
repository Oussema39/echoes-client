import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DocumentEditorProps } from "@/interface/IDocumentEditor";
import DocumentFooter from "./DocumentFooter";
import { formats, modules } from "./config";

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  hideFooter = false,
  value,
  onChange,
  ...rest
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [promptsLeft] = useState(Number.POSITIVE_INFINITY);
  const quillRef = useRef<ReactQuill>(null);

  const updateWordCount = (content: string) => {
    if (!content) {
      setWordCount(0);
      return;
    }
    if (content) {
      const text = content.replace(/<[^>]*>/g, " ");
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  };

  const handleChange = (content: string) => {
    onChange(content);
    updateWordCount(content);
  };

  return (
    <>
      <div className="flex-grow overflow-auto px-6">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ""}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing something amazing..."
          className="h-full border-none focus:outline-none"
          {...rest}
        />
      </div>

      {!hideFooter ? (
        <DocumentFooter wordCount={wordCount} promptsLeft={promptsLeft} />
      ) : null}
    </>
  );
};

export default DocumentEditor;
