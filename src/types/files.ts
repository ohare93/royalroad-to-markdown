import {readFile} from 'src/helpers/files';
import Path from 'path';

export function getFile(filepath: string, splitFrontmatter: boolean): File {
  const filename = Path.parse(filepath).name;
  const content = readFile(filepath);
  const isMarkdown = MarkdownFile.fileIsMarkdown(filepath);

  return isMarkdown
    ? new MarkdownFile(filename, content, splitFrontmatter)
    : new File(filename, content);
}

export class File {
  constructor(
    public readonly filename: string,
    public content: string
  ) {}

  shouldSkipAutoLink(): boolean {
    return this.getFullContent().includes('do-not-auto-link: true');
  }

  getFullContent(): string {
    return this.content;
  }

  getAliases(): string[] {
    return [];
  }
}

export interface IMarkdownRelevantFrontmatterKeys {
  aliases?: string[];
}

export class MarkdownFile extends File {
  public frontmatter: string;

  constructor(
    public readonly filename: string,
    public content: string,
    private readonly splitFrontmatter: boolean = true
  ) {
    super(filename, content);
    if (splitFrontmatter) {
      const {content: c, frontmatter: f} =
        MarkdownFile.splitFrontmatter(content);
      this.frontmatter = f;
      this.content = c;
    } else {
      this.content = content;
      this.frontmatter = '';
    }
  }

  getFullContent(): string {
    return MarkdownFile.joinFrontmatter(this.frontmatter, this.content);
  }

  getAliases(): string[] {
    const aliases = this.getFullContent().match(/[\^\n]alias:{1,2}([^\n]*)/);
    if (!aliases) return [];
    return aliases[1]?.split(',')?.map(alias => alias.trim()) ?? [];
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
