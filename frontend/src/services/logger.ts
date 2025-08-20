/* eslint-disable no-console */
import { showLogger } from '@/constant/env';

function logger(comment?: string, object?: unknown): void {
  if (!showLogger) return;

  console.log(comment, object);
}

export { logger };
