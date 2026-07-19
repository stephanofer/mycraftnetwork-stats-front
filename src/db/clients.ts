import { RPG_DATABASE_URL, SKINS_DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/mysql2";
import mysql, { type Pool, type QueryOptions } from "mysql2/promise";

const QUERY_TIMEOUT_MS = 5_000;
type QueryValues = Parameters<Pool["query"]>[1];
type ExecuteValues = Parameters<Pool["execute"]>[1];

const COMMON_POOL_OPTIONS = {
  waitForConnections: true,
  connectTimeout: 5_000,
  idleTimeout: 60_000,
  queueLimit: 8,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
} as const;

export const rpgPool = enforceQueryTimeout(mysql.createPool({
  ...COMMON_POOL_OPTIONS,
  uri: RPG_DATABASE_URL,
  connectionLimit: 2,
}));

export const skinsPool = enforceQueryTimeout(mysql.createPool({
  ...COMMON_POOL_OPTIONS,
  uri: SKINS_DATABASE_URL,
  connectionLimit: 1,
  queueLimit: 4,
}));

export const rpgDb = drizzle({ client: rpgPool });
export const skinsDb = drizzle({ client: skinsPool });

function enforceQueryTimeout(pool: Pool): Pool {
  const query = pool.query.bind(pool);
  const execute = pool.execute.bind(pool);
  const options = (statement: string | QueryOptions): QueryOptions =>
    typeof statement === "string"
      ? { sql: statement, timeout: QUERY_TIMEOUT_MS }
      : { ...statement, timeout: Math.min(statement.timeout ?? QUERY_TIMEOUT_MS, QUERY_TIMEOUT_MS) };

  pool.query = ((statement: string | QueryOptions, values?: QueryValues) =>
    query(options(statement), values)) as Pool["query"];
  pool.execute = ((statement: string | QueryOptions, values?: ExecuteValues) =>
    execute(options(statement), values)) as Pool["execute"];
  return pool;
}
