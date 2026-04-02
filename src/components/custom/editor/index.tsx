/* eslint-disable no-unused-vars */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./editor.css";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import HardBreak from "@tiptap/extension-hard-break";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Focus from "@tiptap/extension-focus";
import { ResizableImage } from "./extensions/resizable-image";
import ToolBar from "./tool-bar";
import React from "react";

const LIMIT_CHARACTER = 10000;

type EditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  toolbarMaxLines?: number; // Số dòng tối đa của toolbar trước khi hiển thị nút "..."
};

const Editor: React.FC<EditorProps> = ({
  content = "",
  onChange,
  placeholder = "Enter your content here...",
  className = "min-h-[300px]",
  toolbarMaxLines = 3,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      HardBreak,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      BulletList,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      // Use ResizableImage instead of regular Image
      ResizableImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "border-t border-gray-300 my-4",
        },
      }),
      Typography,
      CharacterCount.configure({ limit: LIMIT_CHARACTER }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 w-full",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-gray-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-100 px-4 py-2 font-bold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 px-4 py-2",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "list-none space-y-2",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start space-x-2",
        },
      }),
      Dropcursor.configure({
        color: "#3b82f6",
        width: 2,
      }),
      Gapcursor,
      Focus.configure({
        className: "has-focus",
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: content,
    editorProps: {
      attributes: {
        class: `tiptap w-full max-h-[400px] overflow-y-scroll rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none ${className}`,
      },
    },
  });

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      queueMicrotask(() => {
        editor.commands.setContent(content);
      });
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="relative">
      {/* Toolbar */}
      <ToolBar editor={editor} maxLines={toolbarMaxLines} />

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <div className="flex gap-4">
          <span>Từ: {editor.storage.characterCount.words()}</span>
          <span>Ký tự: {editor.storage.characterCount.characters()}</span>
        </div>
        <span>
          {editor.storage.characterCount.characters()}/{LIMIT_CHARACTER}
        </span>
      </div>
    </div>
  );
};

export default Editor;
