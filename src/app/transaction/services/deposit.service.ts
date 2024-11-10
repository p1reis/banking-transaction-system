import { HttpException, HttpStatus } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';

import { CreateTransactionService } from './create-transaction.service';
import { CreateDepositDto } from '../dto/create-deposit.dto';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { DepositMapper } from '../mappers/transaction.mapper';

export class DepositService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
    private readonly createTransaction: CreateTransactionService,
  ) { }

  async execute({ from, value }: CreateDepositDto) {
    const { cuid, balance } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(from);

    if (!cuid) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }

    const newBalance = balance + value;

    const updated = await this.accountRepository.updateBalance(
      cuid,
      newBalance,
    );
    const transaction = await this.createTransaction.execute({
      type: 'DEPOSIT',
      cuid,
      value,
    });

    await this.sendAccountToCache.sendingAccountsToCache([updated]);
    return DepositMapper.map(transaction)
  }
}
