// src/transactions/transaction.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_id!: string;

  @Index() // indexed for fast GET queries by device_id
  @Column({ type: 'varchar', length: 100 })
  device_id!: string;

  @Column({ type: 'varchar', length: 50 })
  level_id!: string;

  @Column({ type: 'varchar', length: 100 })
  level_name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'timestamptz' })
  purchased_at!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
