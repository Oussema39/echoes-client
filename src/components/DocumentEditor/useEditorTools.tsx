import Quill from "quill";
import { MutableRefObject, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { toast } from "sonner";

interface UserEditorToolsReturn {
  isInserting: boolean;
  stopStreamInsert: () => void;
  quillRef: MutableRefObject<ReactQuill>;
  insertTextFromSelection: (text: string) => void;
  streamInsertFromSelection: (speed?: number) => void;
  pushTextToBuffer: (chunk: string, speed?: number) => void;
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
    if (!ref.current) return undefined;
    return ref.current?.getEditor();
  };

  const insertTextFromSelection = (text: string) => {
    const quill = getEditorInstance(quillRef);
    if (!quill) return;

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
  const streamInsert = (speed = 25) => {
    if (typingInterval.current) return; // Prevent multiple intervals

    const quill = getEditorInstance(quillRef);
    if (!quill) return;

    const selection = quill.getSelection() ?? {
      index: 0,
      length: quill.getLength(),
    };

    if (!selection || selection.length === 0) return;

    if (!hasDeletedText.current) {
      quill.deleteText(selection.index, selection.length);
      hasDeletedText.current = true;
      insertIndex.current = selection.index;
    }

    typingInterval.current = setInterval(() => {
      if (charBuffer.current.length > 0) {
        const nextChar = charBuffer.current[0];
        charBuffer.current = charBuffer.current.slice(1);
        quill.insertText(insertIndex.current++, nextChar);
      } else {
        clearInterval(typingInterval.current!);
        typingInterval.current = null;
        setIsInserting(false);
        quill.setSelection(
          selection.index,
          insertIndex.current - selection.index
        );
        hasDeletedText.current = false;
        quill.enable();
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
    streamInsertFromSelection: streamInsert,
  };
};

export default useEditorTools;
