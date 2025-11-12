---
inclusion: always
---

# Project Structure

## Root Directory

```
symphony-js/
├── src/              # Source code
├── public/           # Static assets
├── dist/             # Build output (generated)
├── node_modules/     # Dependencies (generated)
├── .kiro/            # Kiro AI configuration and specs
├── index.html        # Entry HTML
├── package.json      # Dependencies and scripts
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript project references
├── tsconfig.app.json # App TypeScript config
├── tsconfig.node.json # Node TypeScript config
└── eslint.config.js  # ESLint configuration
```

## Source Organization

```
src/
├── components/       # React components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── services/         # Business logic and analysis
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── data/             # Static data and examples
├── test/             # Test setup and utilities
├── assets/           # Images and static resources
├── App.tsx           # Main application component
├── App.css           # Application styles
├── main.tsx          # React entry point
└── index.css         # Global styles
```

## Key Directories

### `/components`
React UI components, each with corresponding CSS file:
- `EditorPanel.tsx`: Monaco code editor wrapper
- `WaveformVisualizer.tsx`: Audio visualization canvas
- `CodeQualityIndicator.tsx`: Code metrics display
- `ControlBar.tsx`: Playback controls
- `Terminal.tsx`: Output display
- `KeyboardShortcutsHelp.tsx`: Help overlay
- `MonacoEditor.tsx`: Monaco editor integration
- `index.ts`: Component exports

### `/contexts`
React context providers for global state:
- `AudioEngineContext.tsx`: Audio engine state and controls

### `/services`
Core business logic (not UI-dependent):
- `CodeAnalyzer.ts`: Code structure and quality analysis
- `InstrumentManager.ts`: Audio instrument management
- `PythonRunner.ts`: Python code execution (Pyodide)

### `/types`
TypeScript type definitions organized by domain:
- `audio.ts`: Audio and mood types
- `composition.ts`: Musical composition types
- `editor.ts`: Editor and language types
- `index.ts`: Central type exports
- `pyodide.d.ts`: Pyodide type declarations

### `/hooks`
Custom React hooks:
- `useDebounce.ts`: Debounced value updates
- `useKeyboardShortcuts.ts`: Keyboard event handling

### `/utils`
Utility functions:
- `languageDetector.ts`: Programming language detection
- `performanceMonitor.ts`: Performance tracking

### `/data`
Static data:
- `codeExamples.ts`: Sample code snippets

## Naming Conventions

- **Components**: PascalCase (e.g., `EditorPanel.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useDebounce.ts`)
- **Services**: PascalCase (e.g., `CodeAnalyzer.ts`)
- **Types**: PascalCase for types/interfaces (e.g., `MoodState`)
- **CSS files**: Match component name (e.g., `EditorPanel.css`)
- **Test files**: `*.test.tsx` or `*.test.ts` suffix

## Import Patterns

- Use barrel exports from `index.ts` files
- Relative imports for local modules
- Type imports use `import type` syntax
- Components import their own CSS files

## File Organization Rules

- Each component in its own file with matching CSS
- Services are pure TypeScript (no React dependencies)
- Types are centralized and exported from `/types/index.ts`
- Tests colocated with source files
- `.gitkeep` files maintain empty directories in git
