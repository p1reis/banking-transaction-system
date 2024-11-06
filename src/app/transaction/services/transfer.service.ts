import { HttpException, HttpStatus } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';

import { CreateTransactionService } from './create-transaction.service';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { TransferMapper } from '../mappers/transaction.mapper';

export class TransferService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
    private readonly createTransaction: CreateTransactionService,
  ) { }

  async execute({ from, to, value }: CreateTransferDto) {
    const accountFrom =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(from);
    const accountTo =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(to);

    if (!accountFrom) {
      throw new HttpException(
        'Origin account not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!accountTo) {
      throw new HttpException(
        'Destiny account not found.',
        HttpStatus.NOT_FOUND,
      );
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

    const updatedFrom = await this.accountRepository.updateBalance(
      origin.cuid,
      origin.balance - value,
    );
    const updatedTo = await this.accountRepository.updateBalance(
      destiny.cuid,
      destiny.balance + value,
    );

    const transaction = await this.createTransaction.execute({
      type: 'TRANSFER',
      cuid: origin.cuid,
      to: destiny.cuid,
      value,
    });

    await this.sendAccountToCache.sendingAccountsToCache([
      updatedFrom,
      updatedTo,
    ]);

    return TransferMapper.map(transaction)
  }
}
