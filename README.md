# Stream Deck+ AI Toolkit Profile Generator

A Node.js tool that programmatically generates a `.streamDeckProfile` for the **Elgato Stream Deck+**, purpose-built for AI-focused macOS workflows.

The generated profile provides instant access to **Claude Code**, **Claude Desktop**, **Antigravity**, **NotebookLM**, **Google AI Studio**, system controls, and automation workflows across **8 colour-coded pages** with **96 custom icons** and **32 dial assignments**.

## Quick Start

```bash
npm install
node build-ai-toolkit.js
```

Double-click the generated `AI Toolkit.streamDeckProfile` to import into the Elgato Stream Deck app.

## Page Layout

| Page | Name | Colour | Primary Action | Buttons |
|------|------|--------|---------------|---------|
| 1 | Claude Code | Orange | Launch `claude` CLI | /clear, /compact, /resume, /status, /cost, /context, YOLO |
| 2 | Claude Code Ext | Orange | /model | /config, /help, /permissions, /init, /login, /memory, /vim |
| 3 | Claude Desktop | Blue | Launch Claude.app | New Chat, Search, Upload, Artifacts, Web Search, Copy Response, Deep Research |
| 4 | Antigravity | Purple | Launch Antigravity.app | New Session, Branch, Library, Export, Share, Undo, Redo |
| 5 | NotebookLM | Green | Open notebooklm.google.com | New Notebook, Add Source, Audio Overview, Chat, Study Guide, Save, Share |
| 6 | AI Studio | Red | Open aistudio.google.com | New Prompt, Structured Prompt, Run, API Key, Settings, Compare, Save |
| 7 | System | Grey | Mic Mute | Mute, Camera, Screen Share, Screenshot, Screen Record, Lock, Sleep |
| 8 | Automations | Gold | AI Session | Focus Mode, Tile Windows, Quick Commit, Clipboard, Toggle Theme, Meeting Prep, End Session |

Each page includes 4 encoder dials: Volume, Page Navigation, and 2 context-specific controls.

## Project Structure

```
.
├── build-ai-toolkit.js       # Entry point — generates the .streamDeckProfile
├── generators/
│   └── ai-toolkit.js         # 8-page definitions with all button/encoder actions
├── lib/
│   ├── actions.js             # Action builders: hotkey, text, open, website, volume
│   ├── icons.js               # 50+ SVG symbols + sharp PNG renderer (288x288)
│   ├── ids.js                 # UUID, folder ID, and image ID generators
│   ├── keycodes.js            # macOS NativeCode key map + modifier bitmask
│   ├── profile.js             # Stream Deck+ page model (Keypad + Encoder)
│   └── zip-writer.js          # JSZip STORE-compressed .streamDeckProfile writer
└── package.json
```

## How It Works

1. **`generators/ai-toolkit.js`** defines all 8 pages — each button specifies its action type (hotkey, text, open, or website), keyboard shortcut, and icon symbol
2. **`lib/icons.js`** renders 288x288 PNG icons from SVG templates using 7 colour palettes and 50+ geometric symbols via `sharp`
3. **`lib/actions.js`** builds the exact JSON structures that the Stream Deck app expects, including macOS NativeCode key mappings
4. **`lib/zip-writer.js`** packages everything into a `.streamDeckProfile` ZIP (STORE compression) with the correct folder hierarchy

## Dependencies

- **[jszip](https://www.npmjs.com/package/jszip)** — ZIP archive creation
- **[sharp](https://www.npmjs.com/package/sharp)** — SVG to PNG rendering

## Profile Format

The `.streamDeckProfile` is a ZIP file targeting Device Model 7 (Stream Deck+):

```
{uuid}.sdProfile/
├── manifest.json                    # Device model, page list, profile name
└── Profiles/
    └── {base32-folder-id}/          # One per page
        ├── manifest.json            # Controllers: Keypad (4x2) + Encoder (4)
        └── Images/
            └── {hex-id}.png × 12   # Button + dial icons
```

## Action Types

| Type | Description | Example |
|------|-------------|---------|
| **Hotkey** | macOS keyboard shortcut | Cmd+N for New Chat |
| **Text** | Types a string + Enter | `/clear` for Claude Code |
| **Open** | Launches an app or .app bundle | `/Applications/Claude.app` |
| **Website** | Opens a URL | `https://notebooklm.google.com` |
| **Volume** | System volume (encoder) | Dial 0 on every page |

## Customization

### Adding a new button

In `generators/ai-toolkit.js`, add an entry to the button array for any page:

```javascript
{ col: 1, row: 0, symbol: 'search', label: 'Find', title: 'Find',
  type: 'hotkey', nativeCode: MAC_KEYS.f, mods: CMD }
```

### Adding a new icon symbol

In `lib/icons.js`, add an SVG snippet to the `SYMBOLS` object:

```javascript
mySymbol: `<circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" stroke-width="5"/>`,
```

Symbols are centered at (0,0) within a ~120px bounding box and use `currentColor` for palette flexibility.

### Adding a new colour palette

In `lib/icons.js`, add to the `PALETTES` object:

```javascript
myPalette: { bg: '#1A1A2E', accent: '#E94560', fg: '#FFFFFF' },
```

## Known Limitations

- **Encoder dials 2-4** are placeholder hotkeys. Rotate/press/touch behaviour requires the Stream Deck Plugin SDK.
- **Text actions** require the target app (e.g., terminal with Claude Code) to be focused.
- **Page navigation dial** is a placeholder — must be configured manually in the Stream Deck GUI as Previous/Next Page.
- **Automation .app bundles** (Page 8) must be built separately on the target Mac.

## License

MIT
