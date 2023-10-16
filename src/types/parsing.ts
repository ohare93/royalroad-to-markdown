import {pathExists, pathToFiles} from 'src/helpers/files';
import {ILinkWithAliases} from './linkWithAliases';
import {MarkdownFile, getFile} from './files';

export interface IMakeLinksArguments {
  linkStrings?: string[];
  linkFromFiles?: string[];
  linkFromDirectory?: string;
  linkFromRecursive?: boolean;
  //linkfromexcludecontains?: string;
  //linkfromexcludepaths?: string[];
  //linkfromusealiases?: boolean;
  toLinkFiles?: string[];
  toLinkDirectory?: string;
  toLinkRecursive?: boolean;
  markdownExcludeFrontmatter?: boolean;
  help?: boolean;
}

export interface IParsedArgs {
  linksWithAliases: ILinkWithAliases[];
  toLinkFiles: string[];
  markdownExcludeFrontmatter: boolean;
}

export function parseArgs(args: IMakeLinksArguments): IParsedArgs {
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
  const linkFromRecursive = args.linkFromRecursive || false;

  const linksWithAliases: ILinkWithAliases[] = [];

  for (const linkString of linkStrings) {
    linksWithAliases.push(new ILinkWithAliases(linkString, []));
  }

  for (const linkFromFile of linkFromFiles) {
    if (!pathExists(linkFromFile))
      throw new Error(`File ${linkFromFile} does not exist.`);

    const linkWithAlias = fileToAliases(linkFromFile);
    if (linkWithAlias) linksWithAliases.push(linkWithAlias);
  }

  if (!pathExists(linkFromDirectory))
    throw new Error(`File ${linkFromDirectory} does not exist.`);

  for (const filename of pathToFiles(linkFromDirectory, linkFromRecursive)) {
    const linkWithAlias = fileToAliases(filename);
    if (linkWithAlias) linksWithAliases.push(linkWithAlias);
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

export function fileToAliases(filename: string): ILinkWithAliases | null {
  const file = getFile(filename, true);
  if (file.shouldSkipAutoLink()) return null;
  console.log(filename, file);
  return new ILinkWithAliases(file.filename, file.getAliases());
}
