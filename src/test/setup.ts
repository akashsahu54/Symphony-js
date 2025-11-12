/**
 * Test setup for Symphony.js
 * Configures the testing environment for integration tests
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Audio API for testing
global.AudioContext = vi.fn().mockImplementation(() => ({
  state: 'running',
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1 },
  })),
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 440 },
  })),
  destination: {},
  currentTime: 0,
})) as any;

// Mock window.AudioContext
(window as any).AudioContext = global.AudioContext;
