/**
 * Python execution service using Pyodide
 * Runs Python code in the browser via WebAssembly
 */

// Pyodide instance
let pyodideInstance: PyodideInterface | null = null;
let isLoading = false;
let loadPromise: Promise<PyodideInterface> | null = null;

/**
 * Load Pyodide runtime
 */
async function loadPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isLoading && loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = (async () => {
    try {
      // Load Pyodide from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Initialize Pyodide
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });

      console.log('✅ Pyodide loaded successfully');
      return pyodideInstance;
    } catch (error) {
      console.error('❌ Failed to load Pyodide:', error);
      throw error;
    } finally {
      isLoading = false;
    }
  })();

  return loadPromise;
}

/**
 * Execute Python code
 */
export async function runPythonCode(code: string): Promise<string> {
  try {
    // Load Pyodide if not already loaded
    const pyodide = await loadPyodide();

    // Capture stdout
    let output = '';
    pyodide.setStdout({
      batched: (text: string) => {
        output += text + '\n';
      }
    });

    // Run the Python code
    try {
      const result = await pyodide.runPythonAsync(code);
      
      // If there's a return value and no print output, show it
      if (result !== undefined && result !== null && !output) {
        output = String(result);
      }

      return output || 'Code executed successfully (no output)';
    } catch (error: any) {
      // Python execution error
      return `Python Error:\n${error.message}`;
    }
  } catch (error: any) {
    // Pyodide loading error
    return `Failed to initialize Python runtime:\n${error.message}\n\nTrying to load Pyodide from CDN...`;
  }
}

/**
 * Check if Pyodide is loaded
 */
export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null;
}

/**
 * Get loading status
 */
export function isPyodideLoading(): boolean {
  return isLoading;
}
