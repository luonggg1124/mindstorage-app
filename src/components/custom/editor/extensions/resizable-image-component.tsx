import React, { useState, useRef, useEffect } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export const ResizableImageComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    src,
    alt,
    title,
    width,
    height,
    align = "left",
    loading: isLoading = false,
  } = node.attrs;

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setStartSize({ width: width || 300, height: height || 200 });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;

    let newWidth = startSize.width;
    let newHeight = startSize.height;

    // Calculate aspect ratio
    const aspectRatio = startSize.width / startSize.height;

    if (resizeDirection.includes("e")) {
      newWidth = Math.max(50, startSize.width + deltaX);
      newHeight = newWidth / aspectRatio;
    }
    if (resizeDirection.includes("w")) {
      newWidth = Math.max(50, startSize.width - deltaX);
      newHeight = newWidth / aspectRatio;
    }
    if (resizeDirection.includes("s")) {
      newHeight = Math.max(50, startSize.height + deltaY);
      newWidth = newHeight * aspectRatio;
    }
    if (resizeDirection.includes("n")) {
      newHeight = Math.max(50, startSize.height - deltaY);
      newWidth = newHeight * aspectRatio;
    }

    // Ensure image doesn't exceed container width
    const container = containerRef.current?.closest(".tiptap");
    if (container) {
      const containerWidth = container.clientWidth;
      if (newWidth > containerWidth) {
        newWidth = containerWidth;
        newHeight = newWidth / aspectRatio;
      }
    }

    updateAttributes({ width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeDirection("");
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, startPosition, startSize, resizeDirection]);

  const handleImageLoad = () => {
    if (imageRef.current && !width && !height) {
      const naturalWidth = imageRef.current.naturalWidth;
      const naturalHeight = imageRef.current.naturalHeight;

      // Get container width to calculate appropriate size
      const container = containerRef.current?.closest(".tiptap");
      const containerWidth = container?.clientWidth || 600;

      // Calculate size to fit within container
      let newWidth = naturalWidth;
      let newHeight = naturalHeight;

      if (naturalWidth > containerWidth) {
        newWidth = containerWidth;
        newHeight = (naturalHeight * containerWidth) / naturalWidth;
      }

      updateAttributes({
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleAlignChange = (newAlign: string) => {
    updateAttributes({ align: newAlign });
  };

  if (isLoading) {
    const w = width || 225;
    const h = height || 225;
    return (
      <NodeViewWrapper
        className="relative block w-full resizable-image"
        data-align={align}
      >
        <div
          className="inline-block rounded-lg bg-muted animate-pulse"
          style={{
            width: w,
            height: h,
            minWidth: w,
            minHeight: h,
            maxWidth: "100%",
          }}
          aria-label="Đang tải ảnh..."
        />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className="relative block w-full resizable-image"
      data-align={align}
    >
      <div
        ref={containerRef}
        className={`relative inline-block ${selected ? "ring-2 ring-blue-500" : ""}`}
        style={{
          width: width || "auto",
          height: height || "auto",
          maxWidth: "100%",
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || ""}
          title={title || ""}
          onLoad={handleImageLoad}
          className="max-w-full h-auto rounded-lg"
          style={{
            width: width || "auto",
            height: height || "auto",
            maxWidth: "100%",
          }}
        />

        {/* Resize handles */}
        {selected && (
          <>
            {/* Corner handles */}
            <div
              className="absolute top-0 left-0 w-3 h-3 bg-blue-500 cursor-nw-resize"
              onMouseDown={(e) => handleMouseDown(e, "nw")}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 bg-blue-500 cursor-ne-resize"
              onMouseDown={(e) => handleMouseDown(e, "ne")}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 cursor-sw-resize"
              onMouseDown={(e) => handleMouseDown(e, "sw")}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => handleMouseDown(e, "se")}
            />

            {/* Edge handles */}
            <div
              className="absolute top-1/2 left-0 w-3 h-3 bg-blue-500 cursor-w-resize transform -translate-y-1/2"
              onMouseDown={(e) => handleMouseDown(e, "w")}
            />
            <div
              className="absolute top-1/2 right-0 w-3 h-3 bg-blue-500 cursor-e-resize transform -translate-y-1/2"
              onMouseDown={(e) => handleMouseDown(e, "e")}
            />
            <div
              className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 cursor-n-resize transform -translate-x-1/2"
              onMouseDown={(e) => handleMouseDown(e, "n")}
            />
            <div
              className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-500 cursor-s-resize transform -translate-x-1/2"
              onMouseDown={(e) => handleMouseDown(e, "s")}
            />

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1">
              {/* Alignment buttons */}
              <div className="flex gap-1 bg-white rounded shadow-md p-1">
                <button
                  type="button"
                  className={`p-1 rounded ${align === "left" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  onClick={() => handleAlignChange("left")}
                  title="Align Left"
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className={`p-1 rounded ${align === "center" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  onClick={() => handleAlignChange("center")}
                  title="Align Center"
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className={`p-1 rounded ${align === "right" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  onClick={() => handleAlignChange("right")}
                  title="Align Right"
                >
                  <AlignRight className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                className="p-1 bg-white rounded shadow-md hover:bg-gray-100"
                onClick={() => deleteNode()}
                title="Delete image"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            </div>

            {/* Size indicator */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {Math.round(width)} × {Math.round(height)}
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};
