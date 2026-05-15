// src/config/database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL, // full Neon connection string
    ssl: {
      rejectUnauthorized: false, // required for Neon (TLS)
    },
    autoLoadEntities: true,
    synchronize:
      process.env.DB_SYNC === 'true' || (!isProduction && process.env.DB_SYNC !== 'false'),
    logging: process.env.DB_LOGGING === 'true',
  };
};
