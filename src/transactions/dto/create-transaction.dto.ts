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
  @IsNotEmpty()
  @MaxLength(50)
  level_id!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @IsNotEmpty()
  purchased_at!: string;
}
