/**
 * Language detection utility for Symphony.js
 * Auto-detects programming language from code content
 */

import type { LanguageType } from '../types/editor';

interface LanguageSignature {
  language: LanguageType;
  keywords: string[];
  patterns: RegExp[];
  weight: number;
}

const languageSignatures: LanguageSignature[] = [
  {
    language: 'python',
    keywords: ['def', 'import', 'from', 'class', 'self', 'elif', 'None', 'True', 'False', '__init__', 'print'],
    patterns: [
      /^def\s+\w+\s*\(/m,           // def function_name(
      /^class\s+\w+/m,              // class ClassName
      /^import\s+\w+/m,             // import module
      /^from\s+\w+\s+import/m,      // from module import
      /:\s*$/m,                     // lines ending with :
      /^\s+\w+/m,                   // indentation-based blocks
      /#\s*.+$/m,                   // # comments
      /print\s*\(/,                 // print()
      /self\./,                     // self.
      /elif\s+/,                    // elif
    ],
    weight: 0
  },
  {
    language: 'javascript',
    keywords: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await'],
    patterns: [
      /function\s+\w+\s*\(/,        // function name(
      /const\s+\w+\s*=/,            // const name =
      /let\s+\w+\s*=/,              // let name =
      /var\s+\w+\s*=/,              // var name =
      /=>\s*{?/,                    // arrow functions =>
      /\/\/\s*.+$/m,                // // comments
      /\/\*[\s\S]*?\*\//,           // /* */ comments
      /console\.log\(/,             // console.log(
      /\bimport\s+.*\bfrom\b/,      // import ... from
      /\bexport\s+(default|const|function)/,  // export
      /{\s*$/m,                     // lines ending with {
      /;\s*$/m,                     // lines ending with ;
    ],
    weight: 0
  }
];

/**
 * Detect programming language from code content
 * @param code - The code to analyze
 * @returns Detected language ('javascript' or 'python')
 */
export function detectLanguage(code: string): LanguageType {
  if (!code || code.trim().length === 0) {
    return 'javascript'; // Default to JavaScript for empty code
  }

  // Reset weights
  languageSignatures.forEach(sig => sig.weight = 0);

  const lowerCode = code.toLowerCase();
  const lines = code.split('\n');

  // Check each language signature
  languageSignatures.forEach(signature => {
    // Check keywords
    signature.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = code.match(regex);
      if (matches) {
        signature.weight += matches.length * 2; // Keywords are strong indicators
      }
    });

    // Check patterns
    signature.patterns.forEach(pattern => {
      if (pattern.test(code)) {
        signature.weight += 3; // Patterns are very strong indicators
      }
    });
  });

  // Additional Python-specific checks
  const pythonSig = languageSignatures.find(s => s.language === 'python');
  if (pythonSig) {
    // Check for indentation-based structure (Python hallmark)
    let indentedLines = 0;
    lines.forEach(line => {
      if (/^\s{4,}/.test(line) && line.trim().length > 0) {
        indentedLines++;
      }
    });
    if (indentedLines > 2) {
      pythonSig.weight += indentedLines;
    }

    // Check for colon-based blocks
    const colonLines = lines.filter(line => /:\s*$/.test(line.trim()));
    pythonSig.weight += colonLines.length * 2;

    // Check for Python-specific syntax
    if (/\bdef\s+\w+\s*\(.*\)\s*:/.test(code)) pythonSig.weight += 5;
    if (/\bif\s+.*:\s*$/.test(code)) pythonSig.weight += 3;
    if (/\bfor\s+\w+\s+in\s+/.test(code)) pythonSig.weight += 4;
  }

  // Additional JavaScript-specific checks
  const jsSig = languageSignatures.find(s => s.language === 'javascript');
  if (jsSig) {
    // Check for semicolons (common in JS)
    const semicolons = (code.match(/;/g) || []).length;
    jsSig.weight += semicolons;

    // Check for curly braces
    const braces = (code.match(/[{}]/g) || []).length;
    jsSig.weight += braces;

    // Check for JavaScript-specific syntax
    if (/\bfunction\s+\w+\s*\(/.test(code)) jsSig.weight += 5;
    if (/\bconst\s+\w+\s*=/.test(code)) jsSig.weight += 4;
    if (/=>/.test(code)) jsSig.weight += 4;
    if (/console\./.test(code)) jsSig.weight += 5;
  }

  // Find language with highest weight
  const detected = languageSignatures.reduce((prev, current) => 
    current.weight > prev.weight ? current : prev
  );

  // Log detection for debugging
  console.log('Language Detection:', {
    python: languageSignatures.find(s => s.language === 'python')?.weight || 0,
    javascript: languageSignatures.find(s => s.language === 'javascript')?.weight || 0,
    detected: detected.language
  });

  // If weights are very close or both zero, default to JavaScript
  if (detected.weight === 0) {
    return 'javascript';
  }

  return detected.language;
}

/**
 * Check if code looks like a specific language
 * @param code - The code to check
 * @param language - The language to check for
 * @returns Confidence score (0-100)
 */
export function getLanguageConfidence(code: string, language: LanguageType): number {
  const signature = languageSignatures.find(s => s.language === language);
  if (!signature) return 0;

  let score = 0;
  const maxScore = (signature.keywords.length * 2) + (signature.patterns.length * 3);

  // Check keywords
  signature.keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = code.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  });

  // Check patterns
  signature.patterns.forEach(pattern => {
    if (pattern.test(code)) {
      score += 3;
    }
  });

  return Math.min(100, Math.round((score / maxScore) * 100));
}
