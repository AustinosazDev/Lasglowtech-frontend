/** Remove HTML tags from a string. */
export const stripHtml = (html = "") =>
  String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Clean user-facing text: strip HTML and common markdown markers (__, **, etc.).
 */
export const cleanDisplayText = (input = "") => {
  let text = stripHtml(input);
  return text
    .replace(/__([^_\n]+?)__/g, "$1")
    .replace(/\*\*([^*\n]+?)\*\*/g, "$1")
    .replace(/_([^_\n]+?)_/g, "$1")
    .replace(/\*([^*\n]+?)\*/g, "$1")
    .replace(/`([^`\n]+?)`/g, "$1")
    .replace(/_{2,}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

/** Turn snake_case or kebab-case tokens into readable labels. */
export const humanizeToken = (value = "") =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
