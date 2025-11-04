export class Log {
  static debug(...args: any[]) {
    console.log(`[E2E]`, ...args);
  }

  static log(...args: any[]) {
    console.log(`[E2E]`, ...args);
  }

  static warn(...args: any[]) {
    console.warn(`[E2E]`, ...args);
  }

  static error(...args: any[]) {
    console.error(`[E2E]`, ...args);
  }
}
