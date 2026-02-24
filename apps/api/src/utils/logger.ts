const prefix = '[expense-api]';

export const logger = {
  info(message: string, ...args: unknown[]): void {
    console.log(prefix, message, ...args);
  },
  warn(message: string, ...args: unknown[]): void {
    console.warn(prefix, message, ...args);
  },
  error(message: string, ...args: unknown[]): void {
    console.error(prefix, message, ...args);
  },
};
