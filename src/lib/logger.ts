/**
 * Logger utility.
 * Replaces all console.log usage in the application.
 */

const isProduction = process.env.NODE_ENV === 'production';

const getTimestamp = (): string => new Date().toISOString();

export const logger = {
  debug(message: string, data?: unknown): void {
    if (isProduction) return;
    if (data !== undefined) {
      console.debug(`[DEBUG] [${getTimestamp()}] ${message}`, data);
    } else {
      console.debug(`[DEBUG] [${getTimestamp()}] ${message}`);
    }
  },

  info(message: string, data?: unknown): void {
    if (isProduction) return;
    if (data !== undefined) {
      console.info(`[INFO] [${getTimestamp()}] ${message}`, data);
    } else {
      console.info(`[INFO] [${getTimestamp()}] ${message}`);
    }
  },

  warn(message: string, data?: unknown): void {
    if (isProduction) {
      if (data !== undefined) {
        console.warn(message, data);
      } else {
        console.warn(message);
      }
    } else {
      if (data !== undefined) {
        console.warn(`[WARN] [${getTimestamp()}] ${message}`, data);
      } else {
        console.warn(`[WARN] [${getTimestamp()}] ${message}`);
      }
    }
  },

  error(message: string, data?: unknown): void {
    if (isProduction) {
      if (data !== undefined) {
        console.error(message, data);
      } else {
        console.error(message);
      }
    } else {
      const timestamp = `[ERROR] [${getTimestamp()}]`;
      
      if (data !== undefined) {
        // Handle Error objects specially to ensure they serialize properly
        if (data instanceof Error) {
          const errorDetails: Record<string, unknown> = {
            name: data.name,
            message: data.message,
          };

          // If it has a toJSON method, use it to get all properties
          if (typeof (data as any).toJSON === 'function') {
            Object.assign(errorDetails, (data as any).toJSON());
          }

          // Add stack trace
          if (data.stack) {
            errorDetails.stack = data.stack;
          }

          console.error(`${timestamp} ${message}`);
          console.error('Error Details:', errorDetails);
        } else {
          console.error(`${timestamp} ${message}`, data);
        }
      } else {
        console.error(`${timestamp} ${message}`);
      }
    }
  },
};
