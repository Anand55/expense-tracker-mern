import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongoUri: process.env.MONGO_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};

export function assertEnv(): void {
  if (!env.mongoUri) throw new Error('MONGO_URI is required');
  if (!env.jwtSecret) throw new Error('JWT_SECRET is required');
}
