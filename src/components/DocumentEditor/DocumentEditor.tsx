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
    const htmlBuffer = useRef<string>("");
    const typingInterval = useRef<NodeJS.Timeout | null>(null);
    const hasDeletedText = useRef<boolean>(false);
    const insertIndex = useRef<number>(0);
    let streamTimeout: NodeJS.Timeout | null;

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

    // Stream plain text insert (existing)
    const streamInsert = (speed: number = 25) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const selection: RangeStatic = quill.getSelection() ?? {
        index: 0,
        length: quill.getLength(),
      };

      if (!selection || selection.length === 0) return;

      // initialize insert
      if (!hasDeletedText.current) {
        quill.deleteText(selection.index, selection.length);
        hasDeletedText.current = true;
        insertIndex.current = selection.index;
      }
      if (typingInterval.current) return;

      typingInterval.current = setInterval(() => {
        if (charBuffer.current.length > 0) {
          const nextChar = charBuffer.current[0];
          charBuffer.current = charBuffer.current.slice(1);
          quill.insertText(insertIndex.current++, nextChar);
        } else {
          clearInterval(typingInterval.current!);
          typingInterval.current = null;
          quill.setSelection(
            selection.index,
            insertIndex.current - selection.index
          );
          hasDeletedText.current = false;
        }
      }, speed);
    };

    // Push text into buffer and start streaming
    const pushTextToBuffer = (chunk: string, speed?: number) => {
      charBuffer.current += chunk;
      streamInsert(speed);
    };

    // New: Stream HTML into Quill with animation
    const streamHtmlInsert = (speed: number = 25) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      if (htmlBuffer.current.length === 0) return;

      const selection: RangeStatic = quill.getSelection() ?? {
        index: 0,
        length: quill.getLength(),
      };
      if (!hasDeletedText.current) {
        quill.deleteText(selection.index, selection.length);
        hasDeletedText.current = true;
        insertIndex.current = selection.index;
      }

      const insertNext = () => {
        if (htmlBuffer.current.length === 0) {
          // hasDeletedText.current = false;
          return;
        }
        let frag = "";
        if (htmlBuffer.current.startsWith("<")) {
          const end = htmlBuffer.current.indexOf(">") + 1;
          if (end > 0) frag = htmlBuffer.current.slice(0, end);
        }
        if (!frag) frag = htmlBuffer.current.charAt(0);
        htmlBuffer.current = htmlBuffer.current.slice(frag.length);

        // wrap for animation
        const spanId = `frag-${Date.now()}-${Math.random()}`;
        const wrapped = `<span id="${spanId}" class="stream-fragment">${frag}</span>`;
        quill.clipboard.dangerouslyPasteHTML(
          insertIndex.current,
          wrapped,
          "silent"
        );
        insertIndex.current += frag.length;

        // cleanup span after animation
        setTimeout(() => {
          const node = quill.root.querySelector(`#${spanId}`);
          if (node) {
            const fragHtml = node.innerHTML;
            node.replaceWith(
              ...Array.from(
                document.createRange().createContextualFragment(fragHtml)
                  .childNodes
              )
            );
          }
        }, 300);

        if (htmlBuffer.current.length > 0) {
          setTimeout(insertNext, speed);
        }
      };

      insertNext();
    };

    const pushHtmlToBuffer = (chunk: string, speed?: number) => {
      htmlBuffer.current += chunk;
      streamHtmlInsert(speed);
    };

    const getTextFromSelection = () => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;
      const selection = quill.getSelection();
      return quill.getText(selection.index, selection.length);
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
      streamHtmlInsertFromSelection: streamHtmlInsert,
      pushHtmlToBuffer,
    }));

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
