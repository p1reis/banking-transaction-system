import { Injectable } from '@nestjs/common';

import { CreateTransferDto } from '../dto/create-transfer.dto';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { TransferMapper } from '../mappers/transaction.mapper';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';

import { InsufficientBalance } from '../errors/handler.exception';
import { AccountNotFound } from '@/src/shared/errors/handler.exception';

@Injectable()
export class TransferService {
  constructor(
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
    private readonly transactionRepository: TransactionRepository,
  ) { }

  async execute({ origin, destiny, amount }: CreateTransferDto) {
    const { cuid: originCuid, balance: originBalance } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(origin);
    const { cuid: destinyCuid } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(destiny);

    if (!originCuid) {
      throw new AccountNotFound("Origin", origin)
    }

    if (!destinyCuid) {
      throw new AccountNotFound("Destiny", destiny)
    }

    if (originBalance < amount) {
      throw new InsufficientBalance()
    }

    const transfer = await this.transactionRepository.processTransfer(originCuid, destinyCuid, amount)

    await this.sendAccountToCache.sendingAccountsToCache([
      transfer[0],
      transfer[1],
    ]);

    return TransferMapper.map(transfer[2])
  }
}
