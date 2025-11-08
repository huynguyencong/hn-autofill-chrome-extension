document.addEventListener('DOMContentLoaded', () => {
  loadShortcuts();
  document.getElementById('add-shortcut').addEventListener('click', addShortcutEntry);
});

function loadShortcuts() {
  chrome.storage.sync.get(['shortcuts'], (result) => {
    const shortcuts = result.shortcuts || [];
    const container = document.getElementById('shortcuts-container');
    container.innerHTML = '';
    
    shortcuts.forEach((shortcut, index) => {
      container.appendChild(createShortcutEntry(shortcut.key, shortcut.text, index));
    });
  });
}

function createShortcutEntry(key = '', text = '', index) {
  const div = document.createElement('div');
  div.className = 'shortcut-entry';
  
  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.placeholder = 'Shortcut key';
  keyInput.value = key;
  keyInput.className = 'key-input';
  
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Text to insert';
  textInput.value = text;
  textInput.className = 'text-input';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = () => deleteShortcut(index);
  
  [keyInput, textInput].forEach(input => {
    input.addEventListener('input', () => saveShortcuts());
  });
  
  div.appendChild(keyInput);
  div.appendChild(textInput);
  div.appendChild(deleteBtn);
  return div;
}

function addShortcutEntry() {
  const container = document.getElementById('shortcuts-container');
  const index = container.children.length;
  container.appendChild(createShortcutEntry('', '', index));
  saveShortcuts();
}

function deleteShortcut(index) {
  const container = document.getElementById('shortcuts-container');
  container.children[index].remove();
  saveShortcuts();
}

function saveShortcuts() {
  const container = document.getElementById('shortcuts-container');
  const shortcuts = Array.from(container.children).map(div => ({
    key: div.children[0].value,
    text: div.children[1].value
  })).filter(shortcut => shortcut.key && shortcut.text);
  
  chrome.storage.sync.set({ shortcuts });
}