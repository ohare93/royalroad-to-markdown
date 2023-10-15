import {
  fileIsMarkdown,
  joinFrontmatter,
  pathExists,
  pathToFiles,
  readFile,
  splitFrontmatter,
  writeToFile,
} from '../helpers/files';

export interface IMakeLinksArguments {
  linkStrings?: string[];
  linkFromFiles?: string[];
  linkFromDirectory?: string;
  //linkfromrecursive?: string;
  //linkfromexcludecontains?: string;
  //linkfromexcludepaths?: string[];
  //linkfromusealiases?: boolean;
  toLinkFiles?: string[];
  toLinkDirectory?: string;
  toLinkRecursive?: boolean;
  markdownExcludeFrontmatter?: boolean;
  help?: boolean;
}

export class ILinkWithAliases {
  filename: string;
  aliases: string[]; // Including filename

  constructor(filename: string, aliases: string[]) {
    this.filename = filename;
    if (!aliases.includes(filename)) aliases.push(filename);
    this.aliases = aliases.sort(this.sortByLeastOverlap);
  }

  sortByLeastOverlap(a: string, b: string) {
    if (a.includes(b)) return -1;
    if (b.includes(a)) return 1;
    return a.length - b.length;
  }
}

export function parseArgs(args: IMakeLinksArguments) {
  if (
    !args.linkFromDirectory &&
    !args.linkFromFiles?.length &&
    !args.linkStrings?.length
  ) {
    throw new Error(
      'You must specify links to make: as strings, file paths, or a directory of files'
    );
  }
  if (!args.toLinkDirectory && !args.toLinkFiles?.length) {
    throw new Error(
      'You must specify files to create the links in: as file paths or a directory of files.'
    );
  }

  const linkStrings = args.linkStrings || [];
  const linkFromFiles = args.linkFromFiles || [];
  const linkFromDirectory = args.linkFromDirectory || '';

  const linksWithAliases: ILinkWithAliases[] = [];

  for (const linkString of linkStrings) {
    linksWithAliases.push(new ILinkWithAliases(linkString, []));
  }

  let toLinkFiles = args.toLinkFiles || [];
  const toLinkDirectory = args.toLinkDirectory || '';
  const toLinkRecursive = args.toLinkRecursive || false;
  const markdownExcludeFrontmatter = args.markdownExcludeFrontmatter || true;

  toLinkFiles.forEach(filename => {
    if (!pathExists(filename))
      throw new Error(`File ${filename} does not exist.`);
  });

  if (toLinkDirectory) {
    if (!pathExists(toLinkDirectory))
      throw new Error(`Directory ${toLinkDirectory} does not exist.`);

    toLinkFiles = toLinkFiles.concat(
      pathToFiles(toLinkDirectory, toLinkRecursive)
    );
  }

  return {linksWithAliases, toLinkFiles, markdownExcludeFrontmatter};
}

export function makeLinks(args: IMakeLinksArguments) {
  const {linksWithAliases, toLinkFiles, markdownExcludeFrontmatter} =
    parseArgs(args);

  for (const filename of toLinkFiles) {
    console.log(`Making Links for ${filename}`);

    updateFile(filename, linksWithAliases, markdownExcludeFrontmatter);
  }
}

export function updateFile(
  filename: string,
  linksWithAliases: ILinkWithAliases[],
  excludeFrontmatter: boolean
) {
  const fileContent = readFile(filename);
  const isMarkdown = fileIsMarkdown(filename);

  let {content, frontmatter} =
    excludeFrontmatter && isMarkdown
      ? splitFrontmatter(fileContent)
      : {content: fileContent, frontmatter: ''};

  for (const linkWithAliases of linksWithAliases) {
    for (const linkString of linkWithAliases.aliases) {
      content = linkRegex(content, linkString, linkWithAliases.filename);
    }
  }

  if (isMarkdown) {
    content = joinFrontmatter(frontmatter, content);
  }

  writeToFile(filename, content);
}

export function linkRegex(
  text: string,
  linkString: string,
  nameToLinkTo: string | null = null
) {
  if (nameToLinkTo == null) nameToLinkTo = linkString;
  const isAlias = nameToLinkTo !== linkString;
  return text.replace(
    new RegExp('(?<!\\w)(\\[\\[)?(' + linkString + ')(\\]\\])?(?!\\w)', 'gi'),
    isAlias ? `[${nameToLinkTo}]([[$2]])` : '[[$2]]'
  );
}
