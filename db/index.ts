import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from './connection';
import * as schema from './../schema/user.schema'; // Make sure this path is correct

export const db = drizzle(pool, { schema });