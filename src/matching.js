/**
 * Matching logic for autofill shortcuts
 * This module contains pure functions for matching user input against shortcuts
 */

// Use IIFE to avoid polluting global scope while making functions available
(function(global) {
  'use strict';

  /**
   * Helper function to remove special characters for matching
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text (lowercase, alphanumeric and spaces only)
   */
  function normalizeText(text) {
    return text.replace(/[^a-z0-9\s]/gi, '').toLowerCase();
  }

  /**
   * Find matching shortcuts based on text input
   * @param {Array<{key: string, text: string}>} shortcuts - Array of shortcut objects
   * @param {string} text - Full text content
   * @param {number} cursorPosition - Current cursor position
   * @returns {Array<{key: string, text: string}>} - Array of matching shortcuts
   */
  function findMatchingShortcuts(shortcuts, text, cursorPosition) {
  // Get text before cursor
  const textBeforeCursor = text.substring(0, cursorPosition);
  
  // Get the last two words being typed
  const lastTwoWordsMatch = textBeforeCursor.match(/(?:[^\s]+\s+)?[^\s]*$/);
  const lastWords = lastTwoWordsMatch ? lastTwoWordsMatch[0].toLowerCase().trim() : '';
  const lastWord = lastWords.split(/\s+/).pop() || '';
  
  // Normalize text for matching (remove special characters)
  const normalizedLastWords = normalizeText(lastWords);
  const normalizedLastWord = normalizeText(lastWord);
  
  return shortcuts.filter(s => {
    // Check for exact shortcut key match before cursor
    let keyMatch = false;
    if (s.key.length == 1) {
      keyMatch = s.key.length > 0 && textBeforeCursor.endsWith(s.key);
    } else {
      keyMatch = lastWord.length >= 2 && s.key.toLowerCase().includes(normalizedLastWord);
    }
    
    // Check for matches in the sentence
    let textMatch = false;
    const normalizedSearchText = normalizeText(s.text);
    
    if (normalizedLastWords.length >= 2) {
      // 1. Beginning of sentence
      const startMatch = !normalizedLastWords.includes(' ')
        && normalizedLastWord.length >= 2
        && normalizedSearchText.startsWith(normalizedLastWord);
      
      // 2. Two consecutive words anywhere in the sentence
      const twoWordMatch = normalizedLastWords.includes(' ')
        && normalizedSearchText.includes(normalizedLastWords);
      
      textMatch = startMatch || twoWordMatch;
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

      abbreviationMatch = matchedLetters === normalizedLastWord;
    }
    
    return keyMatch || textMatch || abbreviationMatch;
  });
  }

  // Expose functions to global scope for browser
  if (typeof window !== 'undefined') {
    window.normalizeText = normalizeText;
    window.findMatchingShortcuts = findMatchingShortcuts;
  }

  // Export for CommonJS (Node.js/Jest)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      normalizeText,
      findMatchingShortcuts
    };
  }

})(typeof window !== 'undefined' ? window : global);
