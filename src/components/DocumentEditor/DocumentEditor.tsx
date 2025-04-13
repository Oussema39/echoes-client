import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DocumentEditorProps } from "@/interface/IDocumentEditor";
import DocumentFooter from "./DocumentFooter";
import { formats, modules } from "./config";
import { countEditorWords, getEstimatedReadTime } from "@/lib/utils";
import { toast } from "sonner";

const DocumentEditor = forwardRef(
  (
    { hideFooter = false, value, onChange, ...rest }: DocumentEditorProps,
    ref
  ) => {
    const [wordCount, setWordCount] = useState(0);
    const [readMins, setReadMins] = useState(0);
    const [promptsLeft] = useState(Number.POSITIVE_INFINITY);
    const quillRef = useRef<ReactQuill>(null);

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

    const insertTextFromSelection = async (
      actionHandler: (text: string) => Promise<string>
    ) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const selection = quill.getSelection();
      if (!selection || selection.length === 0) {
        toast.info("Please select some text to apply the AI action.");
        return;
      }

      const selectedText = quill.getText(selection.index, selection.length);

      const modifiedText = await actionHandler(selectedText);

      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, modifiedText);
      quill.setSelection(selection.index, modifiedText.length);
    };

    useEffect(() => {
      updateContentStats(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
      insertTextFromSelection,
    }));

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
            className="h-full border-none focus:outline-none z-50 selection:bg-primary/15"
            {...rest}
          />
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
