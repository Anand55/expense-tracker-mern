import 'dotenv/config';
import { assertEnv, env } from './config/env';
import { connectDB } from './config/db';
import app from './app';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  assertEnv();
  await connectDB();

  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

main().catch((err) => {
  logger.error('Failed to start', err);
  process.exit(1);
});
