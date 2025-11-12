---
inclusion: always
---

# Symphony.js Product Overview

Symphony.js is an interactive code-to-music visualization tool that transforms code into real-time audio feedback and musical compositions.

## Core Concept

The application analyzes code structure and quality to generate dynamic audio experiences:
- Real-time audio feedback as users type code
- Musical compositions from code commits (15-second playback)
- Visual waveform representation of the generated audio

## Key Features

- **Split-screen interface**: Code editor (Monaco) on left, waveform visualizer on right
- **Multi-language support**: JavaScript, TypeScript, Python
- **Code quality indicators**: Visual feedback on code structure and syntax
- **Mood-based audio**: Code characteristics determine musical mood (HARMONIOUS, DISCORDANT, INTENSE)
- **Web Audio API**: Browser-based audio synthesis using Tone.js
- **Keyboard shortcuts**: Quick access to common actions

## Audio Moods

- **HARMONIOUS**: Clean, well-documented code → Major keys, 90-120 BPM
- **DISCORDANT**: Syntax errors, malformed code → Minor keys, 60-90 BPM
- **INTENSE**: Complex algorithms, recursion → Fast tempo, 120-180 BPM

## Target Use Case

Educational tool and creative coding environment for developers who want to "hear" their code quality and structure through music.
