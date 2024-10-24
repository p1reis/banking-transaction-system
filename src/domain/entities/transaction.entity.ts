import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { TransactionTypeEnum } from '@prisma/client';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column({ type: 'varchar', name: 'cuid', unique: true })
  cuid: string;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  type: TransactionTypeEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column()
  accountFromCuid: string;

  @Column({ nullable: true })
  accountToCuid: string;

  @ManyToOne(() => Account, (account) => account.transactionsFrom, {
    eager: true,
  })
  accountFrom: Account;

  @ManyToOne(() => Account, (account) => account.transactionsTo, {
    eager: true,
    nullable: true,
  })
  accountTo: Account;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;
}
