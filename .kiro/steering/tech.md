---
inclusion: always
---

# Technology Stack

## Core Technologies

- **React 19.2.0**: UI framework with hooks and context
- **TypeScript 5.9.3**: Type-safe JavaScript with strict mode
- **Vite**: Build tool and dev server (using rolldown-vite variant)
- **Tone.js 15.1.22**: Web Audio API framework for audio synthesis
- **Monaco Editor 4.7.0**: Code editor component (VS Code editor)

## Testing

- **Vitest 4.0.8**: Unit and integration testing
- **Testing Library**: React component testing (@testing-library/react, @testing-library/dom)
- **jsdom 27.1.0**: DOM environment for tests

## Code Quality

- **ESLint 9.39.1**: Linting with TypeScript support
- **typescript-eslint 8.46.3**: TypeScript-specific lint rules
- **eslint-plugin-react-hooks**: React hooks linting
- **eslint-plugin-react-refresh**: Fast refresh validation

## Build Configuration

- **TypeScript**: Project references pattern (tsconfig.app.json, tsconfig.node.json)
- **Vite plugins**: @vitejs/plugin-react for Fast Refresh
- **Module type**: ESM (type: "module" in package.json)

## Common Commands

```bash
# Development server with HMR
npm run dev

# Production build (TypeScript check + Vite build)
npm run build

# Lint code
npm run lint

# Run tests (single execution, not watch mode)
npm run test

# Preview production build
npm run preview
```

## Browser Requirements

- Web Audio API support required for audio features
- Modern browser with ES2020+ support
- Falls back to visual-only mode if audio unavailable

## Performance Considerations

- Large file optimization: Samples code >1000 lines for analysis
- Debounced code analysis to prevent excessive re-renders
- Monaco editor lazy loading and virtualization
