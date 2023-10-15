import {parse} from 'ts-command-line-args';
import {IMakeLinksArguments, makeLinks} from './links/links';

export const args = parse<IMakeLinksArguments>(
  {
    linkStrings: {type: String, multiple: true, optional: true},
    linkFromFiles: {type: String, multiple: true, optional: true},
    linkFromDirectory: {type: String, optional: true},
    toLinkFiles: {type: String, multiple: true, optional: true},
    toLinkDirectory: {type: String, optional: true},
    toLinkRecursive: {type: Boolean, optional: true},
    markdownExcludeFrontmatter: {type: Boolean, optional: true},
    help: {
      type: Boolean,
      optional: true,
      alias: 'h',
      description: 'Prints this usage guide',
    },
  },
  {
    helpArg: 'help',
  }
);

makeLinks(args);