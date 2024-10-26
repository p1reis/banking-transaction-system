import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { CreateDepositDto } from '../dto/create-deposit.dto';

import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { CreateWithdrawDto } from '../dto/create-withdraw.dto';
import { CreateTransferDto } from '../dto/create-transfer.dto';

@Controller()
export class TransactionsMicroservice {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
  ) { }

  async processDeposit({ from, value }: CreateDepositDto) {
    const account = await this.checkAccountUtils.checkIfAccountExistsByNumber(from);

    if (!account) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }
    const cuid = account.cuid;

    const newBalance = account.balance + value;

    const updated = await this.accountRepository.updateBalance(cuid, newBalance);
    await this.createTransaction({
      type: 'DEPOSIT',
      cuid,
      value,
    });

    await this.sendAccountToCache.sendingAccountsToCache([updated])
  }

  async processWithdraw({ from, value }: CreateWithdrawDto) {
    const account = await this.checkAccountUtils.checkIfAccountExistsByNumber(from);

    if (!account) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }

    if (account.balance < value) {
      throw new HttpException(
        'Your balance is not enough to proceed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cuid = account.cuid;

    const newBalance = account.balance - value;

    const updated = await this.accountRepository.updateBalance(cuid, newBalance);
    await this.createTransaction({
      type: 'WITHDRAW',
      cuid,
      value,
    });

    await this.sendAccountToCache.sendingAccountsToCache([updated])
  }

  async processTransfer({ from, to, value }: CreateTransferDto) {
    const accountFrom = await this.checkAccountUtils.checkIfAccountExistsByNumber(from);
    const accountTo = await this.checkAccountUtils.checkIfAccountExistsByNumber(to);

    if (!accountFrom) {
      throw new HttpException('Origin account not found.', HttpStatus.NOT_FOUND);
    }

    if (!accountTo) {
      throw new HttpException('Destiny account not found.', HttpStatus.NOT_FOUND);
    }

    const origin = {
      cuid: accountFrom.cuid,
      balance: accountFrom.balance,
      value: value,
    }

    const destiny = {
      cuid: accountTo.cuid,
      balance: accountTo.balance,
      value: value,
    }

    const updatedFrom = await this.accountRepository.updateBalance(origin.cuid, origin.balance - value);
    const updatedTo = await this.accountRepository.updateBalance(destiny.cuid, destiny.balance + value);

    await this.createTransaction({
      type: 'TRANSFER',
      cuid: origin.cuid,
      to: destiny.cuid,
      value,
    });

    await this.sendAccountToCache.sendingAccountsToCache([updatedFrom, updatedTo])
  }

  async createTransaction({ type, cuid, to, value }: CreateTransactionDto) {
    const transaction = await this.transactionRepository.create({
      type,
      accountFrom: { connect: { cuid: cuid } },
      accountTo: { connect: { cuid: to != undefined ? to : cuid } },
      value,
    });

    return transaction
  }
}
