import DOMPurify from "dompurify";

/**
 * Sanitize HTML and return safe HTML string.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html ?? "");
}

/**
 * Sanitize HTML content and optionally truncate it to plain text.
 * @returns Sanitized and optionally truncated plain text
 */
export function sanitizeText(html: string, maxLength?: number): string {
  const cleanHtml = sanitizeHtml(html);
  const plainText = cleanHtml.replace(/<[^>]*>/g, "");

  if (maxLength !== undefined && plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + "...";
  }

  return plainText;
}

// Backward compatible alias
export const sanitize = sanitizeText;
