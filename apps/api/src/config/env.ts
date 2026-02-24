import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function parseCorsOrigin(): string | string[] {
  const raw = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return list.length === 1 ? list[0] : list;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5001', 10),
  mongoUri: process.env.MONGO_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  corsOrigin: parseCorsOrigin(),
};

export function assertEnv(): void {
  if (!env.mongoUri) throw new Error('MONGO_URI is required');
  if (!env.jwtSecret) throw new Error('JWT_SECRET is required');
}
