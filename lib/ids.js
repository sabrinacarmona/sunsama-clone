const crypto = require('crypto');

// UUID v4 with dashes: "b2196ffd-b7d0-4530-8771-d8cfadc1ca8c"
function uuidV4() {
  return crypto.randomUUID();
}

// 32-char lowercase hex, no dashes. Used for the root .sdProfile folder name.
function profileRootId() {
  return crypto.randomUUID().replace(/-/g, '');
}

// 27-char uppercase alphanumeric ending in 'Z'. Used for page folder names.
// Character set: Crockford base32 (0-9, A-Z minus I, L, O, U)
const BASE32_CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function profileFolderId() {
  const bytes = crypto.randomBytes(17); // 17 bytes = 136 bits > 26*5=130 bits
  let result = '';
  for (let i = 0; i < 26; i++) {
    const idx = bytes[i] ? bytes[i] % 32 : 0;
    result += BASE32_CHARS[idx];
  }
  return result + 'Z';
}

// 26-char uppercase hex for image filenames.
function imageId() {
  return crypto.randomUUID().replace(/-/g, '').toUpperCase().slice(0, 26);
}

module.exports = { uuidV4, profileRootId, profileFolderId, imageId };
