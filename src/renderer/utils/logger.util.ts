/* eslint-disable no-console */
import { NODE_ENVS } from '@/renderer/definitions/constants/shared.const';

class Logger {
  private isDevelopment =
    import.meta.env.VITE_NODE_ENV === NODE_ENVS.DEVELOPMENT;

  error(...args: unknown[]): void {
    if (this.isDevelopment) {
      console.error(...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.isDevelopment) {
      console.info(...args);
    }
  }

  log(...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.isDevelopment) {
      console.warn(...args);
    }
  }
}

export const logger = new Logger();
