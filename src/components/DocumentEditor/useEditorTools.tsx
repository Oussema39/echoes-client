import Quill, { RangeStatic } from "quill";
import { MutableRefObject, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { toast } from "sonner";

interface UserEditorToolsReturn {
  isInserting: boolean;
  quillRef: MutableRefObject<ReactQuill>;
  emptyEditor: () => void;
  endStreamInsert: () => void;
  stopStreamInsert: () => void;
  insertTextFromSelection: (text: string) => void;
  streamInsertFromSelection: (speed?: number) => void;
  pushTextToBuffer: (chunk: string, speed?: number) => void;
  streamInsertHTML: (chunk: string, speed?: number) => void;
  getTextFromSelection: () => string | undefined;
  getEditorInstance?: (ref: MutableRefObject<ReactQuill>) => Quill;
}

const useEditorTools = (
  externalRef?: MutableRefObject<ReactQuill>
): UserEditorToolsReturn => {
  const charBuffer = useRef<string>("");
  const typingInterval = useRef<NodeJS.Timeout | null>(null);
  const hasDeletedText = useRef<boolean>(false);
  const insertIndex = useRef<number>(0);
  const internalRef = useRef<ReactQuill>(null);
  const [isInserting, setIsInserting] = useState<boolean>(false);
  const quillRef = externalRef ?? internalRef;

  const getEditorInstance = (ref: MutableRefObject<ReactQuill>) => {
    if (!ref.current)
      throw new Error("Cannot find editor instance with ref:" + quillRef);
    return ref.current?.getEditor();
  };

  const emptyEditor = () => {
    const quill = getEditorInstance(quillRef);
    quill.deleteText(0, quill.getLength());
  };

  const insertTextFromSelection = (text: string) => {
    const quill = getEditorInstance(quillRef);

    quill.disable();

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
  const streamInsertHTML = (() => {
    let buffer = ""; // Accumulate incoming chunks

    return (chunk: string) => {
      const quill = getEditorInstance(quillRef);
      buffer += chunk;

      // Wrap buffer in a temporary div to parse
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = buffer;

      // Move only **complete child nodes** to Quill
      const children = Array.from(tempDiv.childNodes);
      let lastUnclosedIndex = -1;

      children.forEach((child, index) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          try {
            quill.clipboard.dangerouslyPasteHTML(
              quill.getLength() - 1,
              (child as HTMLElement).outerHTML
            );
            lastUnclosedIndex = index;
          } catch (err) {
            // Stop at the first node that cannot be safely inserted
            return;
          }
        } else if (child.nodeType === Node.TEXT_NODE) {
          quill.insertText(quill.getLength() - 1, child.textContent || "");
          lastUnclosedIndex = index;
        }
      });

      // Keep remaining nodes in buffer
      buffer = children
        .slice(lastUnclosedIndex + 1)
        .map((n) => (n as HTMLElement).outerHTML || n.textContent)
        .join("");
    };
  })();

  // Stream plain text insert (existing)
  const streamInsert = (speed: number = 25) => {
    setIsInserting(true);
    const quill = getEditorInstance(quillRef);
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
        charBuffer.current = "";
        clearInterval(typingInterval.current!);
        typingInterval.current = null;
        setIsInserting(false);
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
    if (!typingInterval.current) {
      streamInsert(speed);
    }
  };

  // Push text into buffer and start streaming
  const stopStreamInsert = () => {
    charBuffer.current = "";
  };

  const endStreamInsert = () => {
    hasDeletedText.current = false;
  };

  const getTextFromSelection = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const selection = quill.getSelection();
    return quill.getText(selection.index, selection.length);
  };

  return {
    quillRef,
    isInserting,
    stopStreamInsert,
    getTextFromSelection,
    insertTextFromSelection,
    pushTextToBuffer,
    endStreamInsert,
    emptyEditor,
    streamInsertFromSelection: streamInsert,
    streamInsertHTML,
  };
};

export default useEditorTools;
