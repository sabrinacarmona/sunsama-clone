// Creates a blank Stream Deck+ page manifest
// Keypad: 4 columns x 2 rows = 8 buttons
// Encoder: 4 dials
function createPage() {
  return {
    Controllers: [
      { Actions: {}, Type: 'Keypad' },
      { Actions: {}, Type: 'Encoder' },
    ],
  };
}

// Set a button at (col, row) on the keypad controller
function setButton(page, col, row, action) {
  page.Controllers[0].Actions[`${col},${row}`] = action;
}

// Set an encoder action at index (0-3)
function setEncoder(page, index, action) {
  page.Controllers[1].Actions[`${index},0`] = action;
}

module.exports = { createPage, setButton, setEncoder };
