export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, meta || '');
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, meta || '');
  },
  
  error: (message: string, meta?: any) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, meta || '');
  },
  
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] DEBUG: ${message}`, meta || '');
    }
  }
};
