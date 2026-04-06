// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // 1. Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Connect to Neon via DATABASE_URL
    TypeOrmModule.forRoot(getDatabaseConfig()),

    // 3. Feature modules
    TransactionsModule,
  ],
})
export class AppModule {}
