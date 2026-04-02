"use client";

import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { toast } from "@/lib/toast";
// import { useUploadImage } from "@/client/@client/library";

const SKELETON_SIZE = { width: 225, height: 225 };

/**
 * Hook xử lý chèn ảnh vào editor: upload file (có loading + skeleton) hoặc chèn URL.
 */
export function useEditorUploadImage(editor: Editor | null) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  // const uploadImageMutation = useUploadImage();

  const findNodePosByPlaceholderId = useCallback(
    (placeholderId: string): number | null => {
      if (!editor) return null;
      let found: number | null = null;
      editor.state.doc.descendants((node, pos) => {
        if (
          node.type.name === "resizableImage" &&
          node.attrs.placeholderId === placeholderId
        ) {
          found = pos;
          return false; // stop descend
        }
      });
      return found;
    },
    [editor]
  );

  const selectMediaImage = useCallback(
    async (src: File | string) => {
      if (!editor) return;

      if (src instanceof File) {
        const placeholderId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setIsUploadingImage(true);

        editor
          .chain()
          .focus()
          .insertContent({
            type: "resizableImage",
            attrs: {
              src: "",
              loading: true,
              placeholderId,
              width: SKELETON_SIZE.width,
              height: SKELETON_SIZE.height,
              align: "left",
            },
          })
          .run();

        try {
          const fileUrl = "https://via.placeholder.com/225"; // await uploadImageMutation(src);

          const pos = findNodePosByPlaceholderId(placeholderId);
          if (pos !== null) {
            editor
              .chain()
              .focus()
              .setNodeSelection(pos)
              .updateAttributes("resizableImage", {
                src: fileUrl,
                loading: false,
                placeholderId: null,
              })
              .run();
          }
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Upload ảnh thất bại");
          const pos = findNodePosByPlaceholderId(placeholderId);
          if (pos !== null)
            editor.chain().focus().setNodeSelection(pos).deleteSelection().run();
        } finally {
          setIsUploadingImage(false);
        }
        return;
      }

      if (typeof src === "string" && src.trim()) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "resizableImage",
            attrs: { src: src.trim() },
          })
          .run();
      }
    },
    [editor, findNodePosByPlaceholderId]
  );

  return { selectMediaImage, isUploadingImage };
}
