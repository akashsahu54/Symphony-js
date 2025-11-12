/**
 * Unit tests for CodeAnalyzer service
 * Requirements: 3.2, 3.4, 3.6, 7.1, 7.2, 7.3
 */

import { describe, it, expect } from 'vitest';
import {
  detectSyntaxErrors,
  calculateNestingDepth,
  detectRecursion,
  detectComments,
  analyze,
  analyzeForComposition
} from './CodeAnalyzer';

describe('CodeAnalyzer', () => {
  describe('detectSyntaxErrors', () => {
    it('should detect no errors in valid JavaScript code', () => {
      const code = 'function hello() { return true; }';
      const errors = detectSyntaxErrors(code, 'javascript');
      expect(errors).toHaveLength(0);
    });

    it('should detect misspelled function keyword', () => {
      const code = 'fucntion hello() { return true; }';
      const errors = detectSyntaxErrors(code, 'javascript');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('function');
    });

    it('should detect misspelled return keyword', () => {
      const code = 'function hello() { retunr false; }';
      const errors = detectSyntaxErrors(code, 'javascript');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('return');
    });

    it('should detect unmatched parentheses', () => {
      const code = 'function hello( { return false; }';
      const errors = detectSyntaxErrors(code, 'javascript');
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should detect unmatched braces', () => {
      const code = 'function hello() { return false;';
      const errors = detectSyntaxErrors(code, 'javascript');
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty code', () => {
      const errors = detectSyntaxErrors('', 'javascript');
      expect(errors).toHaveLength(0);
    });
  });

  describe('calculateNestingDepth', () => {
    it('should return 0 for empty code', () => {
      const depth = calculateNestingDepth('');
      expect(depth).toBe(0);
    });

    it('should calculate depth 1 for simple function', () => {
      const code = 'function hello() { return true; }';
      const depth = calculateNestingDepth(code);
      expect(depth).toBe(1);
    });

    it('should calculate depth for nested blocks', () => {
      const code = `
        function outer() {
          if (true) {
            for (let i = 0; i < 10; i++) {
              console.log(i);
            }
          }
        }
      `;
      const depth = calculateNestingDepth(code);
      expect(depth).toBeGreaterThan(2);
    });

    it('should handle indentation-based nesting', () => {
      const code = `
def outer():
    if True:
        for i in range(10):
            print(i)
      `;
      const depth = calculateNestingDepth(code);
      expect(depth).toBeGreaterThan(0);
    });
  });

  describe('detectRecursion', () => {
    it('should detect recursive function', () => {
      const code = `
        function factorial(n) {
          if (n <= 1) return 1;
          return n * factorial(n - 1);
        }
      `;
      const hasRecursion = detectRecursion(code);
      expect(hasRecursion).toBe(true);
    });

    it('should not detect recursion in non-recursive code', () => {
      const code = 'function hello() { return true; }';
      const hasRecursion = detectRecursion(code);
      expect(hasRecursion).toBe(false);
    });

    it('should return false for empty code', () => {
      const hasRecursion = detectRecursion('');
      expect(hasRecursion).toBe(false);
    });
  });

  describe('detectComments', () => {
    it('should detect single-line comments in JavaScript', () => {
      const code = '// This is a comment\nfunction hello() {}';
      const hasComments = detectComments(code);
      expect(hasComments).toBe(true);
    });

    it('should detect multi-line comments in JavaScript', () => {
      const code = '/* This is a comment */\nfunction hello() {}';
      const hasComments = detectComments(code);
      expect(hasComments).toBe(true);
    });

    it('should detect Python comments', () => {
      const code = '# This is a comment\ndef hello():\n    pass';
      const hasComments = detectComments(code);
      expect(hasComments).toBe(true);
    });

    it('should return false for code without comments', () => {
      const code = 'function hello() { return true; }';
      const hasComments = detectComments(code);
      expect(hasComments).toBe(false);
    });

    it('should return false for empty code', () => {
      const hasComments = detectComments('');
      expect(hasComments).toBe(false);
    });
  });

  describe('analyze', () => {
    it('should return HARMONIOUS mood for clean, commented code', () => {
      const code = '// Good function\nfunction hello() { return true; }';
      const result = analyze(code, 'javascript');
      
      expect(result.mood).toBe('HARMONIOUS');
      expect(result.rootKey).toMatch(/^[A-G][#b]?m?$/);
      expect(result.tempo).toBeGreaterThanOrEqual(60);
      expect(result.tempo).toBeLessThanOrEqual(180);
      expect(result.intensity).toBeGreaterThanOrEqual(0);
      expect(result.intensity).toBeLessThanOrEqual(1);
    });

    it('should return DISCORDANT mood for code with syntax errors', () => {
      const code = 'fucntion helo( { retunr false }';
      const result = analyze(code, 'javascript');
      
      expect(result.mood).toBe('DISCORDANT');
      expect(result.rootKey).toContain('m'); // Minor key
      expect(result.intensity).toBeGreaterThan(0.5);
    });

    it('should return INTENSE mood for deeply nested code', () => {
      const code = `
        function complex() {
          if (true) {
            for (let i = 0; i < 10; i++) {
              while (true) {
                if (i > 5) {
                  break;
                }
              }
            }
          }
        }
      `;
      const result = analyze(code, 'javascript');
      
      expect(result.mood).toBe('INTENSE');
      expect(result.intensity).toBeGreaterThan(0.7);
    });

    it('should return INTENSE mood for recursive code', () => {
      const code = `
        function factorial(n) {
          if (n <= 1) return 1;
          return n * factorial(n - 1);
        }
      `;
      const result = analyze(code, 'javascript');
      
      expect(result.mood).toBe('INTENSE');
    });

    it('should return valid JSON format', () => {
      const code = 'function hello() { return true; }';
      const result = analyze(code, 'javascript');
      
      expect(result).toHaveProperty('tempo');
      expect(result).toHaveProperty('rootKey');
      expect(result).toHaveProperty('intensity');
      expect(result).toHaveProperty('mood');
      expect(typeof result.tempo).toBe('number');
      expect(typeof result.rootKey).toBe('string');
      expect(typeof result.intensity).toBe('number');
      expect(['DISCORDANT', 'HARMONIOUS', 'INTENSE']).toContain(result.mood);
    });
  });

  describe('analyzeForComposition', () => {
    it('should return empty array for empty code', () => {
      const sections = analyzeForComposition('', 'javascript');
      expect(sections).toHaveLength(0);
    });

    it('should parse import statements', () => {
      const code = 'import React from "react";\nimport { useState } from "react";';
      const sections = analyzeForComposition(code, 'javascript');
      
      expect(sections.length).toBeGreaterThan(0);
      expect(sections[0].type).toBe('import');
      expect(sections[0].instrument).toBe('rhythm');
    });

    it('should parse function declarations', () => {
      const code = 'function hello() { return true; }';
      const sections = analyzeForComposition(code, 'javascript');
      
      expect(sections.length).toBeGreaterThan(0);
      const funcSection = sections.find(s => s.type === 'function');
      expect(funcSection).toBeDefined();
      expect(funcSection?.instrument).toBe('melody');
    });

    it('should parse return statements', () => {
      const code = 'function hello() {\n  return true;\n}';
      const sections = analyzeForComposition(code, 'javascript');
      
      const returnSection = sections.find(s => s.type === 'return');
      expect(returnSection).toBeDefined();
      expect(returnSection?.instrument).toBe('harmony');
    });

    it('should allocate duration within 15-second constraint', () => {
      const code = `
        import React from "react";
        function hello() {
          return true;
        }
      `;
      const sections = analyzeForComposition(code, 'javascript');
      
      const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
      expect(totalDuration).toBeLessThanOrEqual(15);
      expect(totalDuration).toBeGreaterThan(0);
    });

    it('should generate note sequences for each section', () => {
      const code = 'function hello() { return true; }';
      const sections = analyzeForComposition(code, 'javascript');
      
      sections.forEach(section => {
        expect(section.notes).toBeDefined();
        expect(Array.isArray(section.notes)).toBe(true);
        expect(section.notes.length).toBeGreaterThan(0);
      });
    });

    it('should map sections to appropriate instruments', () => {
      const code = `
        import React from "react";
        function hello() {
          return true;
        }
      `;
      const sections = analyzeForComposition(code, 'javascript');
      
      sections.forEach(section => {
        expect(['rhythm', 'harmony', 'melody']).toContain(section.instrument);
      });
    });
  });
});
