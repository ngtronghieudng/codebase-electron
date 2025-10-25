/* eslint-disable no-console */
import { NODE_ENVS } from '@/shared/definitions/constants/shared.const';

interface ILogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelop = import.meta.env.VITE_NODE_ENV === NODE_ENVS.DEVELOP;

  error(message: string, error?: unknown, context?: ILogContext): void {
    const errorData = {
      context,
      error: error instanceof Error ? error.message : error,
      message,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelop) console.error(`[Error] ${message}`, errorData);
  }

  info(message: string, context?: ILogContext): void {
    if (this.isDevelop) {
      console.info(`[Info] ${message}`, {
        context,
        timestamp: new Date().toISOString(),
      });
    }
  }

  warn(message: string, context?: ILogContext): void {
    if (this.isDevelop) {
      console.warn(`[Warning] ${message}`, {
        context,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const logger = new Logger();
