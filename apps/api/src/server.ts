import 'dotenv/config';
import { assertEnv } from './config/env';
import { connectDB } from './config/db';
import app from './app';
import { logger } from './utils/logger';

const port = Number(process.env.PORT) || 5001;

async function main(): Promise<void> {
  assertEnv();
  await connectDB();

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}

main().catch((err) => {
  logger.error('Failed to start', err);
  process.exit(1);
});
