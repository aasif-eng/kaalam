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
  private addDays(base: Date, days: number): Date {
    return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  }

  // async purchase(dto: CreateTransactionDto): Promise<Transaction> {
  //   const purchasedAt = new Date(dto.purchased_at);
  //   if (Number.isNaN(purchasedAt.getTime())) {
  //     throw new BadRequestException('Invalid purchased_at timestamp.');
  //   }

  //   const latestTransaction = await this.transactionRepository.findOne({
  //     where: { device_id: dto.device_id },
  //     order: { expires_at: 'DESC' },
  //   });

  //   if (latestTransaction && (latestTransaction.expires_at == null || latestTransaction.expires_at > purchasedAt)) {
  //     const baseDate = latestTransaction.expires_at || purchasedAt;
  //     latestTransaction.expires_at = this.addDays(baseDate, 30);
  //     latestTransaction.isActive = true;
  //     latestTransaction.amount = Number(latestTransaction.amount) + dto.amount;
  //     return await this.transactionRepository.save(latestTransaction);
  //   }

  //   const transaction: Transaction = {
  //     transaction_id: uuidv4(),
  //     device_id: dto.device_id,
  //     level_id: dto.level_id,
  //     level_name: `Level_${dto.level_id}`,
  //     amount: dto.amount,
  //     purchased_at: purchasedAt,
  //     expires_at: this.addDays(purchasedAt, 30),
  //     isActive: true,
  //     created_at: new Date(),
  //   };

  //   return await this.transactionRepository.save(transaction);
  // }

  /**
   * GET /transactions?device_id=89hd-fhjd-dheu9
   * Return all purchases for a given device ID.
   */
  // async findByDevice(device_id: string): Promise<Transaction[]> {
  //   if (!device_id || !device_id.trim()) {
  //     throw new BadRequestException('Query param "device_id" is required.');
  //   }

  //   const results = await this.transactionRepository.find({
  //     where: { device_id },
  //     order: { created_at: 'DESC' },
  //   });

  //   if (results.length === 0) {
  //     throw new NotFoundException(
  //       `No transactions found for device ID "${device_id}".`,
  //     );
  //   }

  //   const now = new Date();
  //   const expiredToUpdate = results.filter(
  //     (transaction) => transaction.expires_at && transaction.isActive && transaction.expires_at <= now,
  //   );

  //   if (expiredToUpdate.length > 0) {
  //     for (const transaction of expiredToUpdate) {
  //       transaction.isActive = false;
  //     }
  //     await this.transactionRepository.save(expiredToUpdate);
  //   }

  //   return results.map((transaction) => ({
  //     ...transaction,
  //     isActive: transaction.expires_at == null || transaction.expires_at > now,
  //   }));
  // }




  async purchase(dto: CreateTransactionDto): Promise<Transaction> {
  const purchasedAt = new Date(dto.purchased_at);
  if (Number.isNaN(purchasedAt.getTime())) {
    throw new BadRequestException('Invalid purchased_at timestamp.');
  }

  // Find the currently active transaction for this device (if any)
  const activeTransaction = await this.transactionRepository.findOne({
    where: { device_id: dto.device_id, isActive: true },
    order: { expires_at: 'DESC' },
  });

  // Deactivate the previous active transaction
  if (activeTransaction) {
    activeTransaction.isActive = false;
    await this.transactionRepository.save(activeTransaction);
  }

  // Always create a fresh transaction
  const transaction: Transaction = {
    transaction_id: uuidv4(),
    device_id: dto.device_id,
    level_id: dto.level_id,
    level_name: `Level_${dto.level_id}`,
    amount: dto.amount,
    purchased_at: purchasedAt,
    expires_at: this.addDays(purchasedAt, 30),
    isActive: true,
    created_at: new Date(),
  };

  return await this.transactionRepository.save(transaction);
}

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

  // Auto-expire any transactions that have passed their expiry date
  const now = new Date();
  const expiredToUpdate = results.filter(
    (t) => t.expires_at && t.isActive && t.expires_at <= now,
  );

  if (expiredToUpdate.length > 0) {
    for (const t of expiredToUpdate) {
      t.isActive = false;
    }
    await this.transactionRepository.save(expiredToUpdate);
  }

  // Return all transactions as persisted (no in-memory override)
  return results;
}
}
