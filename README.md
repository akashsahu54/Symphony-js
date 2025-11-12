# 🎵 Symphony.js

**Transform your code into music. Hear your logic, feel your bugs, compose with commits.**

Symphony.js is an interactive web-based development tool that merges a code editor with a generative audio engine, providing real-time auditory feedback about code structure, quality, and flow. Write code and experience it as music.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Tone.js](https://img.shields.io/badge/Tone.js-15.1-orange)](https://tonejs.github.io/)

---

## ✨ Features

### 🎹 Real-Time Audio Feedback
- **Hear your code quality** as you type with intelligent mood-based audio
- **Three distinct moods** that reflect code characteristics:
  - 🎼 **HARMONIOUS**: Clean, well-documented code → Major keys, smooth chords
  - 🎸 **DISCORDANT**: Syntax errors, malformed code → Minor keys, chaotic sounds  
  - ⚡ **INTENSE**: Complex algorithms, deep nesting → Fast tempo, high energy

### 🎼 Musical Instruments
- **Rhythm Instrument**: Represents execution flow and typing patterns
- **Harmony Instrument**: Chord progressions based on code complexity
- **Melody Instrument**: Function calls and significant code events

### 🎬 Commit Compositions
- Generate **15-second musical pieces** from your entire file
- Code structure mapped to musical phrases:
  - Imports → Steady beat patterns
  - Functions → Melodic development
  - Returns → Resolving chords

### 📊 Visual Feedback
- **Real-time waveform visualizer** showing audio output
- **Code quality indicators** with visual metrics
- **Split-screen layout**: Editor on left, visualizer on right
- **Dark theme** optimized for extended coding sessions

### 🎛️ Smart Controls
- **Mute Bugs**: Silence error sounds while debugging
- **Play Commit**: Generate full file composition
- **Language Support**: JavaScript, TypeScript, Python
- **Keyboard Shortcuts**: Quick access to all features

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern browser with Web Audio API support (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/akashsahu54/symphony-js.git
cd symphony-js

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### First Steps

1. **Start typing code** in the Monaco Editor
2. **Listen** as Symphony.js analyzes and sonifies your code
3. **Click "Play Commit"** to hear your entire file as a composition
4. **Toggle "Mute Bugs"** to silence error sounds while fixing issues

---

## 🎯 Use Cases

### 🎓 Learning & Education
- **Multi-sensory learning**: Audio + visual feedback accelerates skill development
- **Immediate error detection**: Hear mistakes as you make them
- **Pattern recognition**: Internalize code quality through consistent audio cues
- **Engaging practice**: Gamification makes coding more enjoyable

### 🐛 Development & Debugging
- **Background awareness**: Audio alerts without breaking visual focus
- **Error prevention**: Catch syntax issues in real-time
- **Complexity monitoring**: Intense sounds signal when code needs refactoring
- **Flow state**: Maintain focus with ambient audio feedback

### 🎨 Creative Coding
- **Algorithmic music composition**: Code becomes a creative medium
- **Live coding performances**: Use for algorithmic music shows
- **Artistic expression**: Generate unique soundscapes from code
- **Educational demonstrations**: Make code structure audible for teaching

### ♿ Accessibility
- **Audio feedback** for developers with visual impairments
- **Alternative quality indicators** beyond visual cues
- **Multi-modal interface** supports different learning styles

---

## 🏗️ Architecture

### Technology Stack

- **React 19.2**: UI framework with hooks and context
- **TypeScript 5.9**: Type-safe development with strict mode
- **Vite**: Lightning-fast build tool and dev server
- **Tone.js 15.1**: Web Audio API framework for synthesis
- **Monaco Editor 4.7**: VS Code's editor component

### Project Structure

```
symphony-js/
├── src/
│   ├── components/       # React UI components
│   │   ├── EditorPanel.tsx
│   │   ├── WaveformVisualizer.tsx
│   │   ├── ControlBar.tsx
│   │   └── ...
│   ├── contexts/         # React context providers
│   │   └── AudioEngineContext.tsx
│   ├── services/         # Business logic
│   │   ├── CodeAnalyzer.ts
│   │   ├── InstrumentManager.ts
│   │   └── PythonRunner.ts
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── public/               # Static assets
└── .kiro/                # Kiro AI specs and config
```


### Key Components

**CodeAnalyzer**: Analyzes code structure, detects errors, calculates complexity  
**InstrumentManager**: Manages Tone.js instruments and audio synthesis  
**AudioEngineContext**: Global state for audio engine and playback  
**EditorPanel**: Monaco Editor wrapper with language support  
**WaveformVisualizer**: Real-time audio visualization canvas

---

## 🎮 Usage Guide

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Play Commit Composition |
| `Ctrl/Cmd + M` | Toggle Mute Bugs |
| `Ctrl/Cmd + /` | Show Keyboard Shortcuts |
| `Ctrl/Cmd + L` | Change Language |

### Audio Moods Explained

#### 🎼 HARMONIOUS (Major Keys, 90-120 BPM)
Triggered by:
- Clean syntax with no errors
- Well-documented code (comments present)
- Moderate complexity (nesting depth ≤ 2)
- Proper code structure

#### 🎸 DISCORDANT (Minor Keys, 60-90 BPM)
Triggered by:
- Syntax errors or warnings
- Malformed code structure
- Missing brackets or semicolons
- Undefined variables

#### ⚡ INTENSE (Fast Tempo, 120-180 BPM)
Triggered by:
- Complex algorithms
- Deep nesting (depth > 4)
- Recursive functions
- High cyclomatic complexity

### Code Examples

Try these examples to experience different moods:

**HARMONIOUS Example**:
```javascript
// Well-documented function
function calculateSum(a, b) {
  return a + b;
}
```

**DISCORDANT Example**:
```javascript
// Syntax errors
fucntion broken( {
  retunr undefined
}
```

**INTENSE Example**:
```javascript
// Complex recursion
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (single execution)
npm run test

# Lint code
npm run lint
```

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests with UI
npm run test -- --ui

# Run specific test file
npm run test CodeAnalyzer.test.ts
```

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment to any static hosting service.

---

## 🌐 Browser Compatibility

Symphony.js requires Web Audio API support:

- ✅ Chrome 34+
- ✅ Firefox 25+
- ✅ Safari 14.1+
- ✅ Edge 79+

Falls back to visual-only mode if audio is unavailable.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm run test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode conventions
- Write tests for new features
- Update documentation for API changes
- Follow existing code style (ESLint enforced)
- Keep components small and focused

---

## 📚 Documentation

- [Requirements Document](.kiro/specs/symphony-js/requirements.md) - Detailed feature requirements
- [Design Document](.kiro/specs/symphony-js/design.md) - Architecture and design decisions
- [Implementation Tasks](.kiro/specs/symphony-js/tasks.md) - Development roadmap
- [Technology Stack](.kiro/steering/tech.md) - Tech stack details
- [Project Structure](.kiro/steering/structure.md) - File organization

---

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ Real-time audio feedback with three moods
- ✅ Commit compositions (15-second pieces)
- ✅ Multi-language support (JS, TS, Python)
- ✅ Visual waveform display
- ✅ Mute controls and keyboard shortcuts

### Upcoming Features (v1.1-v1.2)
- 🔄 User accounts and cloud save
- 🔄 Custom instrument selection
- 🔄 Export compositions (MIDI/WAV)
- 🔄 Mobile responsive design
- 🔄 More language support (Java, C++, Rust)

### Future Vision (v2.0+)
- 🔮 AI-powered code analysis and suggestions
- 🔮 Collaborative real-time coding
- 🔮 VS Code extension
- 🔮 Custom theme marketplace
- 🔮 Educational curriculum integration

---

## 🐛 Known Issues

- Large files (>1000 lines) use sampling for performance
- Audio requires user interaction to start (browser security)
- Some browsers may require headphones for best experience

Report issues on [GitHub Issues](https://github.com/akashsahu54/symphony-js/issues).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's excellent code editor
- **Tone.js** - Powerful Web Audio framework
- **React Team** - For the amazing framework
- **Vite Team** - For blazing fast tooling

---

---

## 🌟 Show Your Support

If you find Symphony.js helpful, please consider:

- ⭐ **Starring the repository**
- 🐦 **Sharing on social media**
- 🐛 **Reporting bugs**
- 💡 **Suggesting features**
- 🤝 **Contributing code**

---

**Made with ❤️ and 🎵 by developer, for developers**

*Experience code in a whole new way. Start composing today.*
