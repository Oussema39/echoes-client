import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Save, Share } from "lucide-react";

interface DocumentEditorProps {
  initialContent?: string;
  documentTitle?: string;
  onSave?: (content: string, title: string) => void;
  onContentChange?: (content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent = "",
  documentTitle = "Untitled_1",
  onSave,
  onContentChange,
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(documentTitle);
  const [wordCount, setWordCount] = useState(0);
  const [promptsLeft, setPromptsLeft] = useState(84);
  const quillRef = useRef<ReactQuill>(null);

  const handleChange = (value: string) => {
    if (content) {
      const text = content.replace(/<[^>]*>/g, " ");
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
    setContent(value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content, title);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
    "link",
  ];

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-subtle overflow-hidden animate-fade-in">
      <header className="flex justify-between items-center px-6 py-3 border-b">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="font-medium text-lg focus:outline-none focus:bg-muted/30 px-2 py-1 rounded"
            aria-label="Document title"
            placeholder="Document title"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Save size={16} />
            <span>Save</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Share size={16} />
            <span>Share</span>
          </Button>
        </div>
      </header>

      <div className="flex-grow overflow-auto px-6">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing something amazing..."
          className="h-full border-none focus:outline-none"
        />
      </div>

      <footer className="flex justify-between items-center px-6 py-2 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{wordCount} Words</span>
          <Button variant="ghost" size="sm" className="text-xs h-6 gap-1">
            <span>{wordCount > 0 ? wordCount : 286}</span>
            <ChevronDown size={12} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-brand-blue bg-brand-light">
            {promptsLeft} Prompts Left
          </Badge>
          <Button
            size="sm"
            className="h-6 text-xs bg-brand-blue hover:bg-brand-dark"
          >
            Write Prompt for Selection
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default DocumentEditor;
