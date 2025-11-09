# Architecture

## Module Structure

### `src/matching.js`
Contains the pure matching logic for finding shortcuts based on user input.

**Functions:**
- `normalizeText(text)` - Removes special characters and converts to lowercase
- `findMatchingShortcuts(shortcuts, text, cursorPosition)` - Finds matching shortcuts

**Exports:**
- **Browser (Chrome Extension)**: Functions are exposed to `window` object and available globally
- **Node.js (Tests)**: Functions are exported via `module.exports` for CommonJS

### `src/content.js`
Main content script that handles DOM manipulation and user interactions.

**Dependencies:**
- Requires `matching.js` to be loaded first (via manifest.json)
- Uses `normalizeText` and `findMatchingShortcuts` from global scope

### `tests/findMatchingShortcuts.test.js`
Unit tests for the matching logic.

**Dependencies:**
- Imports functions from `matching.js` using CommonJS `require()`

## Loading Order

The `manifest.json` specifies the loading order:
```json
"content_scripts": [{
  "js": ["matching.js", "content.js"]
}]
```

1. `matching.js` loads first and exposes functions to `window`
2. `content.js` loads second and uses the global functions

## Why This Approach?

Chrome extensions with Manifest V3 don't support ES6 modules (`import/export`) in content scripts. Instead, we use:

1. **IIFE (Immediately Invoked Function Expression)** to encapsulate code
2. **Global scope exposure** for browser environment (`window.functionName`)
3. **CommonJS exports** for Node.js test environment (`module.exports`)

This allows the same code to work in both environments without duplication.
