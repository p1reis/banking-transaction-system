import { HttpException, HttpStatus } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';

import { CreateTransactionService } from './create-transaction.service';
import { CreateWithdrawDto } from '../dto/create-withdraw.dto';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { WithdrawMapper } from '../mappers/transaction.mapper';

export class WithdrawService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
    private readonly createTransaction: CreateTransactionService,
  ) { }

  async execute({ from, value }: CreateWithdrawDto) {
    const { cuid, balance } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(from);

    if (!cuid) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }

    if (balance < value) {
      throw new HttpException(
        'Your balance is not enough to proceed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBalance = balance - value;

    const updated = await this.accountRepository.updateBalance(
      cuid,
      newBalance,
    );
    const transaction = await this.createTransaction.execute({
      type: 'WITHDRAW',
      cuid,
      value,
    });

    await this.sendAccountToCache.sendingAccountsToCache([updated]);
    return WithdrawMapper.map(transaction)
  }
}
