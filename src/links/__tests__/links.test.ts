import {linkRegex} from 'src/links/links';

describe('Link Regex', () => {
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
    expect(linkRegex(startingText, 'Alden')).toEqual(expectedText);
    expect(linkRegex(startingText, 'alden')).toEqual(expectedText);
    expect(linkRegex(startingText, 'ALDEN')).toEqual(expectedText);
  });

  test.each([
    [
      'My skill is called Cook of the Moment.',
      'My skill is called [[Cook of the Moment]].',
    ],
  ])('A Name with a space', (startingText, expectedText) => {
    expect(linkRegex(startingText, 'Cook of the Moment')).toEqual(expectedText);
  });

  test.each([['Samuel Alden Thorn', '[Alden]([[Samuel Alden Thorn]])']])(
    'A name with aliases',
    (startingText, expectedText) => {
      expect(linkRegex(startingText, 'Samuel Alden Thorn', 'Alden')).toEqual(
        expectedText
      );
    }
  );
});
