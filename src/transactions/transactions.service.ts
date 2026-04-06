// src/transactions/transactions.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { findLevelById } from '../levels/levels.data';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * POST /transactions
   * Record a new level purchase for a device.
   */
  async purchase(dto: CreateTransactionDto): Promise<Transaction> {
    // Validate that the level actually exists in our static catalogue
    const level = findLevelById(dto.level_id);
    if (!level) {
      throw new BadRequestException(
        `Level "${dto.level_id}" does not exist. ` +
          `Valid levels: LVL_001 – LVL_005`,
      );
    }

    // Optionally validate amount matches the catalogue price (within 1 cent tolerance)
    const diff = Math.abs(dto.amount - level.price);
    if (diff > 0.01) {
      throw new BadRequestException(
        `Amount mismatch. Expected ${level.price} for level "${level.name}", got ${dto.amount}.`,
      );
    }

    const transaction: Transaction = {
      transaction_id: uuidv4(),
      device_id: dto.device_id,
      level_id: dto.level_id,
      level_name: level.name,
      amount: dto.amount,
      purchased_at: new Date(dto.purchased_at),
      created_at: new Date(),
    };

    return await this.transactionRepository.save(transaction);
  }

  /**
   * GET /transactions?device_id=89hd-fhjd-dheu9
   * Return all purchases for a given device ID.
   */
  async findByDevice(device_id: string): Promise<Transaction[]> {
    if (!device_id || !device_id.trim()) {
      throw new BadRequestException('Query param "device_id" is required.');
    }

    const results = await this.transactionRepository.find({
      where: { device_id },
      order: { created_at: 'DESC' },
    });

    if (results.length === 0) {
      throw new NotFoundException(
        `No transactions found for device ID "${device_id}".`,
      );
    }

    return results;
  }
}
