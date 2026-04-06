// src/config/database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL, // full Neon connection string
  ssl: {
    rejectUnauthorized: false, // required for Neon (TLS)
  },
  autoLoadEntities: true,
  synchronize: process.env.DB_SYNC === 'true', // ⚠️ false in production
  logging: process.env.DB_LOGGING === 'true',
});
