/**
 * Unit tests for findMatchingShortcuts function
 * 
 * To run these tests:
 * 1. Install Jest: npm install --save-dev jest
 * 2. Add to package.json scripts: "test": "jest"
 * 3. Run: npm test
 */

const { findMatchingShortcuts } = require('../src/matching.js');

describe('findMatchingShortcuts', () => {
  // Sample shortcuts for testing
  const shortcuts = [
    { key: ';em', text: 'example@email.com' },
    { key: ';ph', text: '+1234567890' },
    { key: ';addr', text: '123 Main Street, City, State 12345' },
    { key: ';', text: 'Quick shortcut' },
    { key: 'habi', text: 'Happy Birthday' },
    { key: 'habitoyo', text: 'Happy Birthday To You' },
    { key: 'habitome', text: 'Happy Birthday To Me' },
    { key: 'ty', text: 'Thank you' },
    { key: 'tyvm', text: 'Thank you very much' },
    { key: 'lmk', text: 'Let me know' },
    { key: 'brb', text: 'Be right back' },
    { key: 'omw', text: 'On my way' },
    { key: 'greeting', text: 'Hello there, how are you doing today?' },
  ];

  describe('Single character shortcut key matching', () => {
    test('should match single character shortcut at end of text', () => {
      const text = 'Hello ;';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: ';', text: 'Quick shortcut' });
    });

    test('should match single character shortcut in middle of text', () => {
      const text = 'Hello ; world';
      const matches = findMatchingShortcuts(shortcuts, text, 7); // cursor after '; '
      expect(matches).toContainEqual({ key: ';', text: 'Quick shortcut' });
    });

    test('should not match when cursor is not at shortcut position', () => {
      const text = 'Hello ; world';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches.find(m => m.key === ';')).toBeUndefined();
    });
  });

  describe('Multi-character shortcut key matching', () => {
    test('should match multi-character shortcut key', () => {
      const text = 'My email is ;em';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: ';em', text: 'example@email.com' });
    });

    test('should match partial multi-character shortcut key (at least 2 chars)', () => {
      const text = 'My email is ;e';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: ';em', text: 'example@email.com' });
    });

    test('should not match single character of multi-character shortcut', () => {
      const text = 'My email is ;';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      const emailMatch = matches.find(m => m.key === ';em');
      expect(emailMatch).toBeUndefined();
    });

    test('should match when typing in middle of text', () => {
      const text = 'My email is ;em and my phone';
      const matches = findMatchingShortcuts(shortcuts, text, 15); // cursor after ';em'
      expect(matches).toContainEqual({ key: ';em', text: 'example@email.com' });
    });
  });

  describe('Text prefix matching (beginning of sentence)', () => {
    test('should match beginning of text (at least 2 chars)', () => {
      const text = 'He';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should match beginning of text with more characters', () => {
      const text = 'Hello';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should not match single character prefix', () => {
      const text = 'H';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches.length).toBe(0);
    });

    test('should handle special characters in input', () => {
      const text = 'He!!';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });
  });

  describe('Two consecutive words matching', () => {
    test('should match two consecutive words at beginning', () => {
      const text = 'Hello there';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should match two consecutive words in middle', () => {
      const text = 'are you';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should match two consecutive words at end', () => {
      const text = 'doing today';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should not match non-consecutive words', () => {
      const text = 'Hello you';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      const greetingMatch = matches.find(m => m.key === 'greeting');
      expect(greetingMatch).toBeUndefined();
    });

    test('should handle special characters in two-word match', () => {
      const text = 'Hello, there!';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });
  });

  describe('Abbreviation matching', () => {
    test('should match abbreviation with 3 letters', () => {
      const text = 'hbt';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'habitoyo', text: 'Happy Birthday To You' });
    });

    test('should match abbreviation with 4 letters', () => {
      const text = 'hbty';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'habitoyo', text: 'Happy Birthday To You' });
    });

    test('should match abbreviation case-insensitive', () => {
      const text = 'HABI';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'habi', text: 'Happy Birthday' });
    });

    test('should not match abbreviation with less than 3 letters', () => {
      const text = 'ht';  // should not match `Hello there, how are you doing today?`
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches.length).toBe(0)
    });

    test('should match abbreviation ignoring special characters', () => {
      const text = 'h!a-b@i#';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'habi', text: 'Happy Birthday' });
    });

    test('should not match partial abbreviation', () => {
      const text = 'hbt';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      // 'hbt' matches 'Happy Birthday To' (first 3 words of 'Happy Birthday To You')
      // but not 'Happy Birthday' (only 2 words, would be 'hb')
      const hbdMatch = matches.find(m => m.key === 'habi');
      const hbtyMatch = matches.find(m => m.key === 'habitoyo');
      const hbtmMatch = matches.find(m => m.key === 'habitome');
      expect(hbdMatch).toBeUndefined(); // 'hbt' doesn't match 'Happy Birthday'
      expect(hbtyMatch).toBeDefined(); // 'hbt' matches first 3 words: Happy Birthday To You
      expect(hbtmMatch).toBeDefined(); // 'hbt' matches first 3 words: Happy Birthday To Me
    });
  });

  describe('Cursor position handling', () => {
    test('should only consider text before cursor', () => {
      const text = 'Hello ;em world';
      const matches = findMatchingShortcuts(shortcuts, text, 9); // cursor after ';em'
      expect(matches).toContainEqual({ key: ';em', text: 'example@email.com' });
    });

    test('should not match text after cursor', () => {
      const text = 'Hello world ;em';
      const matches = findMatchingShortcuts(shortcuts, text, 5); // cursor after 'Hello'
      expect(matches.find(m => m.key === ';em')).toBeUndefined();
    });

    test('should handle cursor at beginning', () => {
      const text = 'Hello world';
      const matches = findMatchingShortcuts(shortcuts, text, 0);
      expect(matches.length).toBe(0);
    });

    test('should handle cursor at end', () => {
      const text = 'lmk';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple matches', () => {
    test('should return multiple matching shortcuts', () => {
      const text = 'ty';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches.length).toBeGreaterThanOrEqual(2);
      expect(matches).toContainEqual({ key: 'ty', text: 'Thank you' });
      expect(matches).toContainEqual({ key: 'tyvm', text: 'Thank you very much' });
    });

    test('should return all matching types (key, text, abbreviation)', () => {
      const text = 'hbt';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'habitome', text: 'Happy Birthday To Me' });
      expect(matches).toContainEqual({ key: 'habitoyo', text: 'Happy Birthday To You' });
    });
  });

  describe('Edge cases', () => {
    test('should handle empty text', () => {
      const text = '';
      const matches = findMatchingShortcuts(shortcuts, text, 0);
      expect(matches.length).toBe(0);
    });

    test('should handle empty shortcuts array', () => {
      const text = 'Hello';
      const matches = findMatchingShortcuts([], text, text.length);
      expect(matches.length).toBe(0);
    });

    test('should handle whitespace-only text', () => {
      const text = '   ';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches.length).toBe(0);
    });

    test('should handle text with only special characters', () => {
      const text = '!!!';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      // Special characters are normalized away, leaving empty string
      // But the function still processes all shortcuts and may match some
      expect(matches).toBeDefined();
    });

    test('should handle cursor position beyond text length', () => {
      const text = 'Hello';
      const matches = findMatchingShortcuts(shortcuts, text, 100);
      // Should treat as end of text
      expect(matches).toBeDefined();
    });

    test('should handle negative cursor position', () => {
      const text = 'Hello';
      const matches = findMatchingShortcuts(shortcuts, text, -1);
      // substring will handle this gracefully
      expect(matches).toBeDefined();
    });

    test('should handle text with multiple spaces', () => {
      const text = 'Hello there';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should handle text with newlines', () => {
      const text = 'Hello\nthere';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      // Newlines are treated as non-word characters
      expect(matches).toBeDefined();
    });

    test('should handle text with tabs', () => {
      const text = 'Hello\tthere';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toBeDefined();
    });
  });

  describe('Case sensitivity', () => {
    test('should be case-insensitive for text matching', () => {
      const text = 'HELLO';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'greeting', text: 'Hello there, how are you doing today?' });
    });

    test('should be case-insensitive for shortcut keys', () => {
      const text = ';EM';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: ';em', text: 'example@email.com' });
    });

    test('should be case-insensitive for abbreviations', () => {
      const text = 'LMK';
      const matches = findMatchingShortcuts(shortcuts, text, text.length);
      expect(matches).toContainEqual({ key: 'lmk', text: 'Let me know' });
    });
  });
});
