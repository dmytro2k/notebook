import config from './src/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/database/Schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});

// import { Config } from 'drizzle-kit';
// export default {
//   out: './drizzle',
//   schema: './src/database/Schema/index.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: config.DATABASE_URL,
//   },
// } satisfies Config;
