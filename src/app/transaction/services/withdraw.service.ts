import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';

import { CreateWithdrawDto } from '../dto/create-withdraw.dto';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { WithdrawMapper } from '../mappers/transaction.mapper';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
  ) { }

  async execute({ origin, amount }: CreateWithdrawDto) {
    const { cuid, balance } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(origin);

    if (!cuid) {
      throw new HttpException(
        'Account not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (amount < 0) {
      throw new HttpException(
        'Amount value must be positive.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (balance < amount) {
      throw new HttpException(
        'Your balance is not enough to proceed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const withdraw = await this.transactionRepository.processWithdraw(
      cuid,
      amount,
    );

    await this.sendAccountToCache.sendingAccountsToCache([withdraw[0]]);
    return WithdrawMapper.map(withdraw[1])
  }
}
