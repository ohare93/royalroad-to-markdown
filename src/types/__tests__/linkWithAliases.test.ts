import {ILinkWithAliases} from '../linkWithAliases';

describe('iLinkWithAliases class', () => {
  it('should with the constructor', () => {
    const link = new ILinkWithAliases('foo', ['bar', 'baz']);
    expect(link).toBeInstanceOf(ILinkWithAliases);
    expect(link.filename).toBe('foo');
    expect(link.aliases).toEqual(['bar', 'baz', 'foo']);
  });

  describe('should sort entries correctly', () => {
    test.each([
      [
        ['Alden', 'Alden Thorn', 'Samuel Alden Thorn'],
        ['Samuel Alden Thorn', 'Alden Thorn', 'Alden'],
      ],
      [
        ['Cook of the Moment', 'Cook', 'Moment'],
        ['Cook of the Moment', 'Moment', 'Cook'],
      ],
      [
        ['My best friend', 'Boe', 'Boe Lastname'],
        ['My best friend', 'Boe Lastname', 'Boe'],
      ],
    ])('should sort entries correctly', (unsortedArray, sortedArray) => {
      expect(unsortedArray.sort(ILinkWithAliases.sortByLeastOverlap)).toEqual(
        sortedArray
      );
    });
  });
});
