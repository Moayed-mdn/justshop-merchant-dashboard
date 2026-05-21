/**
 * TOC Heading interface
 */
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Simple RTL-safe slugify
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove HTML tags if any
    .replace(/<[^>]*>?/gm, '')
    // Replace spaces and punctuation with hyphens
    // We use a regex that preserves alphanumeric characters including non-latin ones (for RTL)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts headings from HTML and injects IDs
 * Returns the modified HTML and the extracted headings
 */
export function processContentHeadings(html: string): {
  content: string;
  headings: TocHeading[];
} {
  const headings: TocHeading[] = [];
  const headingCounts: Record<string, number> = {};

  // Regex to match h2 and h3 tags
  // Group 1: level (2 or 3)
  // Group 2: attributes (if any)
  // Group 3: inner content
  const headingRegex = /<h([23])(.*?)>(.*?)<\/h\1>/gi;

  const content = html.replace(headingRegex, (match, level, attrs, text) => {
    // Clean text for ID generation
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
    let id = slugify(cleanText);

    // Handle duplicate IDs
    if (headingCounts[id] !== undefined) {
      headingCounts[id]++;
      id = `${id}-${headingCounts[id]}`;
    } else {
      headingCounts[id] = 0;
    }

    headings.push({
      id,
      text: cleanText,
      level: parseInt(level, 10),
    });

    // If ID already exists in attributes, we replace it, otherwise we add it
    if (attrs.includes('id=')) {
      return `<h${level}${attrs.replace(/id=".*?"|id='.*?'/, `id="${id}"`)}>${text}</h${level}>`;
    }

    return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
  });

  return { content, headings };
}
