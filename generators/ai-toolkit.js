const { uuidV4, profileFolderId, imageId } = require('../lib/ids');
const { MAC_KEYS, MODS } = require('../lib/keycodes');
const {
  hotkeyAction,
  textAction,
  openAction,
  websiteAction,
  volumeAction,
  placeholderEncoderAction,
} = require('../lib/actions');
const { createPage, setButton, setEncoder } = require('../lib/profile');
const { renderIcon } = require('../lib/icons');

// ── Helpers ─────────────────────────────────────────────────────────────────

const CMD = MODS.CMD;
const SHIFT = MODS.SHIFT;
const CTRL = MODS.CTRL;
const OPT = MODS.OPT;

// Render an icon and return { ref, id, buffer }
async function icon(symbol, palette, label) {
  const id = imageId();
  const buffer = await renderIcon(symbol, palette, label);
  return { ref: `Images/${id}.png`, id, buffer };
}

// Build a page with buttons, encoders, and collected images
async function buildPage(palette, buttons, encoders) {
  const page = createPage();
  const images = new Map();

  // Wire buttons (4 columns x 2 rows)
  for (const btn of buttons) {
    const ic = await icon(btn.symbol, palette, btn.label);
    images.set(ic.id, ic.buffer);

    let action;
    switch (btn.type) {
      case 'hotkey':
        action = hotkeyAction(btn.title, ic.ref, btn.nativeCode, btn.mods);
        break;
      case 'text':
        action = textAction(btn.title, ic.ref, btn.sendText);
        break;
      case 'open':
        action = openAction(btn.title, ic.ref, btn.path);
        break;
      case 'website':
        action = websiteAction(btn.title, ic.ref, btn.url);
        break;
    }
    setButton(page, btn.col, btn.row, action);
  }

  // Wire encoders (4 dials)
  for (const enc of encoders) {
    const ic = await icon(enc.symbol, palette, enc.label);
    images.set(ic.id, ic.buffer);

    let action;
    if (enc.type === 'volume') {
      action = volumeAction(enc.title, ic.ref);
    } else {
      action = placeholderEncoderAction(enc.title, ic.ref);
    }
    setEncoder(page, enc.index, action);
  }

  return {
    uuid: uuidV4(),
    folderId: profileFolderId(),
    manifest: page,
    images,
  };
}

// ── Page Definitions ────────────────────────────────────────────────────────

async function generateAIToolkit() {
  const pages = [];

  // ── Page 1: Claude Code ───────────────────────────────────────────────
  pages.push(
    await buildPage('claudeCode', [
      { col: 0, row: 0, symbol: 'terminal',  label: 'Claude Code', title: 'Claude Code',
        type: 'open', path: '/usr/local/bin/claude' },
      { col: 1, row: 0, symbol: 'slash',     label: '/clear',      title: '/clear',
        type: 'text', sendText: '/clear' },
      { col: 2, row: 0, symbol: 'compact',   label: '/compact',    title: '/compact',
        type: 'text', sendText: '/compact' },
      { col: 3, row: 0, symbol: 'resume',    label: '/resume',     title: '/resume',
        type: 'text', sendText: '/resume' },
      { col: 0, row: 1, symbol: 'status',    label: '/status',     title: '/status',
        type: 'text', sendText: '/status' },
      { col: 1, row: 1, symbol: 'cost',      label: '/cost',       title: '/cost',
        type: 'text', sendText: '/cost' },
      { col: 2, row: 1, symbol: 'context',   label: '/context',    title: '/context',
        type: 'text', sendText: '/context' },
      { col: 3, row: 1, symbol: 'yolo',      label: 'YOLO',        title: 'YOLO',
        type: 'text', sendText: '/config set autoApprove all' },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume',    title: 'Volume',    type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',     title: 'Pages',     type: 'placeholder' },
      { index: 2, symbol: 'font',   label: 'Font Size', title: 'Font Size', type: 'placeholder' },
      { index: 3, symbol: 'scroll', label: 'Scroll',    title: 'Scroll',    type: 'placeholder' },
    ])
  );

  // ── Page 2: Claude Code Extended ──────────────────────────────────────
  pages.push(
    await buildPage('claudeCode', [
      { col: 0, row: 0, symbol: 'model',       label: '/model',       title: '/model',
        type: 'text', sendText: '/model' },
      { col: 1, row: 0, symbol: 'config',      label: '/config',      title: '/config',
        type: 'text', sendText: '/config' },
      { col: 2, row: 0, symbol: 'help',        label: '/help',        title: '/help',
        type: 'text', sendText: '/help' },
      { col: 3, row: 0, symbol: 'permissions', label: '/permissions', title: '/permissions',
        type: 'text', sendText: '/permissions' },
      { col: 0, row: 1, symbol: 'init',        label: '/init',        title: '/init',
        type: 'text', sendText: '/init' },
      { col: 1, row: 1, symbol: 'login',       label: '/login',       title: '/login',
        type: 'text', sendText: '/login' },
      { col: 2, row: 1, symbol: 'memory',      label: '/memory',      title: '/memory',
        type: 'text', sendText: '/memory' },
      { col: 3, row: 1, symbol: 'vim',         label: '/vim',         title: '/vim',
        type: 'text', sendText: '/vim' },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume',    title: 'Volume',    type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',     title: 'Pages',     type: 'placeholder' },
      { index: 2, symbol: 'font',   label: 'Font Size', title: 'Font Size', type: 'placeholder' },
      { index: 3, symbol: 'scroll', label: 'Scroll',    title: 'Scroll',    type: 'placeholder' },
    ])
  );

  // ── Page 3: Claude Desktop ────────────────────────────────────────────
  pages.push(
    await buildPage('claudeDesktop', [
      { col: 0, row: 0, symbol: 'appLaunch', label: 'Claude',        title: 'Claude',
        type: 'open', path: '/Applications/Claude.app' },
      { col: 1, row: 0, symbol: 'newChat',   label: 'New Chat',      title: 'New Chat',
        type: 'hotkey', nativeCode: MAC_KEYS.n, mods: CMD },
      { col: 2, row: 0, symbol: 'search',    label: 'Search',        title: 'Search',
        type: 'hotkey', nativeCode: MAC_KEYS.k, mods: CMD },
      { col: 3, row: 0, symbol: 'upload',    label: 'Upload',        title: 'Upload',
        type: 'hotkey', nativeCode: MAC_KEYS.u, mods: CMD | SHIFT },
      { col: 0, row: 1, symbol: 'artifacts', label: 'Artifacts',     title: 'Artifacts',
        type: 'hotkey', nativeCode: MAC_KEYS[','], mods: CMD },
      { col: 1, row: 1, symbol: 'globe',     label: 'Web Search',    title: 'Web Search',
        type: 'hotkey', nativeCode: MAC_KEYS['.'], mods: CMD },
      { col: 2, row: 1, symbol: 'copy',      label: 'Copy Response', title: 'Copy Response',
        type: 'hotkey', nativeCode: MAC_KEYS.c, mods: CMD | SHIFT },
      { col: 3, row: 1, symbol: 'research',  label: 'Deep Research', title: 'Deep Research',
        type: 'hotkey', nativeCode: MAC_KEYS.r, mods: CMD | SHIFT },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',  title: 'Pages',  type: 'placeholder' },
      { index: 2, symbol: 'scroll', label: 'Scroll', title: 'Scroll', type: 'placeholder' },
      { index: 3, symbol: 'model',  label: 'Model',  title: 'Model',  type: 'placeholder' },
    ])
  );

  // ── Page 4: Antigravity ───────────────────────────────────────────────
  pages.push(
    await buildPage('antigravity', [
      { col: 0, row: 0, symbol: 'appLaunch',  label: 'Antigravity',  title: 'Antigravity',
        type: 'open', path: '/Applications/Antigravity.app' },
      { col: 1, row: 0, symbol: 'newSession', label: 'New Session',  title: 'New Session',
        type: 'hotkey', nativeCode: MAC_KEYS.n, mods: CMD },
      { col: 2, row: 0, symbol: 'branch',     label: 'Branch',       title: 'Branch',
        type: 'hotkey', nativeCode: MAC_KEYS.b, mods: CMD },
      { col: 3, row: 0, symbol: 'library',    label: 'Library',      title: 'Library',
        type: 'hotkey', nativeCode: MAC_KEYS.l, mods: CMD },
      { col: 0, row: 1, symbol: 'exportIcon', label: 'Export',       title: 'Export',
        type: 'hotkey', nativeCode: MAC_KEYS.e, mods: CMD },
      { col: 1, row: 1, symbol: 'share',      label: 'Share',        title: 'Share',
        type: 'hotkey', nativeCode: MAC_KEYS.s, mods: CMD | SHIFT },
      { col: 2, row: 1, symbol: 'undo',       label: 'Undo',         title: 'Undo',
        type: 'hotkey', nativeCode: MAC_KEYS.z, mods: CMD },
      { col: 3, row: 1, symbol: 'redo',       label: 'Redo',         title: 'Redo',
        type: 'hotkey', nativeCode: MAC_KEYS.z, mods: CMD | SHIFT },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',  title: 'Pages',  type: 'placeholder' },
      { index: 2, symbol: 'zoom',   label: 'Zoom',   title: 'Zoom',   type: 'placeholder' },
      { index: 3, symbol: 'theme',  label: 'Theme',  title: 'Theme',  type: 'placeholder' },
    ])
  );

  // ── Page 5: NotebookLM ────────────────────────────────────────────────
  pages.push(
    await buildPage('notebookLM', [
      { col: 0, row: 0, symbol: 'notebook',   label: 'NotebookLM',     title: 'NotebookLM',
        type: 'website', url: 'https://notebooklm.google.com' },
      { col: 1, row: 0, symbol: 'newSession', label: 'New Notebook',   title: 'New Notebook',
        type: 'hotkey', nativeCode: MAC_KEYS.n, mods: CMD },
      { col: 2, row: 0, symbol: 'addSource',  label: 'Add Source',     title: 'Add Source',
        type: 'hotkey', nativeCode: MAC_KEYS.o, mods: CMD },
      { col: 3, row: 0, symbol: 'audio',      label: 'Audio Overview', title: 'Audio Overview',
        type: 'hotkey', nativeCode: MAC_KEYS.p, mods: CMD },
      { col: 0, row: 1, symbol: 'chat',       label: 'Chat',           title: 'Chat',
        type: 'hotkey', nativeCode: MAC_KEYS['/'], mods: CMD },
      { col: 1, row: 1, symbol: 'studyGuide', label: 'Study Guide',    title: 'Study Guide',
        type: 'hotkey', nativeCode: MAC_KEYS.g, mods: CMD },
      { col: 2, row: 1, symbol: 'save',       label: 'Save',           title: 'Save',
        type: 'hotkey', nativeCode: MAC_KEYS.s, mods: CMD },
      { col: 3, row: 1, symbol: 'share',      label: 'Share',          title: 'Share',
        type: 'hotkey', nativeCode: MAC_KEYS.s, mods: CMD | SHIFT },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',  title: 'Pages',  type: 'placeholder' },
      { index: 2, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 3, symbol: 'seek',   label: 'Seek',   title: 'Seek',   type: 'placeholder' },
    ])
  );

  // ── Page 6: AI Studio ─────────────────────────────────────────────────
  pages.push(
    await buildPage('aiStudio', [
      { col: 0, row: 0, symbol: 'star',       label: 'AI Studio',     title: 'AI Studio',
        type: 'website', url: 'https://aistudio.google.com' },
      { col: 1, row: 0, symbol: 'newPrompt',  label: 'New Prompt',    title: 'New Prompt',
        type: 'hotkey', nativeCode: MAC_KEYS.n, mods: CMD },
      { col: 2, row: 0, symbol: 'structured', label: 'Struct Prompt', title: 'Struct Prompt',
        type: 'hotkey', nativeCode: MAC_KEYS.n, mods: CMD | SHIFT },
      { col: 3, row: 0, symbol: 'run',        label: 'Run',           title: 'Run',
        type: 'hotkey', nativeCode: MAC_KEYS.return, mods: CMD },
      { col: 0, row: 1, symbol: 'key',        label: 'API Key',       title: 'API Key',
        type: 'hotkey', nativeCode: MAC_KEYS.k, mods: CMD },
      { col: 1, row: 1, symbol: 'settings',   label: 'Settings',      title: 'Settings',
        type: 'hotkey', nativeCode: MAC_KEYS[','], mods: CMD },
      { col: 2, row: 1, symbol: 'compare',    label: 'Compare',       title: 'Compare',
        type: 'hotkey', nativeCode: MAC_KEYS.m, mods: CMD },
      { col: 3, row: 1, symbol: 'save',       label: 'Save',          title: 'Save',
        type: 'hotkey', nativeCode: MAC_KEYS.s, mods: CMD },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',  title: 'Pages',  type: 'placeholder' },
      { index: 2, symbol: 'temp',   label: 'Temp',   title: 'Temp',   type: 'placeholder' },
      { index: 3, symbol: 'tokens', label: 'Tokens',  title: 'Tokens', type: 'placeholder' },
    ])
  );

  // ── Page 7: System ────────────────────────────────────────────────────
  pages.push(
    await buildPage('system', [
      { col: 0, row: 0, symbol: 'micMute',      label: 'Mic Mute',      title: 'Mic Mute',
        type: 'hotkey', nativeCode: MAC_KEYS.space, mods: CMD | SHIFT },
      { col: 1, row: 0, symbol: 'mute',         label: 'Mute',          title: 'Mute',
        type: 'hotkey', nativeCode: MAC_KEYS.f1, mods: 0 },
      { col: 2, row: 0, symbol: 'camera',       label: 'Camera',        title: 'Camera',
        type: 'hotkey', nativeCode: MAC_KEYS.c, mods: CMD | SHIFT },
      { col: 3, row: 0, symbol: 'screenShare',  label: 'Screen Share',  title: 'Screen Share',
        type: 'hotkey', nativeCode: MAC_KEYS.s, mods: CMD | CTRL },
      { col: 0, row: 1, symbol: 'screenshot',   label: 'Screenshot',    title: 'Screenshot',
        type: 'hotkey', nativeCode: MAC_KEYS['4'], mods: CMD | SHIFT },
      { col: 1, row: 1, symbol: 'screenRecord', label: 'Screen Record', title: 'Screen Record',
        type: 'hotkey', nativeCode: MAC_KEYS['5'], mods: CMD | SHIFT },
      { col: 2, row: 1, symbol: 'lock',         label: 'Lock',          title: 'Lock',
        type: 'hotkey', nativeCode: MAC_KEYS.q, mods: CMD | CTRL },
      { col: 3, row: 1, symbol: 'sleep',        label: 'Sleep',         title: 'Sleep',
        type: 'hotkey', nativeCode: MAC_KEYS.escape, mods: CMD | OPT },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',  title: 'Pages',  type: 'placeholder' },
      { index: 2, symbol: 'bright', label: 'Bright',  title: 'Bright', type: 'placeholder' },
      { index: 3, symbol: 'media',  label: 'Media',   title: 'Media',  type: 'placeholder' },
    ])
  );

  // ── Page 8: Automations ───────────────────────────────────────────────
  pages.push(
    await buildPage('automation', [
      { col: 0, row: 0, symbol: 'automation', label: 'AI Session',    title: 'AI Session',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/Start AI Session.app' },
      { col: 1, row: 0, symbol: 'focus',      label: 'Focus Mode',   title: 'Focus Mode',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/Focus Mode.app' },
      { col: 2, row: 0, symbol: 'tile',       label: 'Tile Windows', title: 'Tile Windows',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/Tile Claude+Terminal.app' },
      { col: 3, row: 0, symbol: 'commit',     label: 'Quick Commit', title: 'Quick Commit',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/Quick Commit.app' },
      { col: 0, row: 1, symbol: 'clipboard',  label: 'Clipboard',    title: 'Clipboard',
        type: 'website', url: 'raycast://extensions/raycast/clipboard-history/clipboard-history' },
      { col: 1, row: 1, symbol: 'darkmode',   label: 'Toggle Theme', title: 'Toggle Theme',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/Toggle Appearance.app' },
      { col: 2, row: 1, symbol: 'meeting',    label: 'Meeting Prep', title: 'Meeting Prep',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/Meeting Prep.app' },
      { col: 3, row: 1, symbol: 'endSession', label: 'End Session',  title: 'End Session',
        type: 'open', path: '~/.streamdeck-ai-toolkit/apps/End Session.app' },
    ], [
      { index: 0, symbol: 'volume', label: 'Volume', title: 'Volume', type: 'volume' },
      { index: 1, symbol: 'pages',  label: 'Pages',  title: 'Pages',  type: 'placeholder' },
      { index: 2, symbol: 'bright', label: 'Bright',  title: 'Bright', type: 'placeholder' },
      { index: 3, symbol: 'media',  label: 'Media',   title: 'Media',  type: 'placeholder' },
    ])
  );

  return { name: 'AI Toolkit', pages };
}

module.exports = { generateAIToolkit };
