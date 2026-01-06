/**
 * Utility functions for article processing
 */

/**
 * Add IDs to headings in HTML content for anchor links
 */
export function addHeadingIds(htmlContent: string): string {
  // Match h2 and h3 tags
  return htmlContent.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/gi,
    (match, level, attrs, text) => {
      // Extract text content (remove any nested HTML)
      const textContent = text.replace(/<[^>]*>/g, '').trim();
      
      // Generate ID from text
      const id = textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Check if ID already exists in attributes
      if (attrs && attrs.includes('id=')) {
        return match; // Keep existing ID
      }
      
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
}

/**
 * Extract headings from HTML content for table of contents
 */
export function extractHeadings(htmlContent: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const headingRegex = /<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/gi;
  
  let match;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    
    // Extract ID from attributes if present
    let id = '';
    const idMatch = match[2].match(/id=["']([^"']+)["']/i);
    if (idMatch) {
      id = idMatch[1];
    } else {
      // Generate ID from text
      id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    headings.push({ level, text, id });
  }
  
  return headings;
}





