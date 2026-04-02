import DOMPurify from "dompurify";

/**
 * Sanitize HTML content and optionally truncate it
 * @param html - HTML string to sanitize
 * @param maxLength - Maximum length of the text. If not provided, returns full text
 * @returns Sanitized and optionally truncated plain text
 */
export const sanitize = (
  html: string,
  maxLength?: number
): string => {
  // Sanitize HTML
  const cleanHtml = DOMPurify.sanitize(html);
  // Remove HTML tags to get plain text
  const plainText = cleanHtml.replace(/<[^>]*>/g, "");
  
  // Truncate if maxLength is provided and text is longer
  if (maxLength !== undefined && plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + "...";
  }
  
  return plainText;
};
