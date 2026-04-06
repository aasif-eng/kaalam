// src/transactions/transactions.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async purchase(@Body() dto: CreateTransactionDto): Promise<{
    success: boolean;
    data: Transaction;
  }> {
    const transaction = await this.transactionsService.purchase(dto);
    return { success: true, data: transaction };
  }

  /**
   * GET /transactions?device_id=89hd-fhjd-dheu9
   *
   * Response 200:
   * {
   *   "success": true,
   *   "device_id": "89hd-fhjd-dheu9",
   *   "count": 2,
   *   "data": [ ...transactions ]
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findByDevice(@Query('device_id') device_id: string): Promise<{
    success: boolean;
    device_id: string;
    count: number;
    data: Transaction[];
  }> {
    const transactions = await this.transactionsService.findByDevice(device_id);
    return {
      success: true,
      device_id,
      count: transactions.length,
      data: transactions,
    };
  }
}
