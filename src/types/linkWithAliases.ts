export class ILinkWithAliases {
  filename: string;
  aliases: string[]; // Including filename

  constructor(filename: string, aliases: string[]) {
    this.filename = filename;
    if (!aliases.includes(filename)) aliases.push(filename);
    this.aliases = aliases.sort(ILinkWithAliases.sortByLeastOverlap);
  }

  static sortByLeastOverlap(a: string, b: string) {
    if (a.includes(b)) return -1;
    if (b.includes(a)) return 1;
    return b.length - a.length;
  }
}
