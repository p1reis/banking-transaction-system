import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateTransferDto } from '../dto/create-transfer.dto';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { TransferMapper } from '../mappers/transaction.mapper';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';

@Injectable()
export class TransferService {
  constructor(
    private readonly checkAccountUtils: CheckAccountUtils,
    private readonly sendAccountToCache: AccountsToCacheUtils,
    private readonly transactionRepository: TransactionRepository,
  ) { }

  async execute({ origin, destiny, value }: CreateTransferDto) {
    const { cuid: originCuid, balance: originBalance } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(origin);
    const { cuid: destinyCuid } =
      await this.checkAccountUtils.checkIfAccountExistsByNumber(destiny);

    if (!originCuid) {
      throw new HttpException(
        'Origin account not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!destinyCuid) {
      throw new HttpException(
        'Destiny account not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (originBalance < value) {
      throw new HttpException(
        'Insufficient balance in the origin account.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const transfer = await this.transactionRepository.processTransfer(originCuid, destinyCuid, value)

    await this.sendAccountToCache.sendingAccountsToCache([
      transfer[0],
      transfer[1],
    ]);

    return TransferMapper.map(transfer[2])
  }
}
