// src/transactions/dto/create-transaction.dto.ts

import {
  IsISO8601,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  device_id!: string;

  @IsString()
  level_id!: string;

  @IsPositive()
  amount!: number;

  @IsISO8601()
  purchased_at!: string;
}
