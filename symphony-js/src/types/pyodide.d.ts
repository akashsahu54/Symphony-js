/**
 * Type definitions for Pyodide
 */

interface PyodideInterface {
  runPythonAsync(code: string): Promise<any>;
  runPython(code: string): any;
  setStdout(options: { batched: (text: string) => void }): void;
  loadPackage(packages: string | string[]): Promise<void>;
  globals: any;
}

interface Window {
  loadPyodide(config: { indexURL: string }): Promise<PyodideInterface>;
}
