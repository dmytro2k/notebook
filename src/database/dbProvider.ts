import config from '../config';
import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from './Schema';

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export class DrizzleProvider {
  private static drizzleInstance: NodePgDatabase<typeof schema>;

  public static getInstance() {
    if (!this.drizzleInstance) {
      this.drizzleInstance = drizzle(pool, { schema });
    }

    return this.drizzleInstance;
  }

  public static async runMigrations() {
    await migrate(this.getInstance(), { migrationsFolder: './drizzle' });
  }
}
