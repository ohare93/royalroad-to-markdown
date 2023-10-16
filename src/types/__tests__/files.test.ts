import {File} from '../files';

describe('File', () => {
  it('constructor works', () => {
    const file = new File('test.txt', 'Blah blah what a text');
    expect(file.filename).toBe('test.txt');
    expect(file.content).toBe('Blah blah what a text');
  });

  it('should not skip auto link', () => {
    const file = new File('test.txt', 'Blah blah what a text');
    expect(file.shouldSkipAutoLink()).toBe(false);
  });

  test.each(['do-not-auto-link: true', 'blah blah\n\ndo-not-auto-link: true'])(
    'should not auto link',
    text => {
      const file = new File('test.txt', text);
      expect(file.shouldSkipAutoLink()).toBe(true);
    }
  );
});
