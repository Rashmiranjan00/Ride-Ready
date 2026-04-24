/**
 * Simple structured logger for RideReady.
 * In production, this can be swapped for Sentry or similar.
 */

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (message: string, data?: unknown) => {
    if (isDev) console.log(`[INFO] ${message}`, data ?? '');
  },
  warn: (message: string, data?: unknown) => {
    if (isDev) console.warn(`[WARN] ${message}`, data ?? '');
  },
  error: (message: string, data?: unknown) => {
    console.error(`[ERROR] ${message}`, data ?? '');
  },
  debug: (message: string, data?: unknown) => {
    if (isDev) console.debug(`[DEBUG] ${message}`, data ?? '');
  },
};
