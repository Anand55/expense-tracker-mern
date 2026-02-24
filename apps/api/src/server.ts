import { assertEnv } from './config/env';
import { connectDb } from './config/db';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  assertEnv();
  await connectDb();

  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

main().catch((err) => {
  logger.error('Failed to start', err);
  process.exit(1);
});
