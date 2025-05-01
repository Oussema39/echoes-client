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
import Loader from "../ui/loader";
import { RangeStatic } from "quill";

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
    const quillRef = useRef<ReactQuill>(null);
    const charBuffer = useRef<string>("");
    const typingInterval = useRef<NodeJS.Timeout | null>(null);
    const hasDeletedText = useRef<boolean>(false);

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

    const insertTextFromSelection = (text: string) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const selection = quill.getSelection();
      if (!selection || selection.length === 0) {
        toast.info("Please select some text to apply the AI action.");
        return;
      }

      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, text);
      quill.setSelection(selection.index, text.length);
    };

    const streamInsert = () => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const selection: RangeStatic = quill.getSelection() ?? {
        index: 0,
        length: quill.getLength(),
      };

      if (!selection || selection.length === 0) {
        return;
      }

      let insertIndex = selection.index;

      // Delete the selected text first
      if (!hasDeletedText.current) {
        quill.deleteText(selection.index, selection.length);
        hasDeletedText.current = true;
      }

      if (typingInterval.current) return;

      typingInterval.current = setInterval(() => {
        if (charBuffer.current.length > 0) {
          const nextChar = charBuffer.current[0];
          charBuffer.current = charBuffer.current.slice(1);
          quill.insertText(insertIndex++, nextChar);
        } else {
          clearInterval(typingInterval.current!);
          typingInterval.current = null;

          quill.setSelection(selection.index, insertIndex - selection.index);
          hasDeletedText.current = false;
        }
      }, 25);
    };

    const pushTextToBuffer = (chunk: string) => {
      charBuffer.current += chunk;
      streamInsert();
    };

    const getTextFromSelection = () => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const selection = quill.getSelection();

      quill.getText(selection.index, selection.length);
    };

    useEffect(() => {
      updateContentStats(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
      instance: quillRef.current?.getEditor(),
      getTextFromSelection,
      insertTextFromSelection,
      streamInsertFromSelection: streamInsert,
      pushTextToBuffer,
    }));

    // useEffect(() => {
    //   if (!quillRef.current) return;

    //   const quill = quillRef.current.getEditor();
    //   let savedRange = null;

    //   quill.on("selection-change", (range, oldRange, source) => {
    //     if (range == null && oldRange != null) {
    //       savedRange = oldRange;
    //     }
    //   });

    //   quill.root.addEventListener("blur", () => {
    //     if (savedRange) {
    //       quill.setSelection(savedRange.index, savedRange.length, "silent");
    //     }
    //   });

    //   quill.root.addEventListener("focus", () => {
    //     savedRange = null;
    //   });

    //   return () => {
    //     quill.root.removeEventListener("focus", () => {});
    //   };
    // }, []);

    return (
      <>
        <div className="flex-grow overflow-hidden px-6 pb-12 relative">
          {loading && (
            <div className="inset-0 flex items-center justify-center absolute backdrop-blur-[4px] z-50">
              <Loader />
            </div>
          )}
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
