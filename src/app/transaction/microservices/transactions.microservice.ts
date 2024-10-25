import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { CreateDepositDto } from '../dto/create-deposit.dto';

import { Controller, Inject } from '@nestjs/common';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EventPattern } from '@nestjs/microservices';
import { CreateWithdrawDto } from '../dto/create-withdraw.dto';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import {
  DepositMapper,
  TransferMapper,
  WithdrawMapper,
} from '../../mappers/transaction.mapper';
import { Cache } from 'cache-manager';

@Controller()
export class TransactionsMicroservice {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  @EventPattern('transaction.deposit')
  async processDeposit({ from, value }: CreateDepositDto) {
    const account = await this.accountRepository.findUnique(from);

    if (!account) {
      throw new Error('Account not found.');
    }
    const cuid = account.cuid;

    const newBalance = account.balance + value;

    await this.accountRepository.updateBalance(cuid, newBalance);
    const transaction = await this.createTransaction({
      type: 'DEPOSIT',
      cuid,
      value,
    });

    await this.cacheManager.set(`balance_${from}`, account.balance + value);
    await this.cacheManager.set(`deposit_${from}`, transaction.cuid);

    return DepositMapper.map(transaction);
  }

  @EventPattern('transaction.withdraw')
  async processWithdraw({ from, value }: CreateWithdrawDto) {
    const account = await this.accountRepository.findUnique(from);

    if (!account) {
      throw new Error('Account not found.');
    }
    const cuid = account.cuid;
    const balance = account.balance;

    if (balance < value) {
      throw new Error(
        `Your withdraw value can't be lower than your current balance`,
      );
    }

    const newBalance = account.balance - value;

    await this.accountRepository.updateBalance(cuid, newBalance);
    const transaction = await this.createTransaction({
      type: 'WITHDRAW',
      cuid,
      value,
    });

    await this.cacheManager.set(`balance_${from}`, account.balance + value);
    await this.cacheManager.set(`withdraw_${from}`, transaction.cuid);
    return WithdrawMapper.map(transaction);
  }

  @EventPattern('transaction.transfer')
  async processTransfer({ from, to, value }: CreateTransferDto) {
    const accountFrom = await this.accountRepository.findUnique(from);
    const accountTo = await this.accountRepository.findUnique(to);

    if (!accountFrom) {
      throw new Error('Origin account not found.');
    }

    if (!accountTo) {
      throw new Error('Destiny account not found.');
    }

    const origin = {
      cuid: accountFrom.cuid,
      balance: accountFrom.balance,
      value: value,
    };

    const destiny = {
      cuid: accountTo.cuid,
      balance: accountTo.balance,
      value: value,
    };

    await this.accountRepository.updateBalance(
      origin.cuid,
      origin.balance - value,
    );
    await this.accountRepository.updateBalance(
      destiny.cuid,
      destiny.balance + value,
    );
    const transaction = await this.createTransaction({
      type: 'TRANSFER',
      cuid: origin.cuid,
      to: destiny.cuid,
      value,
    });

    await this.cacheManager.set(`balance_${from}`, origin.balance + value);
    await this.cacheManager.set(`balance_${to}`, destiny.balance + value);
    await this.cacheManager.set(`transferFrom_${from}`, transaction.cuid);
    await this.cacheManager.set(`transferTo_${to}`, transaction.cuid);
    return TransferMapper.map(transaction);
  }

  async createTransaction({ type, cuid, to, value }: CreateTransactionDto) {
    return await this.transactionRepository.create({
      type,
      accountFrom: { connect: { cuid: cuid } },
      accountTo: { connect: { cuid: to ? to : cuid } },
      value,
    });
  }
}
