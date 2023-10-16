import {linkNameInText} from 'src/links/links';

describe('Link Name', () => {
  test.each([
    ['Alden', '[[Alden]]'],
    ['alden', '[[alden]]'],
    ['ALDEN', '[[ALDEN]]'],
    ['[[Alden]]', '[[Alden]]'],
    ['His name is Alden', 'His name is [[Alden]]'],
    ['Kind of Alden-like', 'Kind of [[Alden]]-like'],
    ['Alden at the start', '[[Alden]] at the start'],
    ['Aldenallinoneword', 'Aldenallinoneword'],
    ['WhatanameAldenis', 'WhatanameAldenis'],
  ])('A characters name', (startingText, expectedText) => {
    expect(linkNameInText(startingText, 'Alden')).toEqual(expectedText);
    expect(linkNameInText(startingText, 'alden')).toEqual(expectedText);
    expect(linkNameInText(startingText, 'ALDEN')).toEqual(expectedText);
  });

  test.each([
    [
      'My skill is called Cook of the Moment.',
      'My skill is called [[Cook of the Moment]].',
    ],
  ])('A Name with a space', (startingText, expectedText) => {
    expect(linkNameInText(startingText, 'Cook of the Moment')).toEqual(
      expectedText
    );
  });

  test.each([
    ['[[Samuel Alden Thorn]]', '[[Samuel Alden Thorn]]'],
    ['[[Alden Thorn]]', '[[Alden Thorn]]'],
  ])('Dont make links in links', (startingText, expectedText) => {
    expect(linkNameInText(startingText, 'Alden')).toEqual(expectedText);
  });
});

describe('Manual Aliases stay', () => {
  test.each([
    ['[A guy]([[Alden]])', '[A guy]([[Alden]])'],
    ['[Alden]([[Alden Thorn]])', '[Alden]([[Alden Thorn]])'],
  ])('A name with aliases', (startingText, expectedText) => {
    expect(linkNameInText(startingText, 'Alden')).toEqual(expectedText);
  });
});
