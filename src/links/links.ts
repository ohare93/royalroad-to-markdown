import {writeToFile} from 'src/helpers/files';
import {getFile} from 'src/types/files';
import {ILinkWithAliases} from 'src/types/linkWithAliases';
import {IParsedArgs} from 'src/types/parsing';

export function makeLinksInFiles(args: IParsedArgs) {
  const {linksWithAliases, toLinkFiles, markdownExcludeFrontmatter} = args;

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
  const file = getFile(filename, excludeFrontmatter);

  file.content = updateFileContent(file.content, linksWithAliases);

  writeToFile(filename, file.getFullContent());
}

export function updateFileContent(
  content: string,
  linksWithAliases: ILinkWithAliases[]
) {
  for (const linkWithAliases of linksWithAliases) {
    for (const linkString of linkWithAliases.aliases) {
      content =
        linkString == linkWithAliases.filename
          ? linkNameInText(content, linkString)
          : linkAliasInText(content, linkString, linkWithAliases.filename);
    }
  }

  return content;
}

export function linkNameInText(text: string, linkString: string) {
  return text.replace(
    new RegExp(String.raw`(?<!\[\[)\b(${linkString})\b(?![\w\s]*\]\])`, 'gi'),
    '[[$1]]'
  );
}

export function linkAliasInText(
  text: string,
  linkString: string,
  nameToLinkTo: string
) {
  return text.replace(
    new RegExp(String.raw`(?<!\[)\b(${linkString})\b(?!\]\(\[\[)`, 'gi'),
    `[${nameToLinkTo}]([[$1]])`
  );
}
