import { useState, useEffect, forwardRef } from "react";
import "react-quill/dist/quill.snow.css";
import { DocumentEditorProps } from "@/interface/IDocumentEditor";
import DocumentFooter from "./DocumentFooter";
import { countEditorWords, getEstimatedReadTime } from "@/lib/utils";
import Loader from "../ui/loader";
import LexicalEditor from "../LexicalEditor";

const DocumentEditor = forwardRef(
  (
    {
      hideFooter = false,
      value,
      onChange,
      loading,
      ...rest
    }: DocumentEditorProps,
    ref
  ) => {
    const [wordCount, setWordCount] = useState(0);
    const [readMins, setReadMins] = useState(0);
    const [promptsLeft] = useState(Number.POSITIVE_INFINITY);

    const updateContentStats = (content: string) => {
      if (!content) {
        setWordCount(0);
        return;
      }
      const length = countEditorWords(content);
      const readMins = getEstimatedReadTime(length);
      setReadMins(readMins);
      setWordCount(length);
    };

    const handleChange = (content: string) => {
      onChange(content);
      updateContentStats(content);
    };

    useEffect(() => {
      updateContentStats(value);
    }, [value]);

    return (
      <>
        <div className="flex-grow overflow-hidden px-6 pb-12 relative">
          {loading && (
            <div className="inset-0 flex items-center justify-center absolute backdrop-blur-[4px] z-50">
              <Loader />
            </div>
          )}
          {/* <ReactQuill
            ref={ref as MutableRefObject<ReactQuill>}
            theme="snow"
            value={value || ""}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing something amazing..."
            className="h-full border-none focus:outline-none z-50 selection:bg-primary/15"
            {...rest}
          /> */}
          <LexicalEditor />
        </div>

        {!hideFooter && (
          <DocumentFooter
            wordCount={wordCount}
            readMins={readMins}
            promptsLeft={promptsLeft}
          />
        )}
      </>
    );
  }
);

export default DocumentEditor;
