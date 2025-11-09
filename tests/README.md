# Unit Tests for Autofill Extension

This directory contains unit tests for the autofill extension.

## Setup

1. Install dependencies:
```bash
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (automatically re-run on file changes):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

## Test Files

- `findMatchingShortcuts.test.js` - Tests for the `findMatchingShortcuts` function

## Test Coverage

The tests cover the following scenarios:

### Single Character Shortcut Key Matching
- Matching single character shortcuts at the end of text
- Cursor position handling for single character shortcuts

### Multi-Character Shortcut Key Matching
- Full shortcut key matching
- Partial shortcut key matching (minimum 2 characters)
- Cursor position in middle of text

### Text Prefix Matching
- Beginning of sentence matching (minimum 2 characters)
- Special character handling in input

### Two Consecutive Words Matching
- Matching at beginning, middle, and end of text
- Non-consecutive word filtering
- Special character normalization

### Abbreviation Matching
- 3+ letter abbreviations matching first letters of words
- Case-insensitive matching
- Common abbreviations (lmk, brb, omw, etc.)

### Edge Cases
- Empty text and shortcuts
- Whitespace-only text
- Special characters only
- Invalid cursor positions
- Multiple spaces, newlines, tabs
- Case sensitivity

## Adding New Tests

When adding new test cases:

1. Follow the existing test structure using `describe` and `test` blocks
2. Use descriptive test names that explain what is being tested
3. Include both positive and negative test cases
4. Test edge cases and boundary conditions
5. Keep tests focused on a single behavior
