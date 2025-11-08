// Create and inject the suggestion box
const suggestionBox = document.createElement('div');
suggestionBox.style.cssText = `
  position: fixed;
  display: none;
  max-height: 200px;
  overflow-y: auto;
  background: #ffffff;
  color: #000000;
  border: 1px solid #666666;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
`;
document.body.appendChild(suggestionBox);

let shortcuts = [];
let currentInput = null;
let selectedIndex = -1;

// Load shortcuts from storage
chrome.storage.sync.get(['shortcuts'], (result) => {
  shortcuts = result.shortcuts || [];
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.shortcuts) {
    shortcuts = changes.shortcuts.newValue;
  }
});

// Handle input events and cursor movement
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    handleInput(e.target);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    handleInput(e.target);
  }
});

document.addEventListener('keyup', (e) => {
  if ((e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') &&
      (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    handleInput(e.target);
  }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!suggestionBox.style.display || suggestionBox.style.display === 'none') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      navigateSuggestions('up');
      break;
    case 'ArrowDown':
      e.preventDefault();
      navigateSuggestions('down');
      break;
    case 'Tab':
      if (suggestionBox.children.length > 0) {
        e.preventDefault();
        applySuggestion();
      }
      break;
    case 'Escape':
      hideSuggestions();
      break;
  }
});

// Handle clicks outside the suggestion box
document.addEventListener('click', (e) => {
  if (e.target !== suggestionBox && !suggestionBox.contains(e.target)) {
    hideSuggestions();
  }
});

// Helper function to remove special characters for matching
function normalizeText(text) {
  return text.replace(/[^a-z0-9\s]/gi, '').toLowerCase();
}

function handleInput(inputElement) {
  currentInput = inputElement;
  const text = inputElement.value;
  const cursorPosition = inputElement.selectionStart;
  const rect = inputElement.getBoundingClientRect();
  
  // Get text before and after cursor
  const textBeforeCursor = text.substring(0, cursorPosition);
  
  // Get the last two words being typed
  const lastTwoWordsMatch = textBeforeCursor.match(/(?:[^\s]+\s+)?[^\s]*$/);
  const lastWords = lastTwoWordsMatch ? lastTwoWordsMatch[0].toLowerCase().trim() : '';
  const lastWord = lastWords.split(/\s+/).pop() || '';
  
  // Normalize text for matching (remove special characters)
  const normalizedLastWords = normalizeText(lastWords);
  const normalizedLastWord = normalizeText(lastWord);
  
  const matches = shortcuts.filter(s => {
    // Check for exact shortcut key match before cursor
    let keyMatch = false;
    if (s.key.length == 1) {
      keyMatch = s.key.length > 0 && textBeforeCursor.endsWith(s.key);
    } else {
      keyMatch = lastWord.length >= 2 && s.key.toLowerCase().startsWith(lastWord);
    }
    
    // Check for matches in the sentence
    let textMatch = false;
    const searchText = s.text.toLowerCase();
    const normalizedSearchText = normalizeText(s.text);
    
    if (normalizedLastWords.length >= 2) {
      // 1. Beginning of sentence
      const startMatch = normalizedSearchText.startsWith(normalizedLastWord);
      
      // 2. Two consecutive words anywhere in the sentence
      const twoWordMatch = normalizedLastWords.includes(' ') && normalizedSearchText.includes(normalizedLastWords);
      
      // 3. Single word match the prefix
      const singleWordMatch = !normalizedLastWords.includes(' ') 
        && normalizedLastWord.length >= 2 
        && normalizedSearchText.startsWith(normalizedLastWord);
      
      textMatch = startMatch || twoWordMatch || singleWordMatch;
    }

    // 4. Abbreviation match (e.g., "hbt" matches "Happy Birthday To you")
    let abbreviationMatch = false;
    if (normalizedLastWord.length >= 3 && !normalizedLastWords.includes(' ')) {
      const words = s.text.split(/\s+/);
      let letterIndex = 0;
      let matchedLetters = '';
      
      // Try to match input characters with first letters of words
      for (const word of words) {
        const normalizedWord = normalizeText(word);
        if (normalizedWord.length > 0 && letterIndex < normalizedLastWord.length && 
            normalizedWord.charAt(0) === normalizedLastWord[letterIndex]) {
          matchedLetters += normalizedWord.charAt(0);
          letterIndex++;
        }
      }
      
      // Also try matching consecutive characters from the start of any word
      const wordStartMatches = words.some(word => {
        const normalizedWord = normalizeText(word);
        const firstChars = normalizedWord.slice(0, normalizedLastWord.length);
        return firstChars === normalizedLastWord;
      });
      
      abbreviationMatch = matchedLetters === normalizedLastWord || wordStartMatches;
    }
    
    return keyMatch || textMatch || abbreviationMatch;
  });

  if (matches.length > 0) {
    // Position the suggestion box relative to cursor position
    const coords = getCaretCoordinates(inputElement);
    showSuggestions(matches, rect, coords);
  } else {
    hideSuggestions();
  }
}

// Helper function to get caret coordinates
function getCaretCoordinates(element) {
  const position = element.selectionStart;
  
  // Create a hidden div to measure text
  const div = document.createElement('div');
  div.style.cssText = `
    position: absolute;
    visibility: hidden;
    height: auto;
    width: auto;
    white-space: ${getComputedStyle(element).whiteSpace};
    font: ${getComputedStyle(element).font};
    padding: ${getComputedStyle(element).padding};
    border: ${getComputedStyle(element).border};
  `;
  
  // Create text nodes for content before caret
  const textContent = element.value.substring(0, position);
  const textNode = document.createTextNode(textContent);
  const span = document.createElement('span');
  span.appendChild(document.createTextNode(''));
  div.appendChild(textNode);
  div.appendChild(span);
  
  document.body.appendChild(div);
  const coords = {
    top: element.offsetTop + div.offsetHeight - element.scrollTop,
    left: element.offsetLeft + span.offsetLeft - element.scrollLeft
  };
  document.body.removeChild(div);
  
  return coords;
}

function showSuggestions(matches, rect, caretCoords) {
  suggestionBox.innerHTML = '';
  selectedIndex = 0; // Set to first option by default

  matches.forEach((match, index) => {
    const div = document.createElement('div');
    div.textContent = match.text;
    div.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      color: #000000;
      border-bottom: 1px solid #e5e5e5;
      transition: background-color 0.2s ease;
    `;
    
    div.addEventListener('click', () => {
      selectedIndex = index;
      applySuggestion();
    });
    
    div.addEventListener('mouseover', () => {
      selectedIndex = index;
      updateSelection();
    });
    
    suggestionBox.appendChild(div);
  });

  suggestionBox.style.display = 'block';
  updateSelection(); // Apply highlighting to the first option
  
  // Position relative to caret instead of input field
  const inputRect = currentInput.getBoundingClientRect();
  const left = inputRect.left + caretCoords.left;
  const top = inputRect.top + caretCoords.top + 20; // Add some spacing below cursor
  
  // Ensure suggestion box stays within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const boxWidth = Math.min(rect.width, 300); // Limit max width
  
  // Adjust horizontal position if it would overflow
  let finalLeft = Math.min(left, viewportWidth - boxWidth - 10);
  finalLeft = Math.max(10, finalLeft); // Keep some margin from left edge
  
  // Adjust vertical position if it would overflow
  let finalTop = top;
  if (top + 200 > viewportHeight) { // 200 is max-height of suggestion box
    finalTop = top - 220; // Position above the cursor
  }
  
  suggestionBox.style.left = finalLeft + 'px';
  suggestionBox.style.top = finalTop + window.scrollY + 'px';
  suggestionBox.style.width = boxWidth + 'px';
}

function hideSuggestions() {
  suggestionBox.style.display = 'none';
  selectedIndex = -1;
}

function navigateSuggestions(direction) {
  const suggestions = suggestionBox.children;
  if (suggestions.length === 0) return;

  if (direction === 'up') {
    selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
  } else {
    selectedIndex = selectedIndex >= suggestions.length - 1 ? 0 : selectedIndex + 1;
  }

  updateSelection();
}

function updateSelection() {
  Array.from(suggestionBox.children).forEach((div, index) => {
    if (index === selectedIndex) {
      div.style.backgroundColor = '#e8f0fe';
      div.style.color = '#1a73e8';
    } else {
      div.style.backgroundColor = '#ffffff';
      div.style.color = '#000000';
    }
  });
}

function applySuggestion() {
  if (!currentInput || selectedIndex === -1) return;

  const selectedText = suggestionBox.children[selectedIndex].textContent;
  const cursorPosition = currentInput.selectionStart;
  const currentText = currentInput.value;
  const textBeforeCursor = currentText.substring(0, cursorPosition);
  const textAfterCursor = currentText.substring(cursorPosition);
  
  // Check for shortcut key match first
  const lastMatch = shortcuts.find(s => textBeforeCursor.endsWith(s.key));
  
  let newText;
  let newCursorPosition;

  if (lastMatch) {
    // If it's a shortcut key match, replace the key with the full text
    const textBeforeKey = textBeforeCursor.slice(0, -lastMatch.key.length);
    newText = textBeforeKey + selectedText + textAfterCursor;
    newCursorPosition = textBeforeKey.length + selectedText.length;
  } else {
    // For prefix match, find and replace the last word
    const lastWordMatch = textBeforeCursor.match(/[^\s]*$/);
    const lastWordLength = lastWordMatch ? lastWordMatch[0].length : 0;
    const textBeforeWord = textBeforeCursor.slice(0, -lastWordLength);
    newText = textBeforeWord + selectedText + textAfterCursor;
    newCursorPosition = textBeforeWord.length + selectedText.length;
  }
  
  currentInput.value = newText;
  currentInput.setSelectionRange(newCursorPosition, newCursorPosition);
  currentInput.dispatchEvent(new Event('input', { bubbles: true }));
  hideSuggestions();
}