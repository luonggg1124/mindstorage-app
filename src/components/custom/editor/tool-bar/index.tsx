"use client";

import { Editor } from "@tiptap/react";
import {
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Subscript,
  Superscript,
  Table,
  CheckSquare,
  Quote,
  Code2,
  Undo,
  Redo,
  SeparatorHorizontal,
  CirclePlus,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

import ImagePickerModal from "@/components/custom/image-picker-modal";
import { useEditorUploadImage } from "./hook";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Palette,
  Highlighter,
  Eraser,
  PaintBucket,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link,
  Unlink,
} from "lucide-react";

type ToolBarProps = {
  editor: Editor;
  maxLines?: number; // Số dòng tối đa trước khi hiển thị nút "..."
};

type ToolbarButton = {
  id: string;
  icon?: React.ReactNode;
  label?: string;
  onClick: () => void;
  isActive?: () => boolean;
  disabled?: () => boolean;
  title: string;
  size?: "icon-sm" | "sm";
  className?: string;
  showWhen?: () => boolean;
};

const ToolBar = ({ editor, maxLines = 3 }: ToolBarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [showMore, setShowMore] = useState(false);

  const [hiddenButtonIds, setHiddenButtonIds] = useState<Set<string>>(
    new Set()
  );
  const isMediaHidden = showMore && hiddenButtonIds.has("media");
  const isTextColorHidden = showMore && hiddenButtonIds.has("text-color");
  const isHighlightHidden = showMore && hiddenButtonIds.has("highlight");
  const [activeOpen, setActiveOpen] = useState<
    null | "more" | "media" | "text-color" | "highlight"
  >(null);

 
  const isMediaPickerOpen = activeOpen === "media";
  const isTextColorPickerOpen = activeOpen === "text-color";
  const isHighlightPickerOpen = activeOpen === "highlight";

  const { selectMediaImage, isUploadingImage } = useEditorUploadImage(editor);

  const handleOpenMediaPicker = () => {
    setActiveOpen("media");
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteTable = () => editor.chain().focus().deleteTable().run();

  const textColors = [
    { id: "black", label: "Đen", value: "#000000" },
    { id: "gray", label: "Xám", value: "#6B7280" },
    { id: "red", label: "Đỏ", value: "#EF4444" },
    { id: "orange", label: "Cam", value: "#F97316" },
    { id: "amber", label: "Vàng", value: "#F59E0B" },
    { id: "green", label: "Xanh lá", value: "#22C55E" },
    { id: "teal", label: "Xanh ngọc", value: "#14B8A6" },
    { id: "blue", label: "Xanh dương", value: "#3B82F6" },
    { id: "violet", label: "Tím", value: "#8B5CF6" },
    { id: "pink", label: "Hồng", value: "#EC4899" },
  ] as const;

  const highlightColors = [
    { id: "yellow", label: "Vàng", value: "#FEF08A" },
    { id: "green", label: "Xanh lá", value: "#BBF7D0" },
    { id: "blue", label: "Xanh dương", value: "#BFDBFE" },
    { id: "pink", label: "Hồng", value: "#FBCFE8" },
    { id: "orange", label: "Cam", value: "#FED7AA" },
    { id: "violet", label: "Tím", value: "#DDD6FE" },
  ] as const;

  // Định nghĩa tất cả các buttons trong một mảng
  const toolbarButtons: ToolbarButton[] = [
    // Text Formatting
    {
      id: "bold",
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      title: "In đậm (Ctrl+B)",
    },
    {
      id: "italic",
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      title: "In nghiêng (Ctrl+I)",
    },
    {
      id: "underline",
      icon: <Underline className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      title: "Gạch chân (Ctrl+U)",
    },
    {
      id: "strike",
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      title: "Gạch ngang",
    },
    {
      id: "code",
      icon: <Code className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      title: "Mã nội tuyến",
    },
    // Headings
    {
      id: "heading-1",
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      title: "Tiêu đề 1",
    },
    {
      id: "heading-2",
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      title: "Tiêu đề 2",
    },
    {
      id: "heading-3",
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      title: "Tiêu đề 3",
    },
    {
      id: "heading-4",
      icon: <Heading4 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: () => editor.isActive("heading", { level: 4 }),
      title: "Tiêu đề 4",
    },
    {
      id: "heading-5",
      icon: <Heading5 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: () => editor.isActive("heading", { level: 5 }),
      title: "Tiêu đề 5",
    },
    {
      id: "heading-6",
      icon: <Heading6 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: () => editor.isActive("heading", { level: 6 }),
      title: "Tiêu đề 6",
    },
    // Paragraph & Break
    {
      id: "paragraph",
      label: "P",
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
      size: "sm",
      title: "Đoạn văn",
    },
    {
      id: "hard-break",
      label: "↵",
      onClick: () => editor.chain().focus().setHardBreak().run(),
      size: "sm",
      title: "Xuống dòng",
    },
    // Links
    {
      id: "link",
      icon: <Link className="h-4 w-4" />,
      onClick: () => {
        const url = window.prompt("Nhập URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      isActive: () => editor.isActive("link"),
      title: "Chèn liên kết",
    },
    {
      id: "unlink",
      icon: <Unlink className="h-4 w-4" />,
      onClick: () => editor.chain().focus().unsetLink().run(),
      title: "Xóa liên kết",
    },
    // Text Alignment
    {
      id: "align-left",
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
      title: "Căn trái",
    },
    {
      id: "align-center",
      icon: <AlignCenter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
      title: "Căn giữa",
    },
    {
      id: "align-right",
      icon: <AlignRight className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
      title: "Căn phải",
    },
    {
      id: "align-justify",
      icon: <AlignJustify className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
      title: "Căn đều",
    },
    // Lists
    {
      id: "bullet-list",
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
      title: "Danh sách dấu đầu dòng",
    },
    {
      id: "ordered-list",
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
      title: "Danh sách đánh số",
    },
    {
      id: "task-list",
      icon: <CheckSquare className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
      title: "Danh sách công việc",
    },
    // Subscript & Superscript
    {
      id: "subscript",
      icon: <Subscript className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleSubscript().run(),
      isActive: () => editor.isActive("subscript"),
      title: "Chỉ số dưới",
    },
    {
      id: "superscript",
      icon: <Superscript className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: () => editor.isActive("superscript"),
      title: "Chỉ số trên",
    },
    // Table Controls
    {
      id: "table",
      icon: <Table className="h-4 w-4" />,
      onClick: addTable,
      title: "Chèn bảng",
    },
    {
      id: "add-column-before",
      label: "+Col",
      onClick: addColumnBefore,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Thêm cột trước",
    },
    {
      id: "add-column-after",
      label: "Col+",
      onClick: addColumnAfter,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Thêm cột sau",
    },
    {
      id: "delete-column",
      label: "-Col",
      onClick: deleteColumn,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Xóa cột",
    },
    {
      id: "add-row-before",
      label: "+Row",
      onClick: addRowBefore,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Thêm hàng trước",
    },
    {
      id: "add-row-after",
      label: "Row+",
      onClick: addRowAfter,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Thêm hàng sau",
    },
    {
      id: "delete-row",
      label: "-Row",
      onClick: deleteRow,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Xóa hàng",
    },
    {
      id: "delete-table",
      label: "-Table",
      onClick: deleteTable,
      size: "sm",
      showWhen: () => editor.isActive("table"),
      title: "Xóa bảng",
    },
    // Block Elements
    {
      id: "blockquote",
      icon: <Quote className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
      title: "Trích dẫn",
    },
    {
      id: "code-block",
      icon: <Code2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
      title: "Khối mã",
    },
    {
      id: "horizontal-rule",
      icon: <SeparatorHorizontal className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      title: "Đường kẻ ngang",
    },
    // History
    {
      id: "undo",
      icon: <Undo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: () => !editor.can().undo(),
      title: "Hoàn tác",
    },
    {
      id: "redo",
      icon: <Redo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: () => !editor.can().redo(),
      title: "Làm lại",
    },
  ];

  // Kiểm tra chiều cao và xác định items bị ẩn dựa trên width và line
  useEffect(() => {
    const checkHeight = () => {
      if (!toolbarRef.current) return;

      const container = toolbarRef.current;
      const maxHeight = maxLines * 40; // maxLines dòng * 40px mỗi dòng
      const actualHeight = container.scrollHeight;

      if (actualHeight <= maxHeight) {
        setShowMore(false);

        setHiddenButtonIds(new Set());
        return;
      }

      setShowMore(true);

      // Tìm các items bị ẩn bằng cách kiểm tra dòng của từng child
      const children = Array.from(container.children) as HTMLElement[];
      const hidden = new Set<number>();
      const hiddenIds = new Set<string>();

      // Nhóm các items theo dòng dựa trên top position (sử dụng getBoundingClientRect để chính xác hơn)
      const itemsByLine: Map<
        number,
        Array<{ index: number; element: HTMLElement; left: number }>
      > = new Map();
      const containerRect = container.getBoundingClientRect();

      children.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;

        // Nhóm các items trên cùng một dòng (tolerance: 10px)
        // Mỗi dòng có chiều cao khoảng 40px (button height + gap)
        const lineNumber = Math.round(relativeTop / 10);

        if (!itemsByLine.has(lineNumber)) {
          itemsByLine.set(lineNumber, []);
        }
        itemsByLine.get(lineNumber)!.push({
          index,
          element: child,
          left: rect.left - containerRect.left,
        });
      });

      // Sắp xếp các dòng theo thứ tự (theo top position thực tế)
      const sortedLines = Array.from(itemsByLine.keys()).sort((a, b) => {
        // Lấy top position của dòng đầu tiên để so sánh
        const lineAItems = itemsByLine.get(a) || [];
        const lineBItems = itemsByLine.get(b) || [];
        if (lineAItems.length === 0 || lineBItems.length === 0) return a - b;

        const topA =
          lineAItems[0].element.getBoundingClientRect().top - containerRect.top;
        const topB =
          lineBItems[0].element.getBoundingClientRect().top - containerRect.top;
        return topA - topB;
      });

      // Tìm item cuối cùng trên dòng cuối cùng được hiển thị (dòng thứ maxLines)
      let lastVisibleIndex = -1;

      // Tìm dòng cuối cùng được hiển thị (index maxLines - 1 trong mảng sortedLines)
      const lastVisibleLineIndex = maxLines - 1;

      if (sortedLines.length >= maxLines) {
        // Tìm dòng cuối cùng được hiển thị
        const lastVisibleLineNumber = sortedLines[lastVisibleLineIndex];
        const lastVisibleLineItems =
          itemsByLine.get(lastVisibleLineNumber) || [];

        if (lastVisibleLineItems.length > 0) {
          // Sắp xếp các items trên dòng cuối cùng theo left position để tìm item cuối cùng
          const sortedLastVisibleLineItems = lastVisibleLineItems.sort(
            (a, b) => a.left - b.left
          );
          lastVisibleIndex =
            sortedLastVisibleLineItems[sortedLastVisibleLineItems.length - 1]
              .index;
        }
      } else if (sortedLines.length === maxLines) {
        // Nếu đúng bằng số dòng maxLines, tìm item cuối cùng trên dòng cuối cùng
        const lastLineNumber = sortedLines[lastVisibleLineIndex];
        const lastLineItems = itemsByLine.get(lastLineNumber) || [];

        if (lastLineItems.length > 0) {
          const sortedLastLineItems = lastLineItems.sort(
            (a, b) => a.left - b.left
          );
          lastVisibleIndex =
            sortedLastLineItems[sortedLastLineItems.length - 1].index;
        }
      }

      // Nếu tìm thấy item cuối cùng, đánh dấu tất cả items sau đó là bị ẩn
      if (lastVisibleIndex >= 0) {
        children.forEach((child, index) => {
          if (index > lastVisibleIndex) {
            hidden.add(index);
            const buttonId = child.getAttribute("data-button-id");
            if (buttonId) {
              hiddenIds.add(buttonId);
            }
          }
        });
      } else {
        // Fallback: sử dụng logic dựa trên height nếu không tìm thấy
        children.forEach((child, index) => {
          const rect = child.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;

          if (relativeTop >= maxHeight) {
            hidden.add(index);
            const buttonId = child.getAttribute("data-button-id");
            if (buttonId) {
              hiddenIds.add(buttonId);
            }
          }
        });
      }

      // Chỉ update state nếu có thay đổi
      const currentHiddenIdsStr = Array.from(hiddenIds).sort().join(",");
      const prevHiddenIdsStr = Array.from(hiddenButtonIds).sort().join(",");
      const shouldShowMore = actualHeight > maxHeight;

      if (currentHiddenIdsStr !== prevHiddenIdsStr) {
        setHiddenButtonIds(hiddenIds);
      }

      if (shouldShowMore !== showMore) {
        setShowMore(shouldShowMore);
      }
    };

    // Đợi DOM render xong
    const timeoutId = setTimeout(checkHeight, 300);
    window.addEventListener("resize", checkHeight);

    // Chỉ kiểm tra lại khi editor state thay đổi (không dùng interval liên tục)
    // Sử dụng MutationObserver để theo dõi thay đổi DOM
    const observer = new MutationObserver(() => {
      checkHeight();
    });

    if (toolbarRef.current) {
      observer.observe(toolbarRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener("resize", checkHeight);
    };
  }, [editor]);

  return (
    <>
      <div
        ref={toolbarRef}
        className="flex items-center gap-1 flex-wrap p-2 mb-3 bg-muted/30 border border-border rounded-lg shadow-sm"
        style={{
          maxHeight: showMore ? `${maxLines * 40}px` : "none",
          overflow: showMore ? "hidden" : "visible",
        }}
      >
        {/* More button và gradient overlay nếu toolbar dài quá 3 dòng */}
        {showMore && (
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="flex items-center justify-center "
                  title="Thêm tùy chọn"
                >
                  <CirclePlus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-auto max-w-[90vw] p-1 sm:p-2 max-h-[60vh] sm:max-h-[400px] overflow-y-auto overscroll-contain scrollbar-thin"
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    Các tùy chọn bổ sung
                  </div>

                  {/* Chỉ render những buttons bị ẩn trong dropdown */}
                  {hiddenButtonIds.size > 0 ? (
                    <div className="pr-1">
                      <div className="flex items-center gap-0.5 flex-wrap">
                        {toolbarButtons.map((btn) => {
                          // Chỉ render nếu button bị ẩn
                          if (!hiddenButtonIds.has(btn.id)) return null;
                          if (btn.showWhen && !btn.showWhen()) return null;

                          return (
                            <Button
                              key={btn.id}
                              type="button"
                              variant="ghost"
                              size={btn.size || "icon-sm"}
                              onClick={btn.onClick}
                              disabled={btn.disabled ? btn.disabled() : false}
                              className={cn(
                                btn.size === "sm"
                                  ? "h-7 px-2 sm:h-8 sm:px-3"
                                  : "h-7 w-7 sm:h-8 sm:w-8",
                                btn.isActive &&
                                  btn.isActive() &&
                                  "bg-accent text-accent-foreground",
                                btn.className
                              )}
                              title={btn.title}
                            >
                              {btn.icon || btn.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Không có tùy chọn bổ sung
                    </div>
                  )}

                  {/* Nếu ToolMedia (chọn ảnh/media) bị ẩn do overflow thì đưa vào dropdown */}
                  {isMediaHidden && (
                    <div className="pt-2 mt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenMediaPicker()}
                          disabled={isUploadingImage}
                          className="cursor-pointer"
                          title={isUploadingImage ? "Đang tải ảnh lên..." : undefined}
                        >
                          {isUploadingImage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Nếu màu chữ bị ẩn do overflow thì đưa vào dropdown */}
                  {isTextColorHidden && (
                    <div className="pt-2 mt-2 border-t border-border">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground w-full">
                          Màu chữ
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                          {textColors.map((c) => (
                            <Button
                              key={c.id}
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              title={c.label}
                              onClick={() =>
                                editor.chain().focus().setColor(c.value).run()
                              }
                            >
                              <span
                                className="h-4 w-4 rounded-sm border border-border"
                                style={{ backgroundColor: c.value }}
                              />
                            </Button>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editor.chain().focus().unsetColor().run()}
                          className="h-7 sm:h-8"
                          title="Xóa màu chữ"
                        >
                          <PaintBucket className=" h-4 w-4" />
                          
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Nếu highlight bị ẩn do overflow thì đưa vào dropdown */}
                  {isHighlightHidden && (
                    <div className="pt-2 mt-2 border-t border-border">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground w-full">
                          Đánh dấu
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                          {highlightColors.map((c) => (
                            <Button
                              key={c.id}
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              title={c.label}
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .setHighlight({ color: c.value })
                                  .run()
                              }
                            >
                              <span
                                className="h-4 w-4 rounded-sm border border-border"
                                style={{ backgroundColor: c.value }}
                              />
                            </Button>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            editor.chain().focus().unsetHighlight().run()
                          }
                          className="h-7 sm:h-8"
                          title="Xóa đánh dấu"
                        >
                          <Eraser className=" h-4 w-4" />
                          
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {/* Render tất cả buttons từ mảng */}
        {toolbarButtons.map((btn) => {
          if (btn.showWhen && !btn.showWhen()) return null;

          return (
            <Button
              key={btn.id}
              type="button"
              variant="ghost"
              size={btn.size || "icon-sm"}
              onClick={btn.onClick}
              disabled={btn.disabled ? btn.disabled() : false}
              className={cn(
                btn.size === "sm"
                  ? "h-7 px-2 sm:h-8 sm:px-3"
                  : "h-7 w-7 sm:h-8 sm:w-8",
                btn.isActive &&
                  btn.isActive() &&
                  "bg-accent text-accent-foreground",
                btn.className
               
              )}
              title={btn.title}
              data-button-id={btn.id}
            >
              {btn.icon || btn.label}
            </Button>
          );
        })}

        {/* Màu chữ (gộp) */}
        <div data-button-id="text-color">
          {isTextColorHidden ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 sm:h-8 sm:w-8 opacity-50 cursor-not-allowed"
              title="Màu chữ (mở trong tùy chọn bổ sung)"
              disabled
            >
              <Palette className="h-4 w-4" />
            </Button>
          ) : (
            <DropdownMenu
              open={isTextColorPickerOpen}
              onOpenChange={(open) =>
                setActiveOpen(open ? "text-color" : null)
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  title="Màu chữ"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="p-2 w-[min(22rem,calc(100vw-2rem))]"
              >
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Màu chữ
                </div>
                <div className="flex flex-wrap gap-2">
                  {textColors.map((c) => (
                    <Button
                      key={c.id}
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      title={c.label}
                      onClick={() => {
                        editor.chain().focus().setColor(c.value).run();
                        setActiveOpen(null);
                      }}
                    >
                      <span
                        className="h-4 w-4 rounded-sm border border-border"
                        style={{ backgroundColor: c.value }}
                      />
                    </Button>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setActiveOpen(null);
                    }}
                  >
                    <PaintBucket className="mr-2 h-4 w-4" />
                    Xóa màu chữ
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Đánh dấu (gộp) */}
        <div data-button-id="highlight">
          {isHighlightHidden ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 sm:h-8 sm:w-8 opacity-50 cursor-not-allowed"
              title="Đánh dấu (mở trong tùy chọn bổ sung)"
              disabled
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          ) : (
            <DropdownMenu
              open={isHighlightPickerOpen}
              onOpenChange={(open) =>
                setActiveOpen(open ? "highlight" : null)
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  title="Đánh dấu"
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="p-2 w-[min(22rem,calc(100vw-2rem))]"
              >
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Đánh dấu
                </div>
                <div className="flex flex-wrap gap-2">
                  {highlightColors.map((c) => (
                    <Button
                      key={c.id}
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      title={c.label}
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .setHighlight({ color: c.value })
                          .run();
                        setActiveOpen(null);
                      }}
                    >
                      <span
                        className="h-4 w-4 rounded-sm border border-border"
                        style={{ backgroundColor: c.value }}
                      />
                    </Button>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setActiveOpen(null);
                    }}
                  >
                    <Eraser className="mr-2 h-4 w-4" />
                    Xóa đánh dấu
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Media - Component riêng vì có popover */}
        <div data-button-id="media">
          {isMediaHidden ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 sm:h-8 sm:w-8 opacity-50 cursor-not-allowed"
              title="Thêm hình ảnh (mở trong tùy chọn bổ sung)"
              disabled
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setActiveOpen("media")}
              disabled={isUploadingImage}
              className="h-7 w-7 sm:h-8 sm:w-8"
              title={isUploadingImage ? "Đang tải ảnh lên..." : "Thêm hình ảnh"}
            >
              {isUploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <ImagePickerModal
        open={isMediaPickerOpen}
        onClose={() => setActiveOpen(null)}
        onSelect={selectMediaImage}
        title="Chọn hình ảnh"
      />
    </>
  );
};

export default ToolBar;
