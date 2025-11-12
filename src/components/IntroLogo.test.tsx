/**
 * Unit tests for IntroLogo component
 * Requirements: 2.1, 2.2, 2.4
 * 
 * Tests the IntroLogo component rendering and animation
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { IntroLogo } from './IntroLogo';

describe('IntroLogo Component', () => {
  /**
   * Test: SVG logo renders correctly
   * Requirements: 2.1
   */
  it('should render SVG logo', () => {
    const { container } = render(<IntroLogo />);
    
    const logo = container.querySelector('.intro-logo');
    const svg = logo?.querySelector('svg');
    
    expect(logo).toBeDefined();
    expect(svg).toBeDefined();
  });

  it('should render SVG with correct viewBox', () => {
    const { container } = render(<IntroLogo />);
    
    const svg = container.querySelector('svg');
    
    expect(svg?.getAttribute('viewBox')).toBe('0 0 200 200');
  });

  it('should render code brackets', () => {
    const { container } = render(<IntroLogo />);
    
    const paths = container.querySelectorAll('path');
    
    // Should have multiple paths (brackets and waveforms)
    expect(paths.length).toBeGreaterThan(0);
  });

  it('should render waveform elements', () => {
    const { container } = render(<IntroLogo />);
    
    const paths = container.querySelectorAll('path');
    
    // Should have at least 4 paths (2 brackets + 2 waveforms)
    expect(paths.length).toBeGreaterThanOrEqual(4);
  });

  it('should render center dot', () => {
    const { container } = render(<IntroLogo />);
    
    const circle = container.querySelector('circle');
    
    expect(circle).toBeDefined();
    expect(circle?.getAttribute('cx')).toBe('100');
    expect(circle?.getAttribute('cy')).toBe('100');
  });

  /**
   * Test: Animation class is applied
   * Requirements: 2.2
   */
  it('should have intro-logo class for animation', () => {
    const { container } = render(<IntroLogo />);
    
    const logo = container.querySelector('.intro-logo');
    
    expect(logo?.classList.contains('intro-logo')).toBe(true);
  });

  it('should have presentation role', () => {
    const { container } = render(<IntroLogo />);
    
    const logo = container.querySelector('.intro-logo');
    
    expect(logo?.getAttribute('role')).toBe('presentation');
  });

  it('should be hidden from screen readers', () => {
    const { container } = render(<IntroLogo />);
    
    const logo = container.querySelector('.intro-logo');
    
    expect(logo?.getAttribute('aria-hidden')).toBe('true');
  });

  /**
   * Test: Responsive scaling
   * Requirements: 2.4
   */
  it('should have responsive SVG dimensions', () => {
    const { container } = render(<IntroLogo />);
    
    const svg = container.querySelector('svg');
    
    // SVG should use 100% width and height for responsiveness
    expect(svg?.getAttribute('width')).toBe('100%');
    expect(svg?.getAttribute('height')).toBe('100%');
  });

  it('should render without errors', () => {
    expect(() => render(<IntroLogo />)).not.toThrow();
  });
});
