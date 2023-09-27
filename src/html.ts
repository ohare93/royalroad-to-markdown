export function runAllHTMLReplacements(html: string): string {
  const f = [
    escapeMarkdownCharacters,
    italicsToMarkdown,
    boldToMarkdown,
    linksToMarkdown,
    makeHiddenPartsVisible,
    fixSpacing,
    removeHTMLTags,
    fixSymbols,
  ];
  return f.reduce((acc, fn) => fn(acc), html);
}

export function escapeMarkdownCharacters(html: string): string {
  return html.replace(/([\*_])/g, '\\$1');
}

export function italicsToMarkdown(html: string): string {
  return (
    html
      // Span Italic to em
      .replace(/(<span[^>]+italic[^>]+>.*?)<\/span>/g, '$1</em>')
      .replace(/<span[^>]+italic[^>]+>/g, '<em>')
      // Empty em to space
      .replace(/<em>\s<\/em>/g, ' ')
      // Fix spacing between em and words
      .replace(/<em>\s/g, ' *')
      .replace(/\s<\/em>/g, '* ')
      // Replace with markdown
      .replace(/<\/?em>/g, '*')
  );
}

export function boldToMarkdown(html: string): string {
  return (
    html
      // Span Bold to strong
      .replace(/(<span[^>]+bold[^>]+>.*?)<\/span>/g, '$1</strong>')
      .replace(/<span[^>]+bold[^>]+>/g, '<strong>')
      // Empty strong to space
      .replace(/<strong>\s<\/strong>/g, ' ')
      // Fix spacing between strong and words
      .replace(/<strong>\s/g, ' **')
      .replace(/\s<\/strong>/g, '** ')
      // Replace with markdown
      .replace(/<\/?strong>/g, '**')
  );
}

export function linksToMarkdown(html: string): string {
  return html.replace(
    /<a.*?href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/,
    '[$2]($1)'
  );
}

export function makeHiddenPartsVisible(html: string) {
  return html.replace(/<[^>]+display: none[^>]+>/, '#hidden\n> ');
}

export function fixSpacing(html: string): string {
  return (
    html
      // br to newline
      .replace(/<br>/g, '\n')
      // Remove double elements, like <div><div>
      .replace(/<(\/?\w)[^>]+>[\n\s]*?<\1[^>]+>/g, '')
      // Multi newlines to 1 newline
      .replace(/\n{1,}/, '\n')
  );
}

export function removeHTMLTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

export function fixSymbols(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}
