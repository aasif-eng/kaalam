// src/transactions/dto/create-transaction.dto.ts

import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  device_id!: string;

  @IsString()
  level_id!: string;

  @IsPositive()
  amount!: number;

  @IsNotEmpty()
  purchased_at!: string;
}
