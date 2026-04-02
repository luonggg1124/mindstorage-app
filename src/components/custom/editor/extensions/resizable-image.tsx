/* eslint-disable no-unused-vars */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageComponent } from "./resizable-image-component";

export interface ResizableImageOptions {
  HTMLAttributes: Record<string, string | number | boolean>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setImage: (attrs: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
        align?: string;
      }) => ReturnType;  
    };
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: "resizableImage",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "max-w-full h-auto rounded-lg",
      },
    };
  },

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      align: {
        default: "left",
      },
      /** Chỉ dùng trong editor: đang upload → hiển thị skeleton (không serialize ra HTML) */
      loading: { default: false },
      /** Chỉ dùng trong editor: id để tìm node và cập nhật sau khi upload (không serialize ra HTML) */
      placeholderId: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { loading, placeholderId, ...rest } = HTMLAttributes;
    const attrs = mergeAttributes(this.options.HTMLAttributes, rest);

    // Thêm class căn chỉnh dựa trên thuộc tính align
    if (rest.align) {
      attrs.class =
        `${attrs.class || ""} image-align-${rest.align}`.trim();
    }

    return ["img", attrs];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      setImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attrs,
          });
        },
    };
  },
});
