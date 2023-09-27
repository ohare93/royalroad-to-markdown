const {RoyalRoadAPI} = require('@l1lly/royalroadl-api');
import * as fs from 'fs';
import {parse} from 'ts-command-line-args';
import {runAllHTMLReplacements} from './html';

const api = new RoyalRoadAPI();

interface Chapter {
  id: number;
  count: string;
  title: string;
  prenote: string;
  postnote: string;
  content: string;
  releaseDate: Date;
  url: string;
}

// Add bullet points for markdown
const addBullets = (html: string) => html.replace(/\n/g, '\n- ');

const formatChapter = (chapter: Chapter, withBullets: boolean) => {
  const bulletOrNot = withBullets ? '-' : '';
  const frontmatter = {
    //release: chapter.releaseDate.toISOString(),
    url: chapter.url,
    chaptertitle: chapter.title,
    order: chapter.count,
  };
  let content = `---\n`;
  Object.entries(frontmatter).forEach(
    ([key, value]) => (content += `${key}: ${value}\n`)
  );
  content += `---\n\n`;

  if (chapter.prenote) content += `${bulletOrNot} > ${chapter.prenote}\n`;

  content += `${bulletOrNot} ${chapter.content}\n`;

  if (chapter.postnote) content += `${bulletOrNot} > ${chapter.postnote}\n`;

  return content;
};

const escapeFilename = (filename: string) =>
  filename.replace(/[^a-z0-9 ]/gi, '');

const formatUrlString = (url: string) =>
  url
    .toLowerCase()
    .replace(/[ ]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .trim();

const writeToFile = (filename: string, data: string) =>
  fs.writeFileSync(filename, data, {encoding: 'utf8', flag: 'w'});

const getChapterUrl = (
  id: number,
  chapterTitle: string,
  fictionId: number,
  fictionName: string
) => {
  const name = formatUrlString(fictionName);
  const title = formatUrlString(chapterTitle);
  return `https://royalroad.com/fiction/${fictionId}/${name}/chapter/${id}/${title}`;
};

interface IDownloadRRArguments {
  id: number;
  name: string;
  all?: boolean;
  latest?: number;
  chapters?: number[];
  bullets?: boolean;
  overwrite?: boolean;
  help?: boolean;
}

export const args = parse<IDownloadRRArguments>(
  {
    id: Number,
    name: String,
    all: {type: Boolean, optional: true},
    latest: {type: Number, optional: true},
    chapters: {type: Number, multiple: true, optional: true},
    bullets: {type: Boolean, optional: true},
    overwrite: {type: Boolean, optional: true},
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

//console.log('Args:', args);

interface RRChapter {
  id: number;
  title: string;
  release: number;
  count: number;
}

(async () => {
  const {data: fic} = await api.fiction.getFiction(args.id);

  //console.log(`${fic.title} by ${fic.author}`, fic);

  const chapterToDownload: RRChapter[] = [];
  for (let i = 0; i < fic.chapters.length; i++) {
    if (
      args.all ||
      (args.chapters && args.chapters.includes(i + 1)) ||
      (args.latest && i + 1 > fic.chapters.length - args.latest)
    ) {
      chapterToDownload.push({
        id: fic.chapters[i].id,
        title: fic.chapters[i].title,
        release: fic.chapters[i].release,
        count: i + 1,
      });
    }
  }

  const dir = 'fictions/' + escapeFilename(args.name) + '/chapters';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }

  const chapters: Chapter[] = [];
  for (const chap of chapterToDownload) {
    const paddedCount = chap.count.toString().padStart(4, '0');
    const filename = escapeFilename(`${paddedCount} ${chap.title}`) + '.md';

    if (!args.overwrite && fs.existsSync(dir + '/' + filename)) {
      console.log(
        `Skipping ${filename} as already exists. Add --overwrite to change that`
      );
      continue;
    }

    const {data: chapterData} = await api.chapter.getChapter(chap.id);

    //console.log(chap, chapterData);

    const chapter: Chapter = {
      id: chap.id,
      count: paddedCount,
      title: chap.title,
      prenote: chapterData.preNote,
      postnote: chapterData.postNote,
      content: runAllHTMLReplacements(chapterData.content),
      releaseDate: new Date(chap.release as number),
      url: getChapterUrl(chap.id, chap.title, args.id, args.name),
    };
    chapters.push(chapter);

    if (!!args.bullets) chapter.content = addBullets(chapter.content);

    const content = formatChapter(chapter, !!args.bullets);
    writeToFile(dir + '/' + filename, content);
  }
  //console.log(chapters);
})().catch(console.error);
