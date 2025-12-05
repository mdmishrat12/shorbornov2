import { defineConfig } from 'drizzle-kit';

// Extract hostname and force IPv4
const databaseUrl = new URL(process.env.DATABASE_URL!);
// Add IPv4 force parameter to the connection string
const ipv4Url = process.env.DATABASE_URL!.replace(
  databaseUrl.hostname, 
  databaseUrl.hostname
);

export default defineConfig({
  schema: './schema/user.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: ipv4Url,
  },
});