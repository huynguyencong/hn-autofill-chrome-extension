# Quick Text Autofill Extension

A browser extension for Chrome and Edge that enables quick text entry through customizable shortcuts and intelligent text completion. Perfect for frequently used phrases, templates, or repetitive text entries.

## Features

- **Smart Text Completion**
  - Matches text as you type using shortcuts or word beginnings
  - Shows suggestions near your cursor position
  - Works anywhere in the text (not just at the end)
  - Case-insensitive matching

- **Two Ways to Trigger**
  1. **Shortcut Keys**: Type your defined shortcut to instantly show the full text
  2. **Word Matching**: Type the beginning of any saved sentence to see matching options

- **User-Friendly Interface**
  - Visual suggestion box that follows your cursor
  - Keyboard navigation with arrow keys
  - Quick selection with Tab key
  - Mouse click selection support
  - First suggestion automatically highlighted

- **Flexible Usage**
  - Works in any text input or textarea
  - Supports both Chrome and Edge browsers
  - Syncs your shortcuts across browser instances
  - Edit text at any cursor position

## Installation

1. **Download/Clone the Extension**
   ```bash
   git clone [repository-url]
   # or download and extract the ZIP file
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the extension folder

3. **Load in Edge**
   - Open Edge and go to `edge://extensions/`
   - Enable "Developer mode" on the left
   - Click "Load unpacked"
   - Select the extension folder

## How to Use

### Setting Up Shortcuts

1. Click the extension icon in your browser toolbar
2. Click "Add New Shortcut"
3. Enter:
   - **Key**: A short trigger text (e.g., `/hi`, `@sig`)
   - **Text**: The full text you want to insert
4. Changes are saved automatically

### Using the Extension

#### Method 1: Shortcut Keys
1. Type your defined shortcut key (e.g., `/hi`)
2. A suggestion box appears
3. Press Tab to insert the full text, or use arrow keys to choose if multiple matches

#### Method 2: Word Completion
1. Start typing the beginning of any saved text
2. After 2 characters, matching suggestions appear
3. Use:
   - ↑/↓ arrows to navigate suggestions
   - Tab to select highlighted suggestion
   - Mouse to click desired suggestion
   - Esc to dismiss suggestions

### Tips and Tricks

1. **Quick Selection**
   - The first matching suggestion is automatically highlighted
   - Just press Tab to select it immediately

2. **Mid-Text Editing**
   - Works anywhere in your text, not just at the end
   - Cursor position is maintained after insertion

3. **Multiple Matches**
   - If multiple texts match your input, use arrow keys to select
   - Mouse hover highlights different options

4. **Keyboard Shortcuts**
   - ↑/↓: Navigate through suggestions
   - Tab: Select highlighted suggestion
   - Esc: Close suggestion box

## Examples

### Sample Shortcuts
```
Key: /hi
Text: Hello, how are you today?

Key: @sig
Text: Best regards,
John Smith
Technical Lead

Key: /meet
Text: Would you be available for a quick meeting to discuss this?
```

### Word Completion Example
- Typing "Hel" might show "Hello, how are you today?"
- Typing "Best" might show "Best regards,..."
- Typing "Would" might show "Would you be available..."

## Privacy & Data

- All shortcuts are stored locally in your browser
- Data syncs across your browser instances (if sync is enabled)
- No data is sent to external servers
- Works offline

## Browser Support

- Google Chrome (v88+)
- Microsoft Edge (v88+)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

Copyright (c) 2025 Huy Nguyen Cong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.