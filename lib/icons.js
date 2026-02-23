const sharp = require('sharp');

// ── Color Palettes ──────────────────────────────────────────────────────────
const PALETTES = {
  claudeCode:    { bg: '#2A1F14', accent: '#E88D4F', fg: '#FFFFFF' },
  claudeDesktop: { bg: '#141D2A', accent: '#6B9AE8', fg: '#FFFFFF' },
  antigravity:   { bg: '#1F142A', accent: '#B06BE8', fg: '#FFFFFF' },
  notebookLM:    { bg: '#142A1F', accent: '#4FE88D', fg: '#FFFFFF' },
  aiStudio:      { bg: '#2A1414', accent: '#E84F4F', fg: '#FFFFFF' },
  system:        { bg: '#1A1A20', accent: '#8A8A9A', fg: '#FFFFFF' },
  automation:    { bg: '#2A2514', accent: '#E8C94F', fg: '#FFFFFF' },
};

// ── SVG Symbol Paths ────────────────────────────────────────────────────────
// Each symbol returns SVG inner content centered in a ~120px bounding box
// Symbols use currentColor for stroke/fill (set by the wrapper)

const SYMBOLS = {
  // ── General ──
  terminal: `<rect x="-48" y="-36" width="96" height="72" rx="8" fill="none" stroke="currentColor" stroke-width="5"/>
    <polyline points="-30,-12 -10,8 -30,28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="28" x2="30" y2="28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  slash: `<text x="0" y="12" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="64" font-weight="700" fill="currentColor">/</text>`,

  clear: `<circle cx="0" cy="0" r="32" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-16" y1="-16" x2="16" y2="16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="16" y1="-16" x2="-16" y2="16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  compact: `<line x1="-30" y1="-20" x2="30" y2="-20" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="-30" y1="-4" x2="30" y2="-4" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="-30" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <polyline points="0,20 12,32 24,20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,

  resume: `<polygon points="-16,-24 24,0 -16,24" fill="currentColor"/>
    <line x1="-26" y1="-24" x2="-26" y2="24" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,

  status: `<circle cx="0" cy="0" r="32" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="0" r="4" fill="currentColor"/>
    <line x1="0" y1="0" x2="0" y2="-22" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="16" y2="10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  cost: `<text x="0" y="14" text-anchor="middle" font-family="SF Pro Display,Helvetica Neue,Arial" font-size="56" font-weight="700" fill="currentColor">$</text>`,

  context: `<rect x="-32" y="-24" width="64" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-20" y1="-10" x2="20" y2="-10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-20" y1="2" x2="20" y2="2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-20" y1="14" x2="8" y2="14" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  yolo: `<text x="0" y="10" text-anchor="middle" font-family="SF Pro Display,Helvetica Neue,Arial" font-size="36" font-weight="900" fill="currentColor">⚡</text>`,

  // ── Claude Code Ext ──
  model: `<rect x="-30" y="-28" width="60" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="-6" r="12" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="-16" y1="16" x2="16" y2="16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  config: `<circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="0" r="5" fill="currentColor"/>
    <line x1="0" y1="-30" x2="0" y2="-16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="16" x2="0" y2="30" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="-30" y1="0" x2="-16" y2="0" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="16" y1="0" x2="30" y2="0" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  help: `<circle cx="0" cy="-4" r="30" fill="none" stroke="currentColor" stroke-width="5"/>
    <text x="0" y="8" text-anchor="middle" font-family="SF Pro Display,Helvetica Neue,Arial" font-size="40" font-weight="700" fill="currentColor">?</text>`,

  permissions: `<rect x="-24" y="-8" width="48" height="40" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="-16" r="16" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="12" r="4" fill="currentColor"/>`,

  init: `<polyline points="-24,-20 -24,24 24,24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="-12,8 4,-8 20,4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,

  login: `<circle cx="0" cy="-16" r="14" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M-28 28 Q-28 4, 0 4 Q28 4, 28 28" fill="none" stroke="currentColor" stroke-width="5"/>`,

  memory: `<rect x="-28" y="-24" width="56" height="48" rx="4" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-16" y1="-24" x2="-16" y2="24" stroke="currentColor" stroke-width="3"/>
    <line x1="0" y1="-24" x2="0" y2="24" stroke="currentColor" stroke-width="3"/>
    <line x1="16" y1="-24" x2="16" y2="24" stroke="currentColor" stroke-width="3"/>
    <line x1="-28" y1="0" x2="28" y2="0" stroke="currentColor" stroke-width="3"/>`,

  vim: `<text x="0" y="12" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="48" font-weight="700" fill="currentColor">Vi</text>`,

  // ── Claude Desktop ──
  appLaunch: `<rect x="-32" y="-32" width="64" height="64" rx="14" fill="none" stroke="currentColor" stroke-width="5"/>
    <polygon points="-10,-16 18,0 -10,16" fill="currentColor"/>`,

  newChat: `<path d="M-28 -20 L28 -20 Q36 -20, 36 -12 L36 12 Q36 20, 28 20 L4 20 L-8 32 L-8 20 L-28 20 Q-36 20, -36 12 L-36 -12 Q-36 -20, -28 -20Z" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  search: `<circle cx="-6" cy="-6" r="22" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="10" y1="10" x2="28" y2="28" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,

  upload: `<polyline points="-16,4 0,-14 16,4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="-12" x2="0" y2="20" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M-28 16 L-28 28 L28 28 L28 16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,

  artifacts: `<rect x="-28" y="-28" width="56" height="56" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="0" y1="-28" x2="0" y2="28" stroke="currentColor" stroke-width="4"/>
    <line x1="-28" y1="0" x2="28" y2="0" stroke="currentColor" stroke-width="4"/>`,

  globe: `<circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" stroke-width="5"/>
    <ellipse cx="0" cy="0" rx="14" ry="28" fill="none" stroke="currentColor" stroke-width="3"/>
    <line x1="-28" y1="0" x2="28" y2="0" stroke="currentColor" stroke-width="3"/>`,

  copy: `<rect x="-20" y="-24" width="36" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="-12" y="-16" width="36" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>`,

  research: `<circle cx="-8" cy="-8" r="20" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="6" y1="6" x2="24" y2="24" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    <line x1="-8" y1="-16" x2="-8" y2="0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-16" y1="-8" x2="0" y2="-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  // ── Antigravity ──
  newSession: `<rect x="-28" y="-24" width="56" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  branch: `<circle cx="-12" cy="-16" r="6" fill="currentColor"/>
    <circle cx="12" cy="-16" r="6" fill="currentColor"/>
    <circle cx="0" cy="20" r="6" fill="currentColor"/>
    <line x1="-12" y1="-10" x2="-6" y2="14" stroke="currentColor" stroke-width="4"/>
    <line x1="12" y1="-10" x2="6" y2="14" stroke="currentColor" stroke-width="4"/>`,

  library: `<rect x="-30" y="-24" width="16" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="-8" y="-24" width="16" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="14" y="-24" width="16" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>`,

  exportIcon: `<polyline points="-16,-4 0,-22 16,-4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="-20" x2="0" y2="16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <rect x="-28" y="20" width="56" height="6" rx="3" fill="currentColor"/>`,

  share: `<circle cx="20" cy="-20" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="-20" cy="0" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="-12" y1="-4" x2="12" y2="-16" stroke="currentColor" stroke-width="4"/>
    <line x1="-12" y1="4" x2="12" y2="16" stroke="currentColor" stroke-width="4"/>`,

  undo: `<polyline points="12,-20 -16,-20 -16,4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="-28,4 -16,16 -4,4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,

  redo: `<polyline points="-12,-20 16,-20 16,4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="4,4 16,16 28,4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,

  // ── NotebookLM ──
  notebook: `<rect x="-28" y="-32" width="56" height="64" rx="4" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-16" y1="-32" x2="-16" y2="32" stroke="currentColor" stroke-width="4"/>
    <line x1="-8" y1="-14" x2="20" y2="-14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="-8" y1="-2" x2="20" y2="-2" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="-8" y1="10" x2="12" y2="10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,

  addSource: `<rect x="-28" y="-20" width="40" height="48" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="16" cy="-8" r="16" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="8" y1="-8" x2="24" y2="-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="16" y1="-16" x2="16" y2="0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  audio: `<rect x="-8" y="-28" width="16" height="32" rx="8" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M-20 4 Q-20 24, 0 24 Q20 24, 20 4" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="0" y1="24" x2="0" y2="32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  chat: `<path d="M-28 -20 L28 -20 Q36 -20, 36 -12 L36 12 Q36 20, 28 20 L4 20 L-8 32 L-8 20 L-28 20 Q-36 20, -36 12 L-36 -12 Q-36 -20, -28 -20Z" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-18" y1="-4" x2="18" y2="-4" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-18" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  studyGuide: `<path d="M0 -28 L-32 -16 L0 -4 L32 -16Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-24 -10 L-24 12 Q0 28, 24 12 L24 -10" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="32" y1="-16" x2="32" y2="8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  save: `<path d="M-28 -28 L16 -28 L28 -16 L28 28 L-28 28Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
    <rect x="-12" y="8" width="24" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="-8" y="-28" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="3"/>`,

  // ── AI Studio ──
  star: `<polygon points="0,-30 8,-10 30,-10 12,4 20,26 0,14 -20,26 -12,4 -30,-10 -8,-10" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`,

  newPrompt: `<rect x="-28" y="-24" width="56" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-16" y1="-8" x2="16" y2="-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-16" y1="6" x2="4" y2="6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  structured: `<rect x="-28" y="-24" width="56" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="-28" y1="-8" x2="28" y2="-8" stroke="currentColor" stroke-width="3"/>
    <line x1="-28" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="3"/>
    <line x1="0" y1="-24" x2="0" y2="24" stroke="currentColor" stroke-width="3"/>`,

  run: `<polygon points="-14,-24 22,0 -14,24" fill="currentColor"/>`,

  key: `<circle cx="-8" cy="-8" r="18" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="6" y1="6" x2="28" y2="28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="20" y1="28" x2="28" y2="28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="28" y1="20" x2="28" y2="28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  settings: `<circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M-4,-30 L4,-30 L6,-20 Q12,-18,16,-14 L26,-18 L30,-12 L22,-6 Q24,-2,24,2 L30,6 L26,14 L18,10 Q14,14,10,16 L10,26 L2,30 L-2,20 Q-6,22,-10,22 L-16,30 L-22,24 L-16,18 Q-20,14,-22,10 L-30,8 L-30,0 L-22,-4 Q-22,-10,-20,-14 L-26,-20 L-20,-26 L-14,-20 Q-10,-22,-6,-22Z" fill="none" stroke="currentColor" stroke-width="3"/>`,

  compare: `<rect x="-32" y="-24" width="28" height="48" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="4" y="-24" width="28" height="48" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="-18" y1="-8" x2="-18" y2="8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="18" y1="-8" x2="18" y2="8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  // ── System ──
  mic: `<rect x="-10" y="-30" width="20" height="36" rx="10" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M-24 0 Q-24 24, 0 24 Q24 24, 24 0" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="0" y1="24" x2="0" y2="32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  micMute: `<rect x="-10" y="-30" width="20" height="36" rx="10" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M-24 0 Q-24 24, 0 24 Q24 24, 24 0" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="0" y1="24" x2="0" y2="32" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="-28" y1="-28" x2="28" y2="28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  mute: `<polygon points="-20,-20 -4,-20 16,-32 16,32 -4,20 -20,20" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
    <line x1="26" y1="-12" x2="40" y2="12" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="40" y1="-12" x2="26" y2="12" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  camera: `<rect x="-32" y="-20" width="64" height="44" rx="8" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="2" r="14" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="0" cy="2" r="4" fill="currentColor"/>`,

  screenShare: `<rect x="-32" y="-24" width="64" height="44" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <polyline points="-8,4 0,-8 8,4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="-6" x2="0" y2="14" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-16" y1="28" x2="16" y2="28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  screenshot: `<path d="M-28,-28 L-28,-12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M-28,-28 L-12,-28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M28,-28 L28,-12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M28,-28 L12,-28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M-28,28 L-28,12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M-28,28 L-12,28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M28,28 L28,12" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M28,28 L12,28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,

  screenRecord: `<rect x="-32" y="-24" width="64" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="0" r="12" fill="currentColor"/>`,

  lock: `<rect x="-20" y="-4" width="40" height="32" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M-12,-4 L-12,-16 Q-12,-30, 0,-30 Q12,-30, 12,-16 L12,-4" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="14" r="4" fill="currentColor"/>`,

  sleep: `<path d="M12,-28 Q-20,-20, -20,0 Q-20,28, 12,28 Q-8,20, -8,0 Q-8,-20, 12,-28Z" fill="none" stroke="currentColor" stroke-width="5"/>`,

  // ── Automations ──
  automation: `<circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" stroke-width="5"/>
    <polyline points="-14,-8 0,-20 14,-8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="-14,8 0,20 14,8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,

  focus: `<circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" stroke-width="5"/>
    <circle cx="0" cy="0" r="16" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="0" cy="0" r="5" fill="currentColor"/>`,

  tile: `<rect x="-28" y="-28" width="24" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="4" y="-28" width="24" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="-28" y="4" width="24" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="4" y="4" width="24" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>`,

  commit: `<circle cx="0" cy="-20" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="0" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" stroke-width="4"/>
    <polyline points="-10,-4 0,6 10,-4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,

  clipboard: `<rect x="-22" y="-28" width="44" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="5"/>
    <rect x="-10" y="-34" width="20" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="-10" y1="0" x2="10" y2="0" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="-10" y1="10" x2="10" y2="10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="-10" y1="20" x2="4" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,

  darkmode: `<circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" stroke-width="5"/>
    <path d="M0,-28 Q28,-28,28,0 Q28,28,0,28Z" fill="currentColor"/>`,

  meeting: `<circle cx="-12" cy="-16" r="10" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="12" cy="-16" r="10" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M-28 20 Q-28 4, -12 4 Q-4 4, 0 10" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M28 20 Q28 4, 12 4 Q4 4, 0 10" fill="none" stroke="currentColor" stroke-width="4"/>`,

  endSession: `<rect x="-28" y="-24" width="56" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="5"/>
    <rect x="-10" y="-8" width="20" height="16" rx="2" fill="currentColor"/>`,

  // ── Encoder icons ──
  volume: `<polygon points="-20,-16 -8,-16 8,-28 8,28 -8,16 -20,16" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
    <path d="M16,-12 Q28,0, 16,12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M20,-22 Q40,0, 20,22" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  pages: `<rect x="-24" y="-20" width="40" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="-16" y="-26" width="40" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>`,

  font: `<text x="0" y="12" text-anchor="middle" font-family="SF Pro Display,Helvetica Neue,Arial" font-size="56" font-weight="700" fill="currentColor">A</text>`,

  scroll: `<polyline points="-12,-24 0,-36 12,-24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="-34" x2="0" y2="34" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <polyline points="-12,24 0,36 12,24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,

  zoom: `<circle cx="-6" cy="-6" r="18" fill="none" stroke="currentColor" stroke-width="4"/>
    <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <line x1="-14" y1="-6" x2="2" y2="-6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-6" y1="-14" x2="-6" y2="2" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  theme: `<circle cx="0" cy="-4" r="20" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="0" y1="-30" x2="0" y2="-26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="20" y1="-4" x2="24" y2="-4" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-20" y1="-4" x2="-24" y2="-4" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  seek: `<polygon points="-20,-16 -2,0 -20,16" fill="currentColor"/>
    <polygon points="2,-16 20,0 2,16" fill="currentColor"/>`,

  temp: `<rect x="-6" y="-32" width="12" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="0" cy="22" r="12" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="0" cy="22" r="6" fill="currentColor"/>
    <line x1="0" y1="16" x2="0" y2="-16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  tokens: `<text x="0" y="8" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="40" font-weight="700" fill="currentColor">#</text>`,

  bright: `<circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" stroke-width="5"/>
    <line x1="0" y1="-24" x2="0" y2="-30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="24" x2="0" y2="30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-24" y1="0" x2="-30" y2="0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="24" y1="0" x2="30" y2="0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-17" y1="-17" x2="-21" y2="-21" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="17" y1="-17" x2="21" y2="-21" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="-17" y1="17" x2="-21" y2="21" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <line x1="17" y1="17" x2="21" y2="21" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,

  media: `<polygon points="-14,-20 18,0 -14,20" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
    <line x1="26" y1="-20" x2="26" y2="20" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
};

// ── SVG Builder ─────────────────────────────────────────────────────────────

function buildIconSvg(symbolKey, paletteName, label) {
  const palette = PALETTES[paletteName];
  if (!palette) throw new Error(`Unknown palette: ${paletteName}`);

  const symbol = SYMBOLS[symbolKey];
  if (!symbol) throw new Error(`Unknown symbol: ${symbolKey}`);

  // 6% accent overlay opacity
  const overlayOpacity = 0.06;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288" viewBox="0 0 288 288">
  <rect width="288" height="288" rx="44" fill="${palette.bg}"/>
  <rect width="288" height="288" rx="44" fill="${palette.accent}" opacity="${overlayOpacity}"/>
  <g transform="translate(144,${label ? 108 : 144})" color="${palette.accent}" fill="${palette.accent}" stroke="${palette.accent}">
    ${symbol}
  </g>
  ${label ? `<text x="144" y="248" text-anchor="middle" font-family="SF Pro Display,Helvetica Neue,Arial,sans-serif" font-size="28" font-weight="600" fill="${palette.fg}" opacity="0.85">${escapeXml(label)}</text>` : ''}
</svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── PNG Renderer ────────────────────────────────────────────────────────────

async function renderIcon(symbolKey, paletteName, label) {
  const svg = buildIconSvg(symbolKey, paletteName, label);
  return sharp(Buffer.from(svg)).resize(288, 288).png().toBuffer();
}

module.exports = { PALETTES, SYMBOLS, buildIconSvg, renderIcon };
