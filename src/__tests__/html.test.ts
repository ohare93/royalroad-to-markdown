import {
  boldToMarkdown,
  escapeMarkdownCharacters,
  fixSpacing,
  fixSymbols,
  italicsToMarkdown,
  linksToMarkdown,
  makeHiddenPartsVisible,
  removeHTMLTags,
  runAllHTMLReplacements,
} from 'src/html';

describe('Escape markdown characters', () => {
  test.each([
    [`It's a star: *`, `It's a star: \\*`],
    [`It's an underscore: _`, `It's an underscore: \\_`],
    [`Let's goooo *****_____`, `Let's goooo \\*\\*\\*\\*\\*\\_\\_\\_\\_\\_`],
    [`<span style="italic">*</span>`, `<span style="italic">\\*</span>`],
  ])('test', (startingText, expectedText) => {
    expect(escapeMarkdownCharacters(startingText)).toEqual(expectedText);
  });
});

describe('italics removal', () => {
  test.each([
    [
      `This is <span style="font-style: italic">italics</span> on a line.`,
      `This is *italics* on a line.`,
    ],
    [`This is <em>italics</em>`, `This is *italics*`],
    [
      `Fix spacing<span style="font-style: italic"> excellent </span>here`,
      `Fix spacing *excellent* here`,
    ],
    [
      `Useless italics<em> </em>on a space:<span style="font-style: italic"> </span>`,
      `Useless italics on a space: `,
    ],
    [
      `Don't replace span without <span style="bold">italics</span>`,
      `Don't replace span without <span style="bold">italics</span>`,
    ],
  ])('test', (startingText, expectedText) => {
    expect(italicsToMarkdown(startingText)).toEqual(expectedText);
  });
});

describe('bold removal', () => {
  test.each([
    [
      `This is <span style="font-weight: bold">bold</span> on a line.`,
      `This is **bold** on a line.`,
    ],
    [`This is <strong>bold</strong>`, `This is **bold**`],
    [
      `Fix spacing<span style="font-style: bold"> excellent </span>here`,
      `Fix spacing **excellent** here`,
    ],
    [
      `Useless bold<strong> </strong>on a space:<span style="font-style: bold"> </span>`,
      `Useless bold on a space: `,
    ],
    [
      `Don't replace span without <span style="italics">bold</span>`,
      `Don't replace span without <span style="italics">bold</span>`,
    ],
  ])('test', (startingText, expectedText) => {
    expect(boldToMarkdown(startingText)).toEqual(expectedText);
  });
});

describe('links to markdown', () => {
  test.each([
    [
      `This is a link to <a href="https://www.google.com">Google</a>`,
      `This is a link to [Google](https://www.google.com)`,
    ],
  ])('test', (startingText, expectedText) => {
    expect(linksToMarkdown(startingText)).toEqual(expectedText);
  });
});

describe('Make hidden parts visible', () => {
  test.each([
    [
      `<span style="display: none">This is a hidden part</span>`,
      `#hidden
> This is a hidden part</span>`,
    ],
  ])('test', (startingText, expectedText) => {
    expect(makeHiddenPartsVisible(startingText)).toEqual(expectedText);
  });
});

describe('Fix spacing', () => {
  test.each([
    [
      `Line 1



Line 2`,
      `Line 1
Line 2`,
    ],
    [`<div>   <div>`, ``],
    [
      `<div>
<div>test`,
      `test`,
    ],
    [`<span><span></span></span>`, ``],
    [`<br>`, `\n`],
  ])('test', (startingText, expectedText) => {
    expect(fixSpacing(startingText)).toEqual(expectedText);
  });
});

describe('Remove HTML tags', () => {
  test.each([
    [
      `This is a <b>bold</b> <i>italic</i> <a href="https://www.google.com">link</a>`,
      `This is a bold italic link`,
    ],
  ])('test', (startingText, expectedText) => {
    expect(removeHTMLTags(startingText)).toEqual(expectedText);
  });
});

describe('Fix symbols', () => {
  test.each([[`Symbols:&nbsp;&lt;&gt;`, `Symbols: <>`]])(
    'test',
    (startingText, expectedText) => {
      expect(fixSymbols(startingText)).toEqual(expectedText);
    }
  );
});

describe('Run All HTML replacements', () => {
  test.each([
    [
      `<div>
<div>
<div>
A link <a href="https://www.unittest.com/awards">this test</a>
<em>Test</em> <strong>words</strong> with many symbols:&nbsp;&lt;&gt;
*HELLO* it_is_me <span style="font-style: italic; font-family: &quot;Open Sans&quot;, sans-serif">*</span>
</div>




</div>
<span style="display: none">Secret message</span>
</div>`,
      `

A link [this test](https://www.unittest.com/awards)
*Test* **words** with many symbols: <>
\\*HELLO\\* it\\_is\\_me *\\**

#hidden
> Secret message
`,
    ],
  ])('test', (startingText, expectedText) => {
    expect(runAllHTMLReplacements(startingText)).toEqual(expectedText);
  });
});
