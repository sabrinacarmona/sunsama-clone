const { uuidV4 } = require('./ids');
const { NONE_KEY } = require('./keycodes');

// Build a hotkey entry from native code and modifier flags
function buildHotkeyEntry(nativeCode, modifiers = 0) {
  return {
    KeyCmd: !!(modifiers & 8),
    KeyCtrl: !!(modifiers & 2),
    KeyModifiers: modifiers,
    KeyOption: !!(modifiers & 4),
    KeyShift: !!(modifiers & 1),
    NativeCode: nativeCode,
    QTKeyCode: 0,
    VKeyCode: -1,
  };
}

// Hotkey action -- sends a keyboard shortcut
function hotkeyAction(title, imageRef, nativeCode, modifiers = 0) {
  return {
    ActionID: uuidV4(),
    LinkedTitle: true,
    Name: 'Hotkey',
    Settings: {
      Hotkeys: [buildHotkeyEntry(nativeCode, modifiers), NONE_KEY],
    },
    State: 0,
    States: [{ Title: title, Image: imageRef }],
    UUID: 'com.elgato.streamdeck.system.hotkey',
  };
}

// Text action -- types a string and presses Enter
function textAction(title, imageRef, sendText) {
  return {
    ActionID: uuidV4(),
    LinkedTitle: true,
    Name: 'Text',
    Settings: {
      PasteEnter: true,
      SendText: sendText,
    },
    State: 0,
    States: [{ Title: title, Image: imageRef }],
    UUID: 'com.elgato.streamdeck.system.text',
  };
}

// Open action -- launches an app or runs a .app bundle
function openAction(title, imageRef, appPath) {
  return {
    ActionID: uuidV4(),
    LinkedTitle: true,
    Name: 'Open',
    Settings: {
      openInBrowser: true,
      path: `"${appPath}"`,
    },
    State: 0,
    States: [{ Title: title, Image: imageRef }],
    UUID: 'com.elgato.streamdeck.system.open',
  };
}

// Website action -- opens a URL
function websiteAction(title, imageRef, url) {
  return {
    ActionID: uuidV4(),
    LinkedTitle: true,
    Name: 'Website',
    Settings: {
      openInBrowser: true,
      path: url,
    },
    State: 0,
    States: [{ Title: title, Image: imageRef }],
    UUID: 'com.elgato.streamdeck.system.website',
  };
}

// Volume action -- system volume encoder
function volumeAction(title, imageRef) {
  return {
    ActionID: uuidV4(),
    LinkedTitle: true,
    Name: 'Volume',
    Settings: {},
    State: 0,
    States: [{ Title: title, Image: imageRef }],
    UUID: 'com.elgato.streamdeck.system.volume',
  };
}

// Placeholder encoder hotkey (NativeCode 97, no modifiers)
function placeholderEncoderAction(title, imageRef) {
  return hotkeyAction(title, imageRef, 97, 0);
}

module.exports = {
  hotkeyAction,
  textAction,
  openAction,
  websiteAction,
  volumeAction,
  placeholderEncoderAction,
};
