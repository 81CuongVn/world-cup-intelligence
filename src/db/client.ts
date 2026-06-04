import type { AppEnv } from '../env';

export function getDb(env: AppEnv): D1Database {
  return env.DB;
}
