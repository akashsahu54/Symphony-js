/**
 * Code examples for Symphony.js
 * Pre-written samples to demonstrate different moods
 */

export interface CodeExample {
  id: string;
  name: string;
  language: 'javascript' | 'python';
  code: string;
  expectedMood: 'HARMONIOUS' | 'DISCORDANT' | 'INTENSE';
  description: string;
}

export const codeExamples: CodeExample[] = [
  {
    id: 'harmonious-js',
    name: '✨ Clean Function',
    language: 'javascript',
    expectedMood: 'HARMONIOUS',
    description: 'Well-documented, simple code',
    code: `// Simple greeting function with clear documentation
function greet(name) {
  // Return a friendly greeting message
  return \`Hello, \${name}! Welcome to Symphony.js!\`;
}

// Example usage
const message = greet("Developer");
console.log(message);`
  },
  {
    id: 'discordant-js',
    name: '⚠️ Buggy Code',
    language: 'javascript',
    expectedMood: 'DISCORDANT',
    description: 'Code with syntax errors',
    code: `// This function has syntax errors
function broken(
  return "missing opening brace"
}

// Unmatched parenthesis
const result = calculate(5, 10;

// Misspelled keyword
fucntion typo() {
  retunr "error";
}`
  },
  {
    id: 'intense-js',
    name: '🔥 Complex Algorithm',
    language: 'javascript',
    expectedMood: 'INTENSE',
    description: 'Recursive Fibonacci with high complexity',
    code: `// Recursive Fibonacci - computationally intense
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Nested loops with high complexity
function matrixMultiply(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}`
  },
  {
    id: 'harmonious-py',
    name: '✨ Clean Python',
    language: 'python',
    expectedMood: 'HARMONIOUS',
    description: 'Well-structured Python code',
    code: `# Simple calculator with clear documentation
def add(a, b):
    """Add two numbers together."""
    return a + b

def subtract(a, b):
    """Subtract b from a."""
    return a - b

# Example usage
result = add(10, 5)
print(f"Result: {result}")`
  },
  {
    id: 'discordant-py',
    name: '⚠️ Python Errors',
    language: 'python',
    expectedMood: 'DISCORDANT',
    description: 'Python with syntax issues',
    code: `# Missing colon
def broken()
    return "error"

# Incorrect indentation
def bad_indent():
return "wrong"

# Misspelled keyword
dfe typo():
    retunr "mistake"`
  },
  {
    id: 'intense-py',
    name: '🔥 Recursive Python',
    language: 'python',
    expectedMood: 'INTENSE',
    description: 'Complex recursive algorithm',
    code: `# Recursive factorial with memoization
def factorial(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return 1
    memo[n] = n * factorial(n - 1, memo)
    return memo[n]

# Deeply nested function
def complex_nested(x):
    if x > 0:
        if x > 10:
            if x > 20:
                if x > 30:
                    return factorial(x)
    return 0`
  }
];

export const getExamplesByLanguage = (language: 'javascript' | 'python'): CodeExample[] => {
  return codeExamples.filter(example => example.language === language);
};

export const getExampleById = (id: string): CodeExample | undefined => {
  return codeExamples.find(example => example.id === id);
};
