import * as fs from 'fs';

export function readFile(filename: string) {
  return fs.readFileSync(filename, {encoding: 'utf8'});
}

export function writeToFile(filename: string, data: string) {
  fs.writeFileSync(filename, data, {encoding: 'utf8', flag: 'w'});
}

export function pathExists(path: string) {
  return fs.existsSync(path);
}

export function createPathIfNotExists(path: string) {
  if (!pathExists(path)) {
    fs.mkdirSync(path, {recursive: true});
  }
}

export function pathToFiles(directory: string, recursive: boolean) {
  return fs
    .readdirSync(directory, {recursive})
    .map(file => `${directory}/${file}`);
}

export function fileIsMarkdown(file: string) {
  return file.endsWith('.md');
}

export function splitFrontmatter(content: string) {
  const parts = content.split('---');
  if (!content.startsWith('---') && parts.length !== 3) {
    return {content: content, frontmatter: ''};
  }
  return {content: parts[2], frontmatter: parts[1]};
}

export function joinFrontmatter(frontmatter: string, content: string) {
  return `---${frontmatter}---${content}`;
}
