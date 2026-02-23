// macOS NativeCode values for keyboard events
const MAC_KEYS = {
  // Letters
  a: 0, s: 1, d: 2, f: 3, h: 4, g: 5, z: 6, x: 7,
  c: 8, v: 9, b: 11, q: 12, w: 13, e: 14, r: 15,
  y: 16, t: 17, o: 31, u: 32, i: 34, p: 35, l: 37,
  j: 38, k: 40, n: 45, m: 46,
  // Numbers
  '1': 18, '2': 19, '3': 20, '4': 21, '5': 23, '6': 22,
  '7': 26, '8': 28, '9': 25, '0': 29,
  // Symbols
  '=': 24, '-': 27, ',': 43, '.': 47, '/': 44,
  '[': 33, ']': 30, '\\': 42, ';': 41, "'": 39,
  '`': 50,
  // Special keys
  return: 36, tab: 48, space: 49, delete: 51, escape: 53,
  // Arrow keys
  left: 123, right: 124, up: 126, down: 125,
  // Function keys
  f1: 122, f2: 120, f3: 99, f4: 118, f5: 96, f6: 97,
  f7: 98, f8: 100, f9: 101, f10: 109, f11: 103, f12: 111,
  f13: 105, f14: 107, f15: 113,
  // Media/special
  volumeDown: 122, // Same as F1 on some keyboards
  eject: 53, // Maps to escape on modern Macs
};

// Modifier bitmask (bitwise OR to combine)
const MODS = {
  SHIFT: 1,
  CTRL: 2,
  OPT: 4,
  CMD: 8,
};

// No-key sentinel used as padding in Hotkeys arrays
const NONE_KEY = {
  KeyCmd: false,
  KeyCtrl: false,
  KeyModifiers: 0,
  KeyOption: false,
  KeyShift: false,
  NativeCode: 146,
  QTKeyCode: 33554431,
  VKeyCode: -1,
};

module.exports = { MAC_KEYS, MODS, NONE_KEY };
