# Design Document

## Overview

The intro screen feature adds a 5-second splash screen that displays before the main Symphony.js application loads. This creates an impactful first impression by combining visual animations (typewriter text effect, animated logo) with fade-in background music. The intro establishes the audio-visual nature of the application and builds anticipation before users interact with the code editor.

The intro screen will be implemented as a standalone React component that conditionally renders before the main App component. It will leverage the existing AudioEngineContext for audio playback and use CSS animations for visual effects.

## Architecture

### Component Hierarchy

```
main.tsx
└── IntroScreen (new)
    └── App (existing)
        └── AudioEngineProvider
            └── AppContent
```

### State Management

The intro screen will use local component state to manage:
- Animation progress (typewriter effect completion)
- Visibility state (shown/hidden)
- Skip interaction handling
- Audio playback state

A new state variable `showIntro` will be added at the root level to control whether the intro or main app is displayed.

### Integration Points

1. **Entry Point (main.tsx)**: Wrap App component with IntroScreen component
2. **Audio System**: Use Tone.js directly for intro music (independent of AudioEngineContext)
3. **Transition**: CSS fade transition between intro and main app


## Components and Interfaces

### IntroScreen Component

**Location**: `src/components/IntroScreen.tsx`

**Props**:
```typescript
interface IntroScreenProps {
  onComplete: () => void;  // Callback when intro finishes or is skipped
}
```

**Responsibilities**:
- Render black background with centered content
- Orchestrate typewriter animation for "Symphony.js" text
- Display tagline after title completes
- Render and animate logo
- Play fade-in background music
- Handle skip interaction (click or keypress)
- Auto-transition after 5 seconds
- Clean up audio on unmount

**State**:
```typescript
interface IntroState {
  titleComplete: boolean;    // Whether typewriter animation finished
  showTagline: boolean;       // Whether to show tagline
  audioStarted: boolean;      // Whether audio playback started
}
```

### Logo Component

**Location**: `src/components/IntroLogo.tsx`

**Props**: None (self-contained animation)

**Responsibilities**:
- Render abstract SVG logo representing Symphony.js
- Apply subtle CSS animation (pulse, rotate, or wave effect)
- Scale responsively based on viewport size

**Design**: Abstract waveform or musical note combined with code brackets


## Data Models

### Intro Music Configuration

```typescript
interface IntroMusicConfig {
  duration: number;        // Total duration in seconds (5)
  fadeInTime: number;      // Fade-in duration in seconds (2)
  fadeOutTime: number;     // Fade-out duration in seconds (0.5)
  tempo: number;           // BPM for intro music (100)
  key: string;             // Musical key ('C')
  notes: string[];         // Melody notes to play
}
```

### Animation Timing

```typescript
interface AnimationTiming {
  typewriterDelay: number;      // Delay between characters (ms)
  titleDuration: number;        // Total time for title animation (2000ms)
  taglineDelay: number;         // Delay before tagline appears (500ms)
  logoAnimationDuration: number; // Duration of one logo animation cycle (3000ms)
  totalDuration: number;        // Total intro duration (5000ms)
}
```

## Error Handling

### Audio Fallback

**Scenario**: Browser doesn't support Web Audio API or user has audio disabled

**Handling**:
- Detect audio support before attempting playback
- If unsupported, continue with visual-only intro
- Log warning to console but don't show error to user
- Ensure intro timing remains consistent (5 seconds)

**Implementation**:
```typescript
const canPlayAudio = () => {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};
```


### Skip Interaction

**Scenario**: User clicks or presses key during intro

**Handling**:
- Immediately stop all animations
- Fade out audio quickly (0.1s)
- Dispose audio resources
- Call onComplete callback
- Transition to main app

### Animation Performance

**Scenario**: Slow device or browser

**Handling**:
- Use CSS animations (GPU-accelerated) instead of JavaScript
- Use `will-change` CSS property for animated elements
- Ensure animations don't block main thread
- Fallback to instant display if animations lag

## Testing Strategy

### Unit Tests

**IntroScreen Component** (`IntroScreen.test.tsx`):
- Renders with black background
- Displays "Symphony.js" text
- Shows tagline after title animation
- Renders logo component
- Calls onComplete after 5 seconds
- Calls onComplete immediately on skip (click)
- Calls onComplete immediately on skip (keypress)
- Handles audio initialization errors gracefully

**IntroLogo Component** (`IntroLogo.test.tsx`):
- Renders SVG logo
- Applies animation class
- Scales responsively

### Integration Tests

**Intro to App Transition** (`App.integration.test.tsx`):
- IntroScreen displays first on app load
- Main app hidden while intro showing
- Main app displays after intro completes
- Audio context initialized before main app
- Skip functionality transitions correctly


### Manual Testing Checklist

- [ ] Intro displays on fresh page load
- [ ] Typewriter effect animates smoothly
- [ ] Tagline appears after title
- [ ] Logo animates subtly
- [ ] Background music fades in
- [ ] Intro auto-completes after 5 seconds
- [ ] Click to skip works
- [ ] Keyboard press to skip works
- [ ] Audio fades out on skip
- [ ] Transition to main app is smooth
- [ ] Works on mobile devices (320px width)
- [ ] Works on tablets (768px width)
- [ ] Works on desktop (1920px+ width)
- [ ] Works without audio support (visual-only)
- [ ] No console errors

## Visual Design Specifications

### Color Palette

- **Background**: `#000000` (pure black)
- **Title Text**: `#00D9FF` (vivid cyan) - represents audio waveforms
- **Tagline Text**: `#CCCCCC` (light gray) - subtle contrast
- **Logo Primary**: `#00D9FF` (cyan)
- **Logo Secondary**: `#FF00FF` (magenta) - accent color

### Typography

- **Title Font**: System font stack, bold weight
  - `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  - `font-size: clamp(2.5rem, 8vw, 5rem)` (responsive)
  - `font-weight: 700`
  
- **Tagline Font**: System font stack, italic
  - `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  - `font-size: clamp(1rem, 3vw, 1.5rem)` (responsive)
  - `font-style: italic`
  - `font-weight: 300`

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            [LOGO - 80px]            │
│                                     │
│          Symphony.js                │
│                                     │
│   Stop looking for bugs...          │
│   and start listening for them!     │
│                                     │
│                                     │
│     [Skip - Press any key]          │
│                                     │
└─────────────────────────────────────┘
```

### Animations

**Typewriter Effect**:
- Characters appear sequentially
- 100ms delay between characters
- Blinking cursor during typing
- Cursor disappears when complete

**Logo Animation**:
- Subtle pulse effect (scale 1.0 to 1.05)
- 3-second animation cycle
- Infinite loop
- Ease-in-out timing

**Fade Transition**:
- Intro fades out over 0.5s
- Main app fades in over 0.5s
- Opacity transition with ease-in-out

## Audio Design

### Intro Music Composition

**Style**: Ambient, welcoming, hint of mystery

**Structure**:
- Simple melodic phrase in C major
- Soft synth pad for warmth
- Light arpeggio pattern
- Volume: -12dB to -6dB (subtle)

**Implementation**:
```typescript
// Use Tone.js Synth with reverb
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'sine' },
  envelope: { attack: 0.5, decay: 0.2, sustain: 0.5, release: 1 }
}).toDestination();

// Melody: C4 - E4 - G4 - C5 (ascending arpeggio)
const melody = ['C4', 'E4', 'G4', 'C5'];
```

### Audio Timing

- **0.0s**: Start fade-in
- **2.0s**: Reach full volume
- **4.5s**: Start fade-out (if not skipped)
- **5.0s**: Audio complete

## Performance Considerations

### Optimization Strategies

1. **Preload Assets**: Logo SVG inlined in component (no HTTP request)
2. **CSS Animations**: Use GPU-accelerated transforms
3. **Audio Initialization**: Start audio context early to avoid delays
4. **Lazy Loading**: Don't load main app components until intro completes
5. **Memory Management**: Dispose audio resources on unmount

### Performance Targets

- **Time to Interactive**: < 1 second
- **Animation Frame Rate**: 60 FPS
- **Audio Latency**: < 100ms from start
- **Memory Usage**: < 5MB for intro screen

## Accessibility

### Keyboard Navigation

- Any key press skips intro
- Focus trap not needed (single screen)
- No interactive elements except skip

### Screen Readers

- Add `role="presentation"` to intro container
- Add `aria-label="Symphony.js intro screen"` to main container
- Skip button has `aria-label="Skip intro"`

### Motion Preferences

Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .typewriter-text {
    animation: none;
  }
  .intro-logo {
    animation: none;
  }
}
```

## Implementation Notes

### File Structure

```
src/
├── components/
│   ├── IntroScreen.tsx       (new)
│   ├── IntroScreen.css        (new)
│   ├── IntroLogo.tsx          (new)
│   └── IntroLogo.css          (new)
├── main.tsx                   (modify)
└── App.tsx                    (no changes)
```

### Dependencies

No new dependencies required:
- React (existing)
- Tone.js (existing)
- CSS animations (native)

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Fallback for older browsers: Skip intro automatically
