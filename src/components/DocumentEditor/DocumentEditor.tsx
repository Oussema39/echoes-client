import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DocumentEditorProps } from "@/interface/IDocumentEditor";
import DocumentFooter from "./DocumentFooter";
import { formats, modules } from "./config";
import { countEditorWords } from "@/lib/utils";

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
      const length = countEditorWords(content);
      setWordCount(length);
    }
  };

  const handleChange = (content: string) => {
    onChange(content);
    updateWordCount(content);
  };

  useEffect(() => {
    updateWordCount(value);
  }, [value]);

  return (
    <>
      <div className="flex-grow overflow-hidden px-6 pb-12">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ""}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing something amazing..."
          className="h-full border-none focus:outline-none z-50"
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
