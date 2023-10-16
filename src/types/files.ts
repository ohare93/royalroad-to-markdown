import {readFile} from 'src/helpers/files';

export function getFile(filepath: string, splitFrontmatter: boolean): File {
  const content = readFile(filepath);
  const isMarkdown = MarkdownFile.fileIsMarkdown(filepath);

  return isMarkdown
    ? new MarkdownFile(content, splitFrontmatter)
    : new File(content);
}

export class File {
  content: string;

  constructor(public readonly cont: string) {
    this.content = cont;
  }

  getFullContent(): string {
    return this.content;
  }
}

export class MarkdownFile extends File {
  content: string;
  frontmatter: string;

  constructor(
    readonly cont: string,
    readonly splitFrontmatter: boolean = true
  ) {
    super(cont);
    if (splitFrontmatter) {
      const {content: c, frontmatter: f} = MarkdownFile.splitFrontmatter(cont);
      this.frontmatter = f;
      this.content = c;
    } else {
      this.content = cont;
      this.frontmatter = '';
    }
  }

  getFullContent(): string {
    return MarkdownFile.joinFrontmatter(this.frontmatter, this.content);
  }

  static fileIsMarkdown(file: string) {
    return file.endsWith('.md');
  }

  static splitFrontmatter(content: string) {
    const parts = content.split('---');
    if (!content.startsWith('---') && parts.length !== 3) {
      return {frontmatter: '', content: content};
    }
    return {frontmatter: parts[1], content: parts[2]};
  }

  static joinFrontmatter(frontmatter: string, content: string) {
    return `---${frontmatter}---${content}`;
  }
}
